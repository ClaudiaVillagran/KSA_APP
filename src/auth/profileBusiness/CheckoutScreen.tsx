// screens/checkout/CheckoutScreen.tsx
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getFirestore,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

type SelectedPlan = "basico" | "pro" | "premium";

const fmtCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const PLAN_META: Record<
  SelectedPlan,
  { key: SelectedPlan; label: string; price: number; priceLabel: string; normalPrice?: string; fine?: string[] }
> = {
  basico: {
    key: "basico",
    label: "Plan Básico (5% comisión)",
    price: 0,
    priceLabel: "GRATIS",
    fine: ["Sólo pagas 5% de comisión por venta"],
  },
  pro: {
    key: "pro",
    label: "Plan Pro (Semestral)",
    price: 720000,
    priceLabel: `${fmtCLP(720000)} + IVA / semestre`,
    normalPrice: `${fmtCLP(990000)} + IVA`,
    fine: ["Sólo 500 cupos"],
  },
  premium: {
    key: "premium",
    label: "Plan Premium (Anual)",
    price: 400,
    priceLabel: `${fmtCLP(0)} + IVA / año`,
    normalPrice: `${fmtCLP(500)} + IVA / año`,
    fine: ["Sólo 4500 cupos", `${fmtCLP(500)} + IVA / mes (opcional)`],
  },
};

