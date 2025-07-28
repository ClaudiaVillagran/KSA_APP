import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  View,
} from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ControllerTextInput from "../../components/inputs/ControllerTextInput";
import { useForm } from "react-hook-form";

const schema = yup
  .object({
    Rut: yup
      .string()
      .required("El rut es obligatorio")
      .matches(/^\d{7,8}-[\dkK]$/, "Formato de RUT inválido (ej: 12345678-5)"),
    CompanyName: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    CommerciaLine: yup
      .string()
      .required("El giro comercial es obligatorio")
      .min(3, "El giro comercial debe tener al menos 3 caracteres"),
    CommercialAddress: yup
      .string()
      .required("La dirección comercial es obligatorio")
      .min(3, "La dirección comercial debe tener al menos 3 caracteres"),
    SreetNumber: yup
      .string()
      .required("El número de calle es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
    DepNumber: yup
      .string()
      .required("Este campo es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
    city: yup
      .string()
      .required("La ciudad es obligatorio")
      .min(3, "La ciudad debe tener al menos 3 caracteres"),
    region: yup
      .string()
      .required("La región es obligatorio")
      .min(3, "La región debe tener al menos 3 caracteres"),
    commune: yup
      .string()
      .required("La comuna es obligatorio")
      .min(3, "La comuna debe tener al menos 3 caracteres"),
    PhoneNumber: yup
      .string()
      .required("El numero de telefono es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números")
      .min(9, "El número debe tener solo 9 digitos")
      .max(9, "El número debe tener solo 9 digitos"),
    Email: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("Correo inválido"),
    YearsOld: yup
      .string()
      .required("Este campo es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números"),
  })
  .required();
const SupplierForm = ({}) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const saveOrder = (formData) => {
    // console.log(formData);
  };
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>
        Ingrese a continuación los datos de tu empresa:
      </Text>

      <ControllerTextInput
        control={control}
        name="Rut"
        placeholder="RUT Empresa (Con guión y dígito verificador)*"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="CompanyName"
        placeholder="Nombre Empresa / Razón Social *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="CommerciaLine"
        placeholder="Giro comercial de la empresa *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="CommercialAddress"
        placeholder="Dirección Comercial Calle / Avda / Otro*"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="SreetNumber"
        placeholder="N° calle *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="DepNumber"
        placeholder="N° Depto. / Edificio *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="City"
        placeholder="Ciudad *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="Region"
        placeholder="Región (Casa matriz) *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="commune"
        placeholder="Comuna (Casa matriz) *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="PhoneNumber"
        placeholder="Número de contacto *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="Email"
        placeholder="Correo electrónico *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <ControllerTextInput
        control={control}
        name="YearsOld"
        placeholder="Años de antigüedad de la empresa (N°) *"
        rules={{
          required: "Este campo es obligatorio", // Añadir reglas de validación
        }}
      />
      <Button
        title="Adjuntar documento"
        onPress={() => alert("Selecciona un archivo")}
      />
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(saveOrder)}
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
  },
  input: {
    width: "100%",
    height: 50,
    paddingLeft: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
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
