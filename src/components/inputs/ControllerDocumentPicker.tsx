
import React from "react";
import {
  Pressable,
  Text,
  View,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { Controller } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";

const allowedTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/jpg",
];

export default function ControllerDocumentPicker({
  control,
  name,
  label = "Adjuntar documento",
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={null}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Pressable
            onPress={async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({
                  type: allowedTypes,
                });

                if (result.assets && result.assets[0]) {
                  const file = result.assets[0];
                  if (allowedTypes.includes(file.mimeType)) {
                    onChange(file);
                  } else {
                    Alert.alert(
                      "Tipo de archivo no permitido",
                      "Selecciona un archivo PDF, Word o imagen."
                    );
                  }
                }
              } catch (error) {
                Alert.alert("Error", "Hubo un error al seleccionar el archivo");
              }
            }}
            style={styles.documentButton}
          >
            <Text style={styles.documentButtonText}>{label}</Text>
          </Pressable>

          {value && (
            <View style={styles.documentPreview}>
              <Text style={styles.documentText}>Documento: {value.name}</Text>
              <Text style={styles.documentText}>Tipo: {value.mimeType}</Text>
              {value.mimeType.startsWith("image/") && (
                <Image source={{ uri: value.uri }} style={styles.documentImage} />
              )}
            </View>
          )}

          {error && (
            <Text style={{ color: "red", marginTop: 5 }}>{error.message}</Text>
          )}
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  documentButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  documentButtonText: {
    color: "#007BFF",
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
});
