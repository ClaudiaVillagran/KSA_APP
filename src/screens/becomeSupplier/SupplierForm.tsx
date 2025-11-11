import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import ControllerTextInput from "../../components/inputs/ControllerTextInput";
import ControllerDocumentPicker from "../../components/inputs/ControllerDocumentPicker";

type SupplierFormProps = {
  selectedPlan: "basico" | "pro" | "premium" ;
};

const normalizeDigits = (v?: string) =>
  typeof v === "string" ? v.replace(/\D+/g, "") : v;

const schema = yup
  .object({
    rut: yup
      .string()
      .required("El RUT es obligatorio.")
      .matches(/^\d{7,8}-[\dkK]$/, "Formato de RUT inválido. Ej: 12345678-5"),

    companyname: yup
      .string()
      .required("La Razón Social es obligatoria.")
      .min(3, "Debe tener al menos 3 caracteres."),

    commercialine: yup
      .string()
      .required("El giro comercial es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),

    commercialaddress: yup
      .string()
      .required("La dirección comercial es obligatoria.")
      .min(3, "Debe tener al menos 3 caracteres."),

    streetnumber: yup
      .string()
      .transform(normalizeDigits)
      .required("El número de calle es obligatorio.")
      .matches(/^\d+$/, "Solo números, sin puntos ni guiones. Ej: 124"),

    depnumber: yup
      .string()
      .transform(normalizeDigits)
      .required("Este campo es obligatorio.")
      .matches(/^\d+$/, "Solo números, sin puntos ni guiones. Ej: 302"),

    city: yup
      .string()
      .required("La ciudad es obligatoria.")
      .min(3, "Debe tener al menos 3 caracteres."),

    region: yup
      .string()
      .required("La región es obligatoria.")
      .min(3, "Debe tener al menos 3 caracteres."),

    commune: yup
      .string()
      .required("La comuna es obligatoria.")
      .min(3, "Debe tener al menos 3 caracteres."),

    phonenumber: yup
      .string()
      .transform(normalizeDigits) // quita +, espacios y guiones
      .required("El número de teléfono es obligatorio.")
      .test(
        "cl-9",
        "Ingresa 9 dígitos chilenos, sin +56 ni espacios. Ej: 912345678",
        (v) => !!v && /^\d{9}$/.test(v || "")
      ),

    email: yup
      .string()
      .required("El correo electrónico es obligatorio.")
      .email("Formato de correo inválido. Ej: nombre@dominio.com"),

    yearsold: yup
      .string()
      .transform(normalizeDigits)
      .required("Este campo es obligatorio.")
      .matches(/^\d+$/, "Solo números. Ej: 5"),

    document: yup
      .mixed()
      .required("Debes adjuntar un documento.")
      .test("fileAttached", "El documento es obligatorio.", (v: any) => !!v && !!v.name),
  })
  .required();

const FIELD_LABELS: Record<string, string> = {
  rut: "RUT",
  companyname: "Razón Social",
  commercialine: "Giro comercial",
  commercialaddress: "Dirección",
  streetnumber: "N° calle",
  depnumber: "N° Depto./Oficina",
  city: "Ciudad",
  region: "Región",
  commune: "Comuna",
  phonenumber: "Teléfono",
  email: "Correo electrónico",
  yearsold: "Años de antigüedad",
  document: "Documento",
};

type FormValues = yup.InferType<typeof schema>;

const SupplierForm = ({ selectedPlan }: SupplierFormProps) => {
  const navigation = useNavigation<any>();
  const auth = getAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onValid = (formData: FormValues) => {
    const user = auth.currentUser;
    console.log("user",user);
    // Normaliza el teléfono a 9 dígitos (por si llega con espacios u otros)
    const cleanPhone = (formData?.phonenumber || "").replace(/\D+/g, "");
    console.log("cleanPhone",cleanPhone);
    const payload = {
      supplierForm: { ...formData, phonenumber: cleanPhone },
      selectedPlan,
    };
    console.log("payload",payload);

    if (!user) {
      navigation.navigate("AuthStack", {
        screen: "AuthFlow",
        params: {
          redirectTo: "BillingDetails",
          redirectParams: payload,
        },
      });
      return;
    }
    console.log("userloged", user);
    navigation.navigate("BillingDetails", payload);
  };

  const onInvalid = (errs: any) => {
    const firstKey = Object.keys(errs)[0];
    const nice = FIELD_LABELS[firstKey] || firstKey;
    const msg = errs?.[firstKey]?.message || "Revisa los campos del formulario.";
    Alert.alert("Revisa tu formulario", `${nice}: ${msg}`);
    console.log("Errores de validación:", errs);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Ingrese a continuación los datos de tu empresa:</Text>

      <ControllerTextInput
        control={control}
        name="rut"
        placeholder="RUT Empresa (con guión) *  Ej: 12345678-5"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <ControllerTextInput
        control={control}
        name="companyname"
        placeholder="Razón Social *  Ej: Constructora ABC SpA"
        autoCapitalize="words"
      />
      <ControllerTextInput
        control={control}
        name="commercialine"
        placeholder="Giro comercial *  Ej: Construcción y mantención"
      />
      <ControllerTextInput
        control={control}
        name="commercialaddress"
        placeholder="Dirección *  Ej: Av. Siempre Viva"
      />
      <ControllerTextInput
        control={control}
        name="streetnumber"
        placeholder="N° calle *  Ej: 124"
        keyboardType="number-pad"
      />
      <ControllerTextInput
        control={control}
        name="depnumber"
        placeholder="N° Depto./Oficina *  Ej: 302"
        keyboardType="number-pad"
      />
      <ControllerTextInput
        control={control}
        name="city"
        placeholder="Ciudad *  Ej: Concepción"
      />
      <ControllerTextInput
        control={control}
        name="region"
        placeholder="Región (casa matriz) *  Ej: Biobío"
      />
      <ControllerTextInput
        control={control}
        name="commune"
        placeholder="Comuna (casa matriz) *  Ej: Lota"
      />
      <ControllerTextInput
        control={control}
        name="phonenumber"
        placeholder="Teléfono *  Ej: 912345678"
        keyboardType="phone-pad"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ControllerTextInput
        control={control}
        name="email"
        placeholder="Correo electrónico *  Ej: contacto@empresa.cl"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <ControllerTextInput
        control={control}
        name="yearsold"
        placeholder="Años de antigüedad (N°) *  Ej: 5"
        keyboardType="number-pad"
      />

      <ControllerDocumentPicker control={control} name="document" />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onValid, onInvalid)}>
        <Text style={styles.submitButtonText}>Suscribirse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#3BA7E1", // celeste KSA
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default SupplierForm;
