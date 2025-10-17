// --- reemplaza ProductCard por este ---
import React from "react";
import { View, Text, Image, Pressable, StyleSheet, Alert } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const KSA = {
  bg: "#0f2535",
  accent: "#ff8a3d",
  surface: "#ffffff",
  surfaceAlt: "#F3F4F6",
  text: "#0b1220",
  muted: "#6b7785",
  border: "#e9eef4",
  primary: "#0da2ff",
  success: "#10b981",
};

function formatCLP(n?: number) {
  if (typeof n !== "number") return "";
  try {
    return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);
  } catch {
    // Fallback
    return `$${(n || 0).toLocaleString("es-CL")}`;
  }
}

export default function ProductCard({
  item,
  onPress,
  onAddToCart,
  onQuote,
  onFavorite,
}: {
  item: any;
  onPress?: () => void;
  onAddToCart?: () => void;
  onQuote?: () => void;
  onFavorite?: () => void;
}) {
  const price = item?.price;          
  const oldPrice = item?.oldPrice;    
  const hasPrice = typeof price === "number";
  const discount =
    hasPrice && typeof oldPrice === "number" && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const rating = item?.rating || 5;  
  const ratingsCount = item?.ratingsCount || 0;

  return (
    <View style={styles.card}>
      {/* Header visual con imagen y badges */}
      <Pressable onPress={onPress} style={styles.media}>
        {item?.img ? (
          <Image source={{ uri: item.img }} style={styles.img} />
        ) : (
          <View style={[styles.img, styles.imgFallback]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}

        {/* Etiquetas superiores */}
        <View style={styles.badgesRow}>
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>Servicio</Text>
          </View>
          {discount > 0 && (
            <View style={styles.badgeDiscount}>
              <Text style={styles.badgeDiscountText}>-{discount}%</Text>
            </View>
          )}
        </View>

    
      </Pressable>

      {/* Body */}
      <Pressable onPress={onPress} style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.title || "Servicio"}
        </Text>

        {item?.description ? (
          <Text style={styles.desc} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}

        {/* Rating + SKU/categoría opcional */}
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <AntDesign name="star" size={14} color="#f5a524" />
            <Text style={styles.ratingText}>
              {rating.toFixed(1)} {ratingsCount ? `(${ratingsCount})` : ""}
            </Text>
          </View>
          {item?.categoryName ? (
            <View style={styles.chip}>
              <Ionicons name="construct-outline" size={14} color={KSA.text} />
              <Text style={styles.chipText} numberOfLines={1}>
                {item.categoryName}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Precio */}
        <View style={styles.priceRow}>
          {hasPrice ? (
            <>
              <Text style={styles.priceNow}>{formatCLP(price)}</Text>
              {oldPrice ? <Text style={styles.priceOld}>{formatCLP(oldPrice)}</Text> : null}
              <Text style={styles.netLabel}>CLP</Text>
            </>
          ) : (
            <Text style={styles.cotizaLabel}>Cotiza tu proyecto</Text>
          )}
        </View>
      </Pressable>

      {/* CTAs */}
      <View style={styles.ctaRow}>
        {hasPrice ? (
          <>
            <Pressable
              onPress={onAddToCart || (() => Alert.alert("Carrito", "Servicio agregado"))}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Agregar</Text>
            </Pressable>
            <Pressable
              onPress={onQuote || (() => Alert.alert("Cotización", "Te contactaremos pronto"))}
              style={[styles.btn, styles.btnGhost]}
            >
              <Ionicons name="chatbubbles-outline" size={18} color={KSA.primary} />
              <Text style={styles.btnGhostText}>Cotizar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              onPress={onQuote || (() => Alert.alert("Cotización", "Te contactaremos pronto"))}
              style={[styles.btn, styles.btnPrimary]}
            >
              <Ionicons name="document-text-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Cotizar ahora</Text>
            </Pressable>
            <Pressable
              onPress={onPress}
              style={[styles.btn, styles.btnGhost]}
            >
              <Ionicons name="eye-outline" size={18} color={KSA.primary} />
              <Text style={styles.btnGhostText}>Ver detalles</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: KSA.surface,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    borderWidth: 1,
    borderColor: KSA.border,
  },
  media: { position: "relative" },
  img: { width: "100%", height: 170, resizeMode: "cover" },
  imgFallback: { alignItems: "center", justifyContent: "center", backgroundColor: KSA.surfaceAlt },
  badgesRow: { position: "absolute", left: 10, top: 10, flexDirection: "row", gap: 8 },
  badgePrimary: { backgroundColor: KSA.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgePrimaryText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  badgeDiscount: { backgroundColor: "#ef4444", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeDiscountText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  favBtn: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  body: { padding: 14, gap: 6 },
  title: { fontSize: 16, fontWeight: "700", color: KSA.text },
  desc: { fontSize: 13, color: KSA.muted, lineHeight: 18 },

  metaRow: { marginTop: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  ratingText: { fontSize: 12, color: KSA.text, fontWeight: "600" },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#eef6ff", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  chipText: { fontSize: 12, color: KSA.text, maxWidth: 160 },

  priceRow: { marginTop: 8, flexDirection: "row", alignItems: "baseline", gap: 8 },
  priceNow: { fontSize: 18, fontWeight: "800", color: KSA.primary },
  priceOld: { fontSize: 14, color: "#9ca3af", textDecorationLine: "line-through" },
  netLabel: { fontSize: 12, color: KSA.muted },
  cotizaLabel: { fontSize: 16, fontWeight: "700", color: KSA.text },

  ctaRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimary: { backgroundColor: KSA.primary },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 14 },
  btnGhost: { backgroundColor: "#fff", borderWidth: 2, borderColor: KSA.primary },
  btnGhostText: { color: KSA.primary, fontWeight: "800", fontSize: 14 },
});
