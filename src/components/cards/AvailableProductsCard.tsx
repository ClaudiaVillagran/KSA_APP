import React from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

/** Helper seguro para CLP */
const fmtCLP = (n?: number | null) => {
  if (typeof n !== "number") return null;
  try {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Number(n).toLocaleString("es-CL")}`;
  }
};

export type AvailableProductsCardProps = {
  imageUrl?: string;
  title: string;
  author?: string;
  price?: number | null;
  priceLabel?: string;           // Texto de precio/rango o "A cotizar"
  isQuote?: boolean;             // Forzar modo cotización
  onAddToCart?: () => void;      // Acción para carrito
  onQuote?: () => void;          // Acción para WhatsApp
};

export default function AvailableProductsCard({
  imageUrl,
  title,
  author,
  price,
  priceLabel,
  isQuote = false,
  onAddToCart,
  onQuote,
}: AvailableProductsCardProps) {
  // Label derivado si no viene priceLabel
  const derivedLabel = priceLabel ?? (fmtCLP(price) || "A cotizar");
  const showQuote = isQuote || price == null;

  return (
    <View style={styles.card}>
      {/* Botón flotante superior derecho */}
      {showQuote ? (
        <TouchableOpacity
          style={[styles.fab, styles.whatsFab]}
          onPress={onQuote}
          accessibilityRole="button"
          accessibilityLabel="Cotizar por WhatsApp"
        >
          <Ionicons name="logo-whatsapp" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.fab, styles.cartFab]}
          onPress={onAddToCart}
          accessibilityRole="button"
          accessibilityLabel="Agregar al carrito"
        >
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Imagen */}
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Image
          style={styles.image}
          source={require("../../assets/img/image-not-found-scaled.png")}
        />
      )}

      {/* Detalles */}
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {!!author && (
          <Text style={styles.author} numberOfLines={1}>
            Proveedor: {author}
          </Text>
        )}

        <Text style={[styles.price, showQuote && styles.priceQuote]}>
          {derivedLabel}
        </Text>
      </View>
    </View>
  );
}

const CARD_RADIUS = 16;

const styles = StyleSheet.create({
  card: {
    width: 180,
    backgroundColor: "#fff",
    borderRadius: CARD_RADIUS,
    marginHorizontal: 12,
    marginVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
    position: "relative",
    borderWidth: 1,
    borderColor: "#eaeef3",
    overflow: "hidden",
  },
  fab: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 999,
    zIndex: 2,
  },
  cartFab: { backgroundColor: "#2a7b9e" },
  whatsFab: { backgroundColor: "#25D366" },

  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },

  details: {
    padding: 10,
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
  },
  title: { fontSize: 16, fontWeight: "600", color: "#16222e" },
  author: { fontSize: 12, color: "#6b7785" },
  price: { fontSize: 14, fontWeight: "700", color: "#0B7CC4" },
  priceQuote: { color: "#0F5132" }, // verde sobrio para “A cotizar”
});