// Tu backend en Render (sin slash final)
const API_BASE = "https://ksapp-backend.onrender.com".replace(/\/+$/, "");
// Deep link de retorno (en dev será exp://..., en prod usa tu scheme ksapp://)
const CALLBACK = Linking.createURL("pay/return");

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const db = getFirestore();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { supplierForm, billing, selectedPlan: rawSelectedPlan, orderItem } = route.params || {};
  const selectedPlan: SelectedPlan = (rawSelectedPlan as SelectedPlan) || "basico";

  // Deriva datos del plan
  const meta = useMemo(() => PLAN_META[selectedPlan], [selectedPlan]);
  const item = useMemo(() => {
    if (orderItem) return orderItem;
    return {
      sku: selectedPlan,
      name: meta.label,
      price: meta.price,
      priceLabel: meta.priceLabel,
      normalPrice: meta.normalPrice,
      fine: meta.fine,
    };
  }, [orderItem, selectedPlan]);

  // Totales
  const { subtotal, iva, total } = useMemo(() => {
    if (!item?.price || item.price === 0) return { subtotal: 0, iva: 0, total: 0 };
    const sub = item.price;
    const tax = Math.round(sub * 0.19);
    return { subtotal: sub, iva: tax, total: sub + tax };
  }, [item]);

  // Lanza flujo Webpay (usa backend que hace double-encode del callback)
  async function pagarConWebpay(totalCLP: number) {
    const resp = await fetch(`${API_BASE}/payment/start-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(totalCLP),
        orderId: `KSA-${Date.now()}`,
        callback: CALLBACK, // el backend lo double-encodea para que Transbank no rompa el path
      }),
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      throw new Error(t || "No se pudo iniciar el pago");
    }
    const { forwardUrl } = await resp.json();
    if (!forwardUrl) throw new Error("Respuesta inválida del backend (sin forwardUrl)");

    // Abre Webpay y espera al deep link de retorno
    const result = await WebBrowser.openAuthSessionAsync(forwardUrl, CALLBACK);
    if (result.type !== "success") throw new Error("Pago cancelado por el usuario");

    // Transforma el deep link de retorno a objeto y valida status
    const parsed = Linking.parse(result.url);
    const status = String(parsed.queryParams?.status || "failed");
    if (status !== "success") {
      const code = String(parsed.queryParams?.code ?? "?");
      throw new Error(`Pago rechazado (código ${code})`);
    }

    // Devuelve info útil para crear la orden
    return {
      tbk: {
        order: String(parsed.queryParams?.order ?? ""),
        token_ws: String(parsed.queryParams?.token_ws ?? ""),
        code: String(parsed.queryParams?.code ?? ""),
        amount: Number(parsed.queryParams?.amount ?? 0),
      },
    };
  }

  const pay = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert("Ups", "Sesión expirada. Inicia sesión de nuevo.");
        navigation.replace("AuthFlow", {
          redirectTo: "Checkout",
          redirectParams: route.params,
        });
        return;
      }

      // 1) Si el plan es pagado, dispara Webpay y guarda info retorno
      let tbkInfo:
        | { tbk: { order: string; token_ws: string; code: string; amount: number } }
        | null = null;

      if (item.price > 0) {
        tbkInfo = await pagarConWebpay(total);
      }

      // 2) Activa plan en Firestore (perfil del usuario)
      await setDoc(
        doc(db, "users", uid),
        {
          isBusiness: true,
          businessPlan: selectedPlan,
          businessSince: serverTimestamp(),
          billing: billing || null,
        },
        { merge: true }
      );

      // 3) Crea la orden en subcolección: users/{uid}/orders
      const status = item.price === 0 ? "confirmed" : "paid";
      const gateway = item.price === 0 ? "free" : "webpay";

      await addDoc(collection(db, "users", uid, "orders"), {
        uid,
        item, // { sku, name, price, ... }
        billing: billing || null,
        supplierForm: supplierForm || null,
        amounts: { subtotal, iva, total },
        status, // 'confirmed' | 'paid'
        gateway, // 'free' | 'webpay'
        tbk: tbkInfo?.tbk || null, // { order, token_ws, code, amount } ó null
        createdAt: serverTimestamp(),
      });

      // 4) Refresca Redux
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data() as any;
        dispatch(
          setUser({
            uid,
            email: auth.currentUser!.email,
            displayName: data.displayName || "Usuario",
            isBusiness: !!data.isBusiness,
            businessPlan: data.businessPlan ?? null,
            billing: data.billing ?? null,
          })
        );
      }

      // 5) UI
      Alert.alert(
        "¡Listo!",
        item.price === 0 ? "Tu suscripción al Plan Básico fue confirmada." : "Pago recibido. Suscripción activada."
      );
      navigation.replace("PrincipalTabs");
    } catch (e: any) {
      Alert.alert("Pago no completado", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Resumen de compra</Text>

      {/* Ítem */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Plan seleccionado</Text>
        <Text style={styles.planName}>{item?.name ?? "—"}</Text>
        <Text style={styles.priceNow}>{item?.priceLabel ?? "—"}</Text>
        {!!item?.normalPrice && (
          <Text style={styles.normal}>
            Precio normal <Text style={styles.strike}>{item.normalPrice}</Text>
          </Text>
        )}
        {item?.fine?.map((f: string, i: number) => (
          <Text key={i} style={styles.fine}>{f}</Text>
        ))}
      </View>

      {/* Totales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalle</Text>
        {item?.price === 0 ? (
          <>
            <Text style={styles.row}><Text style={styles.label}>Plan Básico:</Text> {fmtCLP(0)}</Text>
            <Text style={styles.note}>
              Este plan es gratuito. Sólo se aplica una comisión del 5% por venta realizada en la plataforma.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.row}><Text style={styles.label}>Subtotal:</Text> {fmtCLP(subtotal)}</Text>
            <Text style={styles.row}><Text style={styles.label}>IVA (19%):</Text> {fmtCLP(iva)}</Text>
            <Text style={[styles.row, styles.total]}><Text style={styles.label}>Total:</Text> {fmtCLP(total)}</Text>
          </>
        )}
      </View>

      {/* Facturación */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos de facturación</Text>
        <Text style={styles.row}><Text style={styles.label}>Razón Social:</Text> {billing?.razonSocial ?? "—"}</Text>
        <Text style={styles.row}><Text style={styles.label}>RUT:</Text> {billing?.rut ?? "—"}</Text>
        <Text style={styles.row}><Text style={styles.label}>Dirección:</Text> {billing?.direccion ?? "—"}</Text>
        <Text style={styles.row}><Text style={styles.label}>Correo:</Text> {auth.currentUser?.email ?? supplierForm?.email ?? "—"}</Text>
      </View>

      <TouchableOpacity onPress={pay} style={[styles.cta, loading && { opacity: 0.7 }]} disabled={loading}>
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.ctaText}>Procesando…</Text>
          </View>
        ) : (
          <Text style={styles.ctaText}>
            {item?.price === 0 ? "Confirmar suscripción" : "Confirmar y pagar"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: "#F3F4F6", flex: 1 },
  h1: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#0b2330" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E2EDF6", padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#102331", marginBottom: 8 },
  planName: { fontSize: 16, fontWeight: "800", color: "#102331" },
  priceNow: { marginTop: 4, fontSize: 16, fontWeight: "800", color: "#102331" },
  normal: { marginTop: 6, color: "#5E7283" },
  strike: { textDecorationLine: "line-through", color: "#7F93A3" },
  fine: { color: "#5E7283", fontSize: 12, marginTop: 2 },
  row: { color: "#102331", marginTop: 4 },
  label: { fontWeight: "700" },
  total: { marginTop: 8, fontSize: 16 },
  note: { color: "#5E7283", fontSize: 12, marginTop: 6 },
  cta: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
