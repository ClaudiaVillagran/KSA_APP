import React, { useMemo, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

type SupplierFormPayload = {
  rut: string;
  companyname: string;
  commercialine: string;
  commercialaddress: string;
  streetnumber: string;
  depnumber: string;
  city: string;
  region: string;
  commune: string;
  phonenumber: string;
  email: string;
  yearsold: string;
  document: any;
};

type SelectedPlan = "monthly" | "semiannual" | "annual" | "flexible";

const fmtCLP = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const PLAN_META: Record<SelectedPlan, {
  key: SelectedPlan;
  label: string;
  price: number;
  priceLabel: string;
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
    price: 400,
    priceLabel: `${fmtCLP(0)} + IVA / año`,
    normalPrice: `${fmtCLP(500)} + IVA / año`,
    fine: ["Sólo 4500 cupos", `${fmtCLP(1)} + IVA / mes (opcional)`],
  },
  monthly: {
    key: "monthly",
    label: "Plan Premium (Mensual)",
    price: 150000,
    priceLabel: `${fmtCLP(150000)} + IVA / mes`,
    fine: ["Facturación mes a mes"],
  },
};

export default function BillingDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { supplierForm, selectedPlan }: { supplierForm?: SupplierFormPayload; selectedPlan?: SelectedPlan } = route.params || {};
  const safePlan: SelectedPlan = (selectedPlan as SelectedPlan) || "flexible";
  const meta = useMemo(() => PLAN_META[safePlan], [safePlan]);

  // ⚠️ SIN AUTOCOMPLETAR
  const [razonSocial, setRazonSocial] = useState("");
  const [rut, setRut] = useState("");
  const [giro, setGiro] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [region, setRegion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  // Botón opcional para copiar desde supplierForm (si lo quieres)
  const rellenarDesdeFormulario = () => {
    if (!supplierForm) {
      Alert.alert("Sin datos", "No hay datos previos del formulario de proveedor.");
      return;
    }
    setRazonSocial(supplierForm.companyname || "");
    setRut(supplierForm.rut || "");
    setGiro(supplierForm.commercialine || "");
    setDireccion(`${supplierForm.commercialaddress || ""} ${supplierForm.streetnumber || ""}`.trim());
    setComuna(supplierForm.commune || "");
    setCiudad(supplierForm.city || "");
    setRegion(supplierForm.region || "");
    setTelefono(supplierForm.phonenumber || "");
    setEmail(supplierForm.email || "");
  };

  const continuar = () => {
    // Validaciones mínimas para facturación (Chile)
    if (!razonSocial.trim()) return Alert.alert("Falta dato", "Ingresa la Razón Social.");
    if (!rut.trim()) return Alert.alert("Falta dato", "Ingresa el RUT.");
    if (!direccion.trim()) return Alert.alert("Falta dato", "Ingresa la Dirección.");
    if (!comuna.trim()) return Alert.alert("Falta dato", "Ingresa la Comuna.");
    if (!ciudad.trim()) return Alert.alert("Falta dato", "Ingresa la Ciudad.");
    if (!region.trim()) return Alert.alert("Falta dato", "Ingresa la Región.");
    if (!email.trim()) return Alert.alert("Falta dato", "Ingresa el Correo de facturación.");

    const billing = {
      razonSocial: razonSocial.trim(),
      rut: rut.trim(),
      giro: giro.trim(),
      direccion: direccion.trim(),
      comuna: comuna.trim(),
      ciudad: ciudad.trim(),
      region: region.trim(),
      telefono: telefono.trim(),
      email: email.trim(),
    };

    navigation.navigate("Checkout", {
      supplierForm,
      billing,
      selectedPlan: safePlan,
      orderItem: {
        sku: safePlan,
        name: meta.label,
        price: meta.price,
        priceLabel: meta.priceLabel,
        normalPrice: meta.normalPrice,
        fine: meta.fine,
      },
      userEmail: email.trim() || supplierForm?.email || null,
    });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.h1}>Datos de factura</Text>

      {/* Resumen del plan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen de tu plan</Text>
        <Text style={styles.planLabel}>{meta.label}</Text>
        <Text style={styles.priceNow}>{meta.priceLabel}</Text>
        {!!meta.normalPrice && (
          <Text style={styles.normal}>
            Precio normal <Text style={styles.strike}>{meta.normalPrice}</Text>
          </Text>
        )}
        {meta.fine?.map((f, i) => (
          <Text key={i} style={styles.fine}>{f}</Text>
        ))}
      </View>

      {/* Datos de facturación (todos vacíos) */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de facturación</Text>

        <TextInput style={styles.input} placeholder="Razón Social *" value={razonSocial} onChangeText={setRazonSocial} />
        <TextInput style={styles.input} placeholder="RUT (Ej: 12345678-5) *" value={rut} onChangeText={setRut} autoCapitalize="characters" />
        <TextInput style={styles.input} placeholder="Giro (actividad) *" value={giro} onChangeText={setGiro} />
        <TextInput style={styles.input} placeholder="Dirección *" value={direccion} onChangeText={setDireccion} />
        <TextInput style={styles.input} placeholder="Comuna *" value={comuna} onChangeText={setComuna} />
        <TextInput style={styles.input} placeholder="Ciudad *" value={ciudad} onChangeText={setCiudad} />
        <TextInput style={styles.input} placeholder="Región *" value={region} onChangeText={setRegion} />
        <TextInput style={styles.input} placeholder="Teléfono (9 dígitos) " value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Correo de facturación *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        {/* Quita este botón si no quieres ofrecer autollenado */}
        <TouchableOpacity onPress={rellenarDesdeFormulario} style={[styles.ctaGhost, { marginTop: 8 }]}>
          <Text style={styles.ctaGhostText}>Rellenar con datos del formulario</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={continuar} style={styles.cta}>
        <Text style={styles.ctaText}>Continuar a pago</Text>
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
  planLabel: { fontSize: 16, fontWeight: "700", color: "#102331" },
  priceNow: { marginTop: 4, fontSize: 16, fontWeight: "800", color: "#102331" },
  normal: { marginTop: 6, color: "#5E7283" },
  strike: { textDecorationLine: "line-through", color: "#7F93A3" },
  fine: { color: "#5E7283", fontSize: 12, marginTop: 2 },
  input: {
    borderWidth: 1, borderColor: "#E2EDF6", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, marginTop: 8, backgroundColor: "#fff",
  },
  cta: { backgroundColor: "#3BA7E1", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 4 },
  ctaText: { color: "#fff", fontWeight: "800" },
  ctaGhost: {
    backgroundColor: "transparent", borderWidth: 1, borderColor: "#CFE8FF",
    borderRadius: 10, paddingVertical: 10, alignItems: "center",
  },
  ctaGhostText: { color: "#0B4C7A", fontWeight: "800" },
});
