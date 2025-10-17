import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";

type Pricing = {
  currency?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  summary?: string; 
  type?: string;    
};

type Props = {
  title: string;
  description?: string;
  price?: number | null;
  pricing?: Pricing | null;
  images?: (string | { url: string })[];
  categories?: string[];
  onQuotePress?: () => void;
  onOpenDetail?: () => void;
};

function getCover(images?: (string | { url: string })[]) {
  if (!images || !images.length) return null;
  const first = images[0] as any;
  return typeof first === "string" ? first : first?.url ?? null;
}

function formatCLP(n: number) {
  try {
    return n.toLocaleString("es-CL");
  } catch {
    return String(n);
  }
}

export default function ServiceCard({
  title,
  description,
  price,
  pricing,
  images,
  categories = [],
  onQuotePress,
  onOpenDetail,
}: Props) {
  // console.log(images);
  const cover = getCover(images);
  // console.log('cover', cover);
  const isQuote = !price && (!pricing?.minPrice || pricing?.minPrice === null);
  const priceLabel = price
    ? `Desde $${formatCLP(price)}`
    : pricing?.summary || "Requiere cotización";

  return (
    <Pressable style={styles.card} onPress={onOpenDetail}>
      {/* Cover */}
      {cover ? (
        <Image source={{ uri: cover }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Text style={styles.coverFallbackEmoji}>🖼️</Text>
          <Text style={styles.coverFallbackText}>Sin imagen</Text>
        </View>
      )}

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>

        {!!description && (
          <Text style={styles.desc} numberOfLines={3}>
            {description}
          </Text>
        )}

        {/* Chips: categorías */}
        {!!categories.length && (
          <View style={styles.chips}>
            {categories.slice(0, 3).map((c, i) => (
              <View key={i} style={styles.chip}>
                <Text style={styles.chipText}>{c}</Text>
              </View>
            ))}
            {categories.length > 3 && (
              <View style={[styles.chip, { opacity: 0.8 }]}>
                <Text style={styles.chipText}>+{categories.length - 3}</Text>
              </View>
            )}
          </View>
        )}

        {/* Footer: precio y botón */}
        <View style={styles.footer}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{priceLabel}</Text>
          </View>

          <Pressable style={[styles.cta, isQuote && styles.ctaPrimary]} onPress={onQuotePress}>
            <Text style={[styles.ctaText, isQuote && styles.ctaTextPrimary]}>
              Cotizar
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const R = {
  bg: "#ffffff",
  border: "#e5e7eb",
  text: "#0b1220",
  muted: "#6b7280",
  pill: "#f1f5f9",
  primary: "#0074D9",
  shadow: "#000000",
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: R.bg,
    borderWidth: 1,
    borderColor: R.border,
    overflow: "hidden",
    shadowColor: R.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  cover: { width: "100%", height: 150, backgroundColor: "#eee" },
  coverFallback: { alignItems: "center", justifyContent: "center" },
  coverFallbackEmoji: { fontSize: 26, opacity: 0.8 },
  coverFallbackText: { marginTop: 4, color: R.muted, fontSize: 12 },
  body: { padding: 12 },
  title: { fontSize: 16, fontWeight: "800", color: R.text },
  desc: { marginTop: 6, color: R.muted, fontSize: 13 },
  chips: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 8 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: R.pill,
    borderWidth: 1,
    borderColor: R.border,
  },
  chipText: { fontSize: 12, color: "#334155" },
  footer: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
  pricePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: R.pill,
    borderWidth: 1,
    borderColor: R.border,
    flexShrink: 1,
  },
  priceText: { fontWeight: "700", color: R.text, fontSize: 13 },
  cta: {
    marginLeft: "auto",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: R.primary,
  },
  ctaPrimary: {
    backgroundColor: R.primary,
  },
  ctaText: { fontWeight: "700", color: R.primary },
  ctaTextPrimary: { color: "#fff" },
});
 