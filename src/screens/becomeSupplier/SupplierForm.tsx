import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";

import ControllerTextInput from "../../components/inputs/ControllerTextInput";
import ControllerDocumentPicker from "../../components/inputs/ControllerDocumentPicker";

type SupplierFormProps = {
  selectedPlan: "monthly" | "semiannual" | "annual" | "flexible";
};

const schema = yup
  .object({
    rut: yup
      .string()
      .required("El RUT es obligatorio")
      .matches(/^\d{7,8}-[\dkK]$/, "Formato de RUT inválido (ej: 12345678-5)"),
    companyname: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    commercialine: yup
      .string()
      .required("El giro comercial es obligatorio")
      .min(3, "El giro comercial debe tener al menos 3 caracteres"),
    commercialaddress: yup
      .string()
      .required("La dirección comercial es obligatoria")
      .min(3, "La dirección comercial debe tener al menos 3 caracteres"),
    streetnumber: yup
      .string()
      .required("El número de calle es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
    depnumber: yup
      .string()
      .required("Este campo es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
    city: yup
      .string()
      .required("La ciudad es obligatoria")
      .min(3, "La ciudad debe tener al menos 3 caracteres"),
    region: yup
      .string()
      .required("La región es obligatoria")
      .min(3, "La región debe tener al menos 3 caracteres"),
    commune: yup
      .string()
      .required("La comuna es obligatoria")
      .min(3, "La comuna debe tener al menos 3 caracteres"),
    phonenumber: yup
      .string()
      .required("El número de teléfono es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números")
      .min(9, "El número debe tener 9 dígitos")
      .max(9, "El número debe tener 9 dígitos"),
    email: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("Correo inválido"),
    yearsold: yup
      .string()
      .required("Este campo es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
    document: yup
      .mixed()
      .required("Debes adjuntar un documento")
      .test("fileAttached", "El documento es obligatorio", (value: any) => {
        return !!value && !!value.name; // debe tener name
      }),
  })
  .required();

const SupplierForm = ({ selectedPlan }: SupplierFormProps) => {
  const navigation = useNavigation<any>();
  const auth = getAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onValid = (formData: any) => {
    const user = auth.currentUser;

    // Payload que reenviaremos por las pantallas
    const payload = {
      supplierForm: formData,
      selectedPlan,
    };

    if (!user) {
      // No logueado → AuthFlow con redirect
      navigation.navigate("AuthStack", {
        screen: "AuthFlow",
        params: {
          redirectTo: "BillingDetails",
          redirectParams: { supplierForm: formData, selectedPlan },
        },
      });
      return;
    }

    // Logueado → directo a BillingDetails
    navigation.navigate("BillingDetails", payload);
  };

  const onInvalid = (errs: any) => {
    const firstKey = Object.keys(errs)[0];
    const msg = errs?.[firstKey]?.message || "Revisa los campos del formulario";
    alert(msg);
    console.log("Errores de validación:", errs);
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Ingrese a continuación los datos de tu empresa:
      </Text>

      <ControllerTextInput
        control={control}
        name="rut"
        placeholder="RUT Empresa (con guión y dígito verificador) *"
      />
      <ControllerTextInput
        control={control}
        name="companyname"
        placeholder="Nombre Empresa / Razón Social *"
      />
      <ControllerTextInput
        control={control}
        name="commercialine"
        placeholder="Giro comercial de la empresa *"
      />
      <ControllerTextInput
        control={control}
        name="commercialaddress"
        placeholder="Dirección Comercial (Calle / Avda / Otro) *"
      />
      <ControllerTextInput
        control={control}
        name="streetnumber"
        placeholder="N° calle *"
      />
      <ControllerTextInput
        control={control}
        name="depnumber"
        placeholder="N° Depto. / Edificio *"
      />
      <ControllerTextInput
        control={control}
        name="city"
        placeholder="Ciudad *"
      />
      <ControllerTextInput
        control={control}
        name="region"
        placeholder="Región (Casa matriz) *"
      />
      <ControllerTextInput
        control={control}
        name="commune"
        placeholder="Comuna (Casa matriz) *"
      />
      <ControllerTextInput
        control={control}
        name="phonenumber"
        placeholder="Número de contacto *"
      />
      <ControllerTextInput
        control={control}
        name="email"
        placeholder="Correo electrónico *"
        keyboardType="email-address"
      />
      <ControllerTextInput
        control={control}
        name="yearsold"
        placeholder="Años de antigüedad de la empresa (N°) *"
      />

      {/* Archivo adjunto */}
      <ControllerDocumentPicker control={control} name="document" />

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(onValid, onInvalid)}
      >
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SupplierForm;
