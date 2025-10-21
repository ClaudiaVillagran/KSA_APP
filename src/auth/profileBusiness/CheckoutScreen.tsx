import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { doc, setDoc, serverTimestamp, getFirestore, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";

type SelectedPlan = "flexible" | "semiannual" | "annual" | "monthly";

const fmtCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const PLAN_META: Record<SelectedPlan, {
  key: SelectedPlan;
  label: string;
  price: number;            // neto sin IVA
  priceLabel: string;       // cómo se muestra
  normalPrice?: string;
  fine?: string[];
}> = {
  flexible: {
    key: "flexible",
    label: "Plan Básico (5% comisión)",
    price: 0,
    priceLabel: "GRATIS",
    fine: ["Sólo pagas 5% de comisión por venta"],
  },
  semiannual: {
    key: "semiannual",
    label: "Plan Pro (Semestral)",
    price: 720000,
    priceLabel: `${fmtCLP(720000)} + IVA / semestre`,
    normalPrice: `${fmtCLP(990000)} + IVA`,
    fine: ["Sólo 500 cupos"],
  },
  annual: {
    key: "annual",
    label: "Plan Premium (Anual)",
    price: 1500000,
    priceLabel: `${fmtCLP(1500000)} + IVA / año`,
    normalPrice: `${fmtCLP(2500000)} + IVA / año`,
    fine: ["Sólo 4500 cupos", `${fmtCLP(150000)} + IVA / mes (opcional)`],
  },
  monthly: {
    key: "monthly",
    label: "Plan Premium (Mensual)",
    price: 150000,
    priceLabel: `${fmtCLP(150000)} + IVA / mes`,
    fine: ["Facturación mes a mes"],
  },
};

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const db = getFirestore();
  const dispatch = useDispatch();

  const {
    supplierForm,
    billing,
    selectedPlan: rawSelectedPlan,
    orderItem, // opcional: { sku, name, price, priceLabel, normalPrice?, fine? }
  } = route.params || {};

  // Normaliza plan
  const selectedPlan: SelectedPlan =
    (rawSelectedPlan as SelectedPlan) || "flexible";

  // Si no llega orderItem, lo derivamos del plan
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

  const pay = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert("Ups", "Sesión expirada. Inicia sesión de nuevo.");
        navigation.replace("AuthFlow", {
          redirectTo: "Checkout",
          redirectParams: route.params,
        });
        return;
      }

      // Marca la cuenta como Business con plan
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

      // Refresca Redux
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

      // (Opcional) Registrar pedido/order:
      // await addDoc(collection(db, "orders"), {
      //   uid,
      //   item,
      //   billing: billing || null,
      //   supplierForm: supplierForm || null,
      //   amounts: { subtotal, iva, total },
      //   status: item.price === 0 ? "confirmed" : "pending_payment",
      //   createdAt: serverTimestamp(),
      // });

      Alert.alert(
        "¡Listo!",
        item.price === 0
          ? "Tu suscripción al Plan Básico fue confirmada."
          : "Tu suscripción fue procesada."
      );

      navigation.replace("PrincipalTabs");
    } catch (e: any) {
      Alert.alert("Error", e.message);
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
            <Text style={styles.row}>
              <Text style={styles.label}>Plan Básico:</Text> {fmtCLP(0)}
            </Text>
            <Text style={styles.note}>
              Este plan es gratuito. Sólo se aplica una comisión del 5% por venta realizada en la plataforma.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.row}>
              <Text style={styles.label}>Subtotal:</Text> {fmtCLP(subtotal)}
            </Text>
            <Text style={styles.row}>
              <Text style={styles.label}>IVA (19%):</Text> {fmtCLP(iva)}
            </Text>
            <Text style={[styles.row, styles.total]}>
              <Text style={styles.label}>Total:</Text> {fmtCLP(total)}
            </Text>
          </>
        )}
      </View>

      {/* Facturación */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Datos de facturación</Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Razón Social:</Text> {billing?.razonSocial ?? "—"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>RUT:</Text> {billing?.rut ?? "—"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Dirección:</Text> {billing?.direccion ?? "—"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Correo:</Text> {auth.currentUser?.email ?? supplierForm?.email ?? "—"}
        </Text>
      </View>

      <TouchableOpacity onPress={pay} style={styles.cta}>
        <Text style={styles.ctaText}>
          {item?.price === 0 ? "Confirmar suscripción" : "Confirmar y pagar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: "#F3F4F6", flex: 1 },
  h1: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#0b2330" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2EDF6",
    padding: 14,
    marginBottom: 12,
  },
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
