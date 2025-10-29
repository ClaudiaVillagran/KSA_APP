import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import ControllerTextInput from "../../../components/inputs/ControllerTextInput"; // Importa el componente
import { Picker } from "@react-native-picker/picker";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


const schema = yup
  .object({
    FirstName: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    LastName: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    Comuna: yup
      .string()
      .required("La comuna es obligatorio")
      .min(3, "La comuna debe tener al menos 3 caracteres"),
    Street: yup
      .string()
      .required("La calle es obligatorio")
      .min(3, "La calle debe tener al menos 3 caracteres"),
    Phone: yup
      .string()
      .required("El numero de telefono es obligatorio")
      .matches(/^[0-9]+$/, "Sólo pueden ser números")
      .min(9, "El número debe tener solo 9 dígitos")
      .max(9, "El número debe tener solo 9 dígitos"),
    Mail: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email( "Correo inválido")
  })
  .required();

export default function CheckOutScreen() {
  const [country, setCountry] = useState("");
  const { items } = useSelector((state: RootState) => state.cartSlice);

  const subtotal = items.reduce((total, item) => total + item.sum, 0);
  const total = subtotal;

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const saveOrder = (formData) => {
    // console.log(formData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos de contacto</Text>

        <ControllerTextInput
          control={control}
          name="FirstName"
          placeholder="Nombre *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />
        <ControllerTextInput
          control={control}
          name="LastName"
          placeholder="Apellidos *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />

        <Text style={styles.label}>País *</Text>
        <Picker
          selectedValue={country}
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
          <Picker.Item label="Seleccione un país" value="" />
          <Picker.Item label="Chile" value="Chile" />
          <Picker.Item label="Argentina" value="Argentina" />
          <Picker.Item label="Perú" value="Perú" />
        </Picker>

        <ControllerTextInput
          control={control}
          name="Comuna"
          placeholder="Comuna *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />
        <ControllerTextInput
          control={control}
          name="Street"
          placeholder="Nombre de la calle y número de casa *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Apartamento, habitación, etc"
        />
        <ControllerTextInput
          control={control}
          name="Phone"
          placeholder="Teléfono *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />
        <ControllerTextInput
          control={control}
          name="Mail"
          placeholder="Correo electrónico *"
          rules={{
            required: "Este campo es obligatorio", // Añadir reglas de validación
          }}
        />

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Información adicional</Text>
          <TextInput style={styles.input} placeholder="Nota adicional" />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu pedido</Text>

        <View style={styles.orderSummary}>
          {items.length === 0 ? (
            <Text>No hay productos en el carrito.</Text>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.productItem}>
                <Text>
                  {item.title} - ${item.sum.toLocaleString()} x {item.qty}
                </Text>
              </View>
            ))
          )}

          {/* Total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${total.toLocaleString()}</Text>
          </View>
        </View>

        <Pressable
          style={styles.checkoutButton}
          onPress={handleSubmit(saveOrder)}
        >
          <Text style={styles.checkoutButtonText}>Realizar el pedido</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Permite que el contenido crezca
    paddingBottom: 20, // Asegura que haya espacio suficiente al final para el botón
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  infoSection: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  orderSummary: {
    marginBottom: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 12,
  },
  productItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#348ba8",
  },
  checkoutButton: {
    backgroundColor: "#348ba8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
