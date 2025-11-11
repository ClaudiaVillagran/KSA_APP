import React from "react";
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Pricing = {
  currency?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  summary?: string;
  type?: string;    // "fixed" | "from" | "quote"
};

type Props = {
  title: string;
  description?: string;
  price?: number | null;          // precio raíz (algunos docs lo traen aquí)
  pricing?: Pricing | null;       // precios extendidos
  images?: (string | { url: string })[];
  categories?: string[];

  /** Acciones */
  onQuotePress?: () => void;      // WhatsApp
  onOpenDetail?: () => void;      // Ir al detalle
  onAddToCart?: () => void;       // Agregar al carrito

  /** Forzadores opcionales */
  isQuoteOverride?: boolean;
  priceLabelOverride?: string;
};

/** Cover seguro */
function getCover(images?: (string | { url: string })[]) {
  if (!images || !images.length) return null;
  const first: any = images[0];
  return typeof first === "string" ? first : first?.url ?? null;
}

/** CLP seguro */
function fmtCLP(n?: number | null) {
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
}

/** Señal de cotización (tiene opción de cotizar) */
function hasQuoteSignal(price?: number | null, pricing?: Pricing | null, isQuoteOverride?: boolean) {
  if (isQuoteOverride) return true;
  const typeQuote = (pricing?.type || "").toLowerCase() === "quote";
  const summaryCotiz = (pricing?.summary || "").toLowerCase().includes("cotiz");
  return typeQuote || summaryCotiz;
}

/** Tiene precio fijo usable para carrito */
function hasFixedPrice(price?: number | null, pricing?: Pricing | null) {
  const fixedType = (pricing?.type || "").toLowerCase() === "fixed";
  const numericRoot = typeof price === "number";
  return fixedType || numericRoot;
}

/** Construye label de precio */
function buildPriceLabel(
  price?: number | null,
  pricing?: Pricing | null,
  priceLabelOverride?: string
) {
  if (priceLabelOverride) return priceLabelOverride;

  if (hasQuoteSignal(price, pricing)) {
    return pricing?.summary || "A cotizar";
  }

  if (hasFixedPrice(price, pricing)) {
    const f = fmtCLP(typeof price === "number" ? price : null);
    if (f) return f;
  }

  const min = typeof pricing?.minPrice === "number" ? fmtCLP(pricing?.minPrice!) : null;
  const max = typeof pricing?.maxPrice === "number" ? fmtCLP(pricing?.maxPrice!) : null;
  if (min && max) return `${min} - ${max}`;
  if (min) return min;

  return "—";
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
  onAddToCart,
  isQuoteOverride,
  priceLabelOverride,
}: Props) {
  const cover = getCover(images);

  const quote = hasQuoteSignal(price, pricing, isQuoteOverride);  // PRIORIDAD: cotizar
  const canAddToCart = !quote && hasFixedPrice(price, pricing);   // carrito solo si NO hay cotización
  const priceLabel = buildPriceLabel(price, pricing, priceLabelOverride);

  return (
    <Pressable style={styles.card} onPress={onOpenDetail}>
      {/* Cover */}
      {cover ? (
        <Image source={{ uri: cover }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverFallback]}>
          <Ionicons name="image-outline" size={26} color="#9aa7b2" />
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

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{priceLabel}</Text>
          </View>

          {quote ? (
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaWhats]}
              onPress={onQuotePress}
              accessibilityRole="button"
              accessibilityLabel="Cotizar por WhatsApp"
            >
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Cotizar</Text>
            </TouchableOpacity>
          ) : canAddToCart ? (
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaPrimary]}
              onPress={onAddToCart}
              accessibilityRole="button"
              accessibilityLabel="Agregar al carrito"
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.ctaBtnText}>Agregar</Text>
            </TouchableOpacity>
          ) : null}
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
  primary: "#0B7CC4",
  success: "#25D366",
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
  priceText: { fontWeight: "800", color: R.text, fontSize: 13 },

  ctaBtn: {
    marginLeft: "auto",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ctaPrimary: { backgroundColor: R.primary },
  ctaWhats: { backgroundColor: R.success },
  ctaBtnText: { color: "#fff", fontWeight: "800" },
});
