import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getFirestore, getDoc, addDoc, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
// import { clearCart } from "../../store/reducers/cartSlice"; // <- si tienes esta acción, descomenta

type LineItem = { id: string; title: string; unitPrice: number; qty: number; image?: string | null };
type RouteParams = {
  billing: {
    firstName: string; lastName: string; country: string; commune: string; street: string;
    phone: string; email: string; note?: string;
  };
  lineItems: LineItem[];
};

// Backend (sin slash final) y deep link de retorno:
const API_BASE = "https://ksapp-backend.onrender.com".replace(/\/+$/, "");
const CALLBACK = Linking.createURL("pay/return");

const fmtCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export default function CartCheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const db = getFirestore();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { billing, lineItems }: RouteParams = route.params || { billing: null, lineItems: [] };

  const { subtotal, iva, total } = useMemo(() => {
    const sub = (lineItems || []).reduce((acc, it) => acc + (it.unitPrice || 0) * (it.qty || 0), 0);
    const tax = Math.round(sub * 0.19);
    return { subtotal: sub, iva: tax, total: sub + tax };
  }, [lineItems]);

  async function pagarConWebpay(totalCLP: number) {
    const resp = await fetch(`${API_BASE}/payment/start-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(totalCLP),
        orderId: `KSA-CART-${Date.now()}`,
        callback: CALLBACK,
      }),
    });
    if (!resp.ok) {
      const t = await resp.text().catch(() => "");
      throw new Error(t || "No se pudo iniciar el pago");
    }
    const { forwardUrl } = await resp.json();
    if (!forwardUrl) throw new Error("Respuesta inválida del backend (sin forwardUrl)");

    const result = await WebBrowser.openAuthSessionAsync(forwardUrl, CALLBACK);
    if (result.type !== "success") throw new Error("Pago cancelado por el usuario");

    const parsed = Linking.parse(result.url);
    const status = String(parsed.queryParams?.status || "failed");
    if (status !== "success") {
      const code = String(parsed.queryParams?.code ?? "?");
      throw new Error(`Pago rechazado (código ${code})`);
    }

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
          redirectTo: "CartCheckout",
          redirectParams: route.params,
        });
        return;
      }

      // 1) Disparar Webpay (el carrito siempre debiera ser > 0)
      let tbkInfo: { tbk: { order: string; token_ws: string; code: string; amount: number } } | null = null;
      if (total > 0) tbkInfo = await pagarConWebpay(total);

      // 2) Guardar datos "de envío/factura" mínimos en perfil (merge)
      await setDoc(
        doc(db, "users", uid),
        {
          lastCheckoutBilling: billing,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // 3) Crear orden en users/{uid}/orders
      await addDoc(collection(db, "users", uid, "orders"), {
        uid,
        source: "cart",
        lineItems,
        amounts: { subtotal, iva, total },
        billing,
        status: "paid",
        gateway: "webpay",
        tbk: tbkInfo?.tbk || null,
        createdAt: serverTimestamp(),
      });

      // 4) Refrescar Redux user (opcional)
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
            billing: data.lastCheckoutBilling ?? null,
          })
        );
      }

      // 5) Vaciar carrito (si tienes acción)
      // dispatch(clearCart());

      Alert.alert("¡Pago recibido!", "Tu pedido fue registrado correctamente.");
      navigation.replace("PrincipalTabs");
    } catch (e: any) {
      Alert.alert("Pago no completado", e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Resumen de pedido</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tus productos</Text>
        {lineItems?.map((it) => (
          <Text key={it.id} style={styles.row}>
            {it.title} · {fmtCLP(it.unitPrice)} × {it.qty}
          </Text>
        ))}

        <View style={styles.sep} />
        <Text style={styles.row}><Text style={styles.label}>Subtotal:</Text> {fmtCLP(subtotal)}</Text>
        <Text style={styles.row}><Text style={styles.label}>IVA (19%):</Text> {fmtCLP(iva)}</Text>
        <Text style={[styles.row, styles.total]}><Text style={styles.label}>Total:</Text> {fmtCLP(total)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos de contacto/envío</Text>
        <Text style={styles.row}><Text style={styles.label}>Nombre:</Text> {billing?.firstName} {billing?.lastName}</Text>
        <Text style={styles.row}><Text style={styles.label}>Correo:</Text> {billing?.email}</Text>
        <Text style={styles.row}><Text style={styles.label}>Teléfono:</Text> {billing?.phone}</Text>
        <Text style={styles.row}><Text style={styles.label}>Dirección:</Text> {billing?.street}, {billing?.commune}, {billing?.country}</Text>
        {!!billing?.note && <Text style={styles.row}><Text style={styles.label}>Nota:</Text> {billing?.note}</Text>}
      </View>

      <TouchableOpacity onPress={pay} style={[styles.cta, loading && { opacity: 0.7 }]} disabled={loading}>
        {loading ? (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.ctaText}>Procesando…</Text>
          </View>
        ) : (
          <Text style={styles.ctaText}>Confirmar y pagar</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: "#F3F4F6", flexGrow: 1 },
  h1: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#0b2330" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E2EDF6", padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#102331", marginBottom: 8 },
  row: { color: "#102331", marginTop: 4 },
  sep: { height: 1, backgroundColor: "#E2EDF6", marginVertical: 10 },
  label: { fontWeight: "700" },
  total: { marginTop: 8, fontSize: 16 },
  cta: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
