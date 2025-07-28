import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

export default function EmptyCart() {
  const navigation = useNavigation();
  return (
    <View style={styles.content}>
      <MaterialCommunityIcons name="shopping-outline" size={100} color="#000" />
      <Text style={styles.emptyTitle}>Tu carro está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Navega entre nuestros productos y encuentra lo que necesitas.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("PrincipalTabs")}
      >
        <Text style={styles.buttonText}>Ir a comprar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    color: "#000",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 22,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#348ba8",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
