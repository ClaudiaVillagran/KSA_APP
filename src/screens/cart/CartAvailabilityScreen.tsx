import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControllerTextInput from "../../components/inputs/ControllerTextInput";

type LineItem = { id: string; title: string; unitPrice: number; qty: number; image?: string | null };
type RouteParams = {
  billing: {
    firstName: string; lastName: string; country: string; commune: string; street: string;
    phone: string; email: string; note?: string;
  };
  lineItems: LineItem[];
};

const schema = yup.object({
  date:  yup.string().required("Ingresa una fecha").matches(/^\d{4}-\d{2}-\d{2}$/, "Usa formato YYYY-MM-DD"),
  start: yup.string().required("Hora de inicio").matches(/^\d{2}:\d{2}$/, "Usa HH:mm"),
  end:   yup.string().required("Hora de término").matches(/^\d{2}:\d{2}$/, "Usa HH:mm"),
}).required();

type FormValues = yup.InferType<typeof schema>;

export default function CartAvailabilityScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { billing, lineItems }: RouteParams = route.params || { billing: null, lineItems: [] };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onValid = (formData: FormValues) => {
    if (!lineItems?.length) {
      Alert.alert("Carrito vacío", "Agrega servicios antes de continuar.");
      return;
    }
    navigation.navigate("CartCheckout", {
      billing,
      lineItems,
      requested: {
        date: formData.date.trim(),
        start: formData.start.trim(),
        end: formData.end.trim(),
      },
    });
  };

  const onInvalid = (errs: any) => {
    const firstKey = Object.keys(errs)[0];
    const msg = errs?.[firstKey]?.message || "Revisa los campos.";
    Alert.alert("Revisa tu formulario", msg);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Proponer disponibilidad</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fecha y horario sugeridos</Text>
        <ControllerTextInput control={control} name="date"  placeholder="Fecha (YYYY-MM-DD)" />
        <ControllerTextInput control={control} name="start" placeholder="Hora inicio (HH:mm)" />
        <ControllerTextInput control={control} name="end"   placeholder="Hora fin (HH:mm)" />
        <Text style={styles.helper}>
          Esta disponibilidad se enviará a cada proveedor de los servicios contratados. Podrán aceptarla o proponerte cambios.
        </Text>
      </View>

      <TouchableOpacity onPress={handleSubmit(onValid, onInvalid)} style={styles.cta}>
        <Text style={styles.ctaText}>Continuar a pago</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: "#F3F4F6", flexGrow: 1 },
  h1: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#0b2330" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E2EDF6", padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#102331", marginBottom: 8 },
  helper: { color: "#5E7283", fontSize: 12, marginTop: 8, lineHeight: 18 },
  cta: { backgroundColor: "#3BA7E1", padding: 12, borderRadius: 10, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800" },
});
