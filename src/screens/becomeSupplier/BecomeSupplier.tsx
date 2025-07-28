import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import SupplierForm from "./SupplierForm";
import { ScrollView } from "react-native-gesture-handler";

export default function BecomeSupplier() {
  const [paymentFrequency, setPaymentFrequency] = useState("monthly");

  // Precios según frecuencia de pago
  const prices = {
    monthly: 147276, // Mensual
    semiannual: 123960, // Semestral
    annual: 112303, // Anual
  };

  // Planes correspondientes a la frecuencia de pago
  const plans = {
    monthly: "Básico", // Mensual → Plan Básico
    semiannual: "Pro", // Semestral → Plan Pro
    annual: "Premium", // Anual → Plan Premium
  };

  // Función para obtener el precio y el plan adecuado
  const getPriceAndPlan = () => {
    const price = prices[paymentFrequency];
    const plan = plans[paymentFrequency];
    return { price, plan };
  };

  const { price, plan } = getPriceAndPlan();

  // Fuente de la imagen según el plan seleccionado
  const getImageSource = () => {
    switch (plan) {
      case "Básico":
        return require("../../assets/img/planBasico.webp");
      case "Pro":
        return require("../../assets/img/planPro.webp");
      case "Premium":
        return require("../../assets/img/planPremium.webp");
      default:
        return require("../../assets/img/planBasico.webp"); // Imagen predeterminada
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          {/* Mostrar la imagen según el plan seleccionado */}
          <Image
            style={styles.image}
            source={getImageSource()}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.header}>Suscripción Proveedores KSA</Text>

        <Text style={styles.description}>
          Selecciona nuestro Plan KSA que más te acomode y únete a nuestro
          ecosistema, muestra tus servicios y productos en ella. Da a conocer tu
          empresa un salto hacia el futuro digital, con beneficios exclusivos,
          de acuerdo al Plan contratado.
        </Text>

        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Selecciona la frecuencia de pago</Text>
          <Picker
            selectedValue={paymentFrequency}
            onValueChange={(itemValue) => setPaymentFrequency(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Mensual" value="monthly" />
            <Picker.Item label="Semestral" value="semiannual" />
            <Picker.Item label="Anual" value="annual" />
          </Picker>
        </View>

        <View style={styles.planDetailsContainer}>
          <Text style={styles.selectionText}>
            Has seleccionado el plan: {plan} (precio{" "}
            {paymentFrequency === "monthly"
              ? "mensual"
              : paymentFrequency === "semiannual"
              ? "semestral"
              : "anual"}
            )
          </Text>

          <Text style={styles.priceText}>Precio: ${price} CLP</Text>

          <Text style={styles.noteText}>
            El precio corresponde a la frecuencia seleccionada.
          </Text>
        </View>

        {/* Componente del formulario de la empresa */}
        <SupplierForm
          // onSubmit={(formData) => console.log("Formulario enviado:", formData)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  picker: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  planDetailsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  selectionText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  priceText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
  },
});
