import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControllerTextInput from "../../components/inputs/ControllerTextInput";

const normalizeDigits = (v?: string) => (typeof v === "string" ? v.replace(/\D+/g, "") : v);

const schema = yup.object({
  firstName: yup.string().required("El nombre es obligatorio").min(3, "Mínimo 3 caracteres"),
  lastName:  yup.string().required("Los apellidos son obligatorios").min(3, "Mínimo 3 caracteres"),
  country:   yup.string().required("El país es obligatorio"),
  commune:   yup.string().required("La comuna es obligatoria").min(3, "Mínimo 3 caracteres"),
  street:    yup.string().required("La calle es obligatoria").min(3, "Mínimo 3 caracteres"),
  phone:     yup.string().transform(normalizeDigits).required("El teléfono es obligatorio").matches(/^\d{9}$/, "9 dígitos (sin +56)"),
  email:     yup.string().required("El correo es obligatorio").email("Correo inválido"),
  note:      yup.string().optional(),
}).required();

type FormValues = yup.InferType<typeof schema>;

export default function CartBillingDetailsScreen() {
  const navigation = useNavigation<any>();
  const { items } = useSelector((state: RootState) => state.cartSlice);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onValid = (formData: FormValues) => {
    if (!items?.length) {
      Alert.alert("Carrito vacío", "Agrega servicios antes de continuar.");
      return;
    }
    const lineItems = items.map((it: any) => ({
      id: it.id,
      title: it.title,
      unitPrice: (typeof it.price === "number" ? it.price : it.sum) || 0,
      qty: it.qty || 0,
      image: it.image || null,
    }));

    // Ahora vamos a la pantalla de disponibilidad (nuevo paso)
    navigation.navigate("CartAvailability", {
      billing: {
        firstName: formData.firstName.trim(),
        lastName:  formData.lastName.trim(),
        country:   formData.country.trim(),
        commune:   formData.commune.trim(),
        street:    formData.street.trim(),
        phone:     formData.phone.trim(),
        email:     formData.email.trim(),
        note:      formData.note?.trim() || "",
      },
      lineItems,
    });
  };

  const onInvalid = (errs: any) => {
    const firstKey = Object.keys(errs)[0];
    const msg = errs?.[firstKey]?.message || "Revisa los campos del formulario.";
    Alert.alert("Revisa tu formulario", msg);
  };

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <Text style={styles.h1}>Datos de contacto</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información del comprador</Text>
        <ControllerTextInput control={control} name="firstName" placeholder="Nombre *" />
        <ControllerTextInput control={control} name="lastName"  placeholder="Apellidos *" />
        <ControllerTextInput control={control} name="country"   placeholder="País * (Ej: Chile)" autoCapitalize="words" />
        <ControllerTextInput control={control} name="commune"   placeholder="Comuna *" autoCapitalize="words" />
        <ControllerTextInput control={control} name="street"    placeholder="Calle y número *" />
        <ControllerTextInput control={control} name="phone"     placeholder="Teléfono * (9 dígitos)" keyboardType="phone-pad" />
        <ControllerTextInput control={control} name="email"     placeholder="Correo electrónico *" keyboardType="email-address" autoCapitalize="none" />
        <ControllerTextInput control={control} name="note"      placeholder="Nota adicional (opcional)" />
      </View>

      <TouchableOpacity onPress={handleSubmit(onValid, onInvalid)} style={styles.cta}>
        <Text style={styles.ctaText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, backgroundColor: "#F3F4F6", flexGrow: 1 },
  h1: { fontSize: 20, fontWeight: "800", marginBottom: 12, color: "#0b2330" },
  card: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#E2EDF6", padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: "800", color: "#102331", marginBottom: 8 },
  cta: { backgroundColor: "#3BA7E1", padding: 12, borderRadius: 10, alignItems: "center" },
  ctaText: { color: "#fff", fontWeight: "800" },
});
