// BillingDetailsScreen.tsx (mínimo)
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function BillingDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { supplierForm, selectedPlan } = route.params || {};
  const [razonSocial, setRazonSocial] = useState(
    supplierForm?.CompanyName || ""
  );
  const [rut, setRut] = useState(supplierForm?.Rut || "");
  const [direccion, setDireccion] = useState(
    supplierForm?.CommercialAddress || ""
  );

  const continuar = () => {
    navigation.navigate("Checkout", {
      supplierForm,
      billing: { razonSocial, rut, direccion },
      selectedPlan, // ⬅️ pásalo a Checkout
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Datos de factura
      </Text>
      <TextInput
        placeholder="Razón Social"
        value={razonSocial}
        onChangeText={setRazonSocial}
        style={{ borderWidth: 1, marginBottom: 8, padding: 10 }}
      />
      <TextInput
        placeholder="RUT"
        value={rut}
        onChangeText={setRut}
        style={{ borderWidth: 1, marginBottom: 8, padding: 10 }}
      />
      <TextInput
        placeholder="Dirección"
        value={direccion}
        onChangeText={setDireccion}
        style={{ borderWidth: 1, marginBottom: 12, padding: 10 }}
      />

      <TouchableOpacity
        onPress={continuar}
        style={{ backgroundColor: "#007BFF", padding: 12, borderRadius: 8 }}
      >
        <Text
          style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
        >
          Continuar a pago
        </Text>
      </TouchableOpacity>
    </View>
  );
}
