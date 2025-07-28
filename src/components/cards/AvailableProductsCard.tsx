import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons"; // Importamos Ionicons desde Expo Vector Icons

export default function AvailableProductsCard({
  onAddToCartPress,
  imageUrl,
  title,
  price,
  author,
}) {
  return (
    <View style={styles.card}>
      {/* Botón de compra en la parte superior derecha */}
      <TouchableOpacity style={styles.buyButton} onPress={onAddToCartPress}>
        <Ionicons name="cart-outline" size={30} color="#fff" />
      </TouchableOpacity>
      {imageUrl ? (
        <Image source={imageUrl} style={styles.image} />
      ) : (
        <Image style={styles.image} source = {require("../../assets/img/image-not-found-scaled.png")}/>
      )}

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.author}>Proveedor: {author}</Text>
        <Text style={styles.price}>${price.toLocaleString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#f9f9f9", // color más suave para productos
    borderRadius: 16,
    marginHorizontal: 12,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    position: "relative", // Necesario para posicionar el botón encima
  },
  buyButton: {
    position: "absolute",
    top: 10,
    right: 10, // Colocamos el botón en la parte derecha
    backgroundColor: "#2a7b9e",
    padding: 12, // Aumento del tamaño del botón
    borderRadius: 50,
    zIndex: 1, // Aseguramos que el botón esté por encima de la imagen
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
    borderRadius: 16,
  },
  details: {
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  author: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2a7b9e",
  },
});
