import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  Image,
} from "react-native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import ControllerTextInput from "../../components/inputs/ControllerTextInput";
import { useForm } from "react-hook-form";

import * as DocumentPicker from "expo-document-picker"; // Importar el paquete
import { Controller } from "react-hook-form";
import ControllerDocumentPicker from "../../components/inputs/ControllerDocumentPicker";

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
    Document: yup
      .mixed()
      .required("Debes adjuntar un documento")
      .test("fileAttached", "El documento es obligatorio", (value) => {
        return value && value.name; // name existe si hay archivo
      }),
  })
  .required();
const SupplierForm = ({}) => {
  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const saveOrder = (formData) => {
    // console.log(formData);
  };
  const [document, setDocument] = useState(null);

  const handleDocumentPick = async () => {
    try {
      // Abre el selector de documentos
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Acepta todos los tipos de archivos
      });
      console.log(result.assets[0]);
      if (result.assets) {
        const file = result.assets ? result.assets[0] : null; // Asumimos que es el primer archivo
        const allowedTypes = [
          "application/pdf", // PDF
          "application/msword", // Word .doc
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word .docx
          "image/jpeg", // JPEG/JPG
          "image/png", // PNG
          "image/jpg", // JPG
        ];
        if (allowedTypes.includes(file.mimeType)) {
          setDocument(file); // Guarda el archivo en el estado
        } else {
          alert(
            "Tipo de archivo no permitido. Por favor, selecciona un archivo PDF, Word o una imagen (JPG, JPEG, PNG)."
          );
        }
      } else {
        alert("No se seleccionó ningún archivo");
      }
    } catch (error) {
      alert("Hubo un error al seleccionar el archivo");
    }
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
      {/* Botón para seleccionar documento */}
      {/* Botón para seleccionar documento */}
      {/* Botón para seleccionar documento */}
      <ControllerDocumentPicker control={control} name="Document" />
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
    color: "#333",
  },
  button: {
    backgroundColor: "#007BFF", // Un color más moderno para botones
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  documentButton: {
    backgroundColor: "#f5f5f5", // Color de fondo gris suave
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd", // Borde suave para el botón
    alignItems: "center",
  },
  documentButtonText: {
    color: "#007BFF", // Color del texto (azul similar al de otros botones)
    fontWeight: "600",
    fontSize: 16,
  },
  documentPreview: {
    marginTop: 20,
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cce7ff",
    alignItems: "center",
  },
  documentText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  documentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "contain",
  },
  submitButton: {
    backgroundColor: "#4CAF50", // Verde para el botón de envío
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
