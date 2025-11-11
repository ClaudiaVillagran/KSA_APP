import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Pressable,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../store/reducers/cartSlice";

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

function formatCLP(n?: number | null) {
  if (typeof n !== "number") return "";
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

/** Detecta si es servicio de cotización */
function hasQuoteSignal(item: any) {
  const typeRoot = (item?.type || "").toLowerCase() === "quote";
  const typePricing = (item?.pricing?.type || "").toLowerCase() === "quote";
  const summaryCotiz = (item?.pricing?.summary || "")
    .toLowerCase()
    .includes("cotiz");
  return typeRoot || typePricing || summaryCotiz;
}

/** Detecta si tiene precio fijo utilizable para carrito */
function hasFixedPrice(item: any) {
  const typeRootFixed = (item?.type || "").toLowerCase() === "fixed";
  const typePricingFixed = (item?.pricing?.type || "").toLowerCase() === "fixed";
  const numericRoot = typeof item?.price === "number";
  const numericPricing = typeof item?.pricing?.price === "number";
  const numericMin = typeof item?.pricing?.minPrice === "number";
  return typeRootFixed || typePricingFixed || numericRoot || numericPricing || numericMin;
}

/** Precio unitario para el carrito */
function getUnitPrice(item: any): number | null {
  if (typeof item?.price === "number") return item.price;
  if (typeof item?.pricing?.price === "number") return item.pricing.price;
  if (typeof item?.pricing?.minPrice === "number") return item.pricing.minPrice;
  return null;
}

/** Label de precio principal (visual) */
function getPrimaryPriceLabel(item: any) {
  if (hasQuoteSignal(item)) {
    return item?.pricing?.summary || "A cotizar";
  }

  // precio fijo directo
  const unit = getUnitPrice(item);
  if (typeof unit === "number") return formatCLP(unit);

  // rango
  const min =
    typeof item?.pricing?.minPrice === "number"
      ? formatCLP(item.pricing.minPrice)
      : null;
  const max =
    typeof item?.pricing?.maxPrice === "number"
      ? formatCLP(item.pricing.maxPrice)
      : null;

  if (min && max) return `${min} - ${max}`;
  if (min) return min;

  return "—";
}

export default function ServiceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { item } = (route.params as any) || {};

  const images: string[] = Array.isArray(item?.images) ? item.images : [];
  const hero = images?.[0] || item?.img || null;

  const isQuote = hasQuoteSignal(item);
  const canAddToCart = !isQuote && hasFixedPrice(item);
  const priceLabel = getPrimaryPriceLabel(item);

  useEffect(() => {
    navigation.setOptions?.({
      title: item?.title || "Detalle de servicio",
    });
  }, [navigation, item?.title]);

  const locations = useMemo(() => {
    return (item?.locationIds || []).map((id: string) =>
      String(id).replace(/-/g, " ")
    );
  }, [item?.locationIds]);

  /** WhatsApp para servicios a cotizar */
  const handleWhatsApp = () => {
    const phone = "56944748591"; // tu número KSA
    const t = item?.title || "Servicio";
    const code = item?.id ? ` (ID: ${item.id})` : "";
    const loc =
      Array.isArray(item?.locationIds) && item.locationIds.length
        ? `, ubicación: ${item.locationIds.join(", ")}`
        : "";
    const txt = `Hola 👋, quiero cotizar "${t}"${code}${loc}. Vengo desde KSAPP.`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
      txt
    )}&type=phone_number&app_absent=0`;
    Linking.openURL(url);
  };

  /** Agregar al carrito SOLO si tiene precio fijo */
  const handleAddToCart = () => {
    if (!canAddToCart) {
      Alert.alert(
        "Este servicio se cotiza",
        "Para este servicio debes coordinar por WhatsApp."
      );
      return;
    }

    const unitPrice = getUnitPrice(item);
    if (typeof unitPrice !== "number") {
      Alert.alert(
        "Precio no disponible",
        "Este servicio no tiene un precio fijo válido para el carrito."
      );
      return;
    }

    dispatch(
      addItemToCart({
        id: item.id,
        title: item.title,
        price: unitPrice,
        qty: 1,
        image: hero || null,
      })
    );

    Alert.alert(
      "Agregado al carrito",
      `"${item.title}" fue agregado correctamente.`
    );
  };

  if (!item) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No se encontró el servicio.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* MEDIA */}
      <View style={styles.media}>
        {hero ? (
          <Image source={{ uri: hero }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, styles.heroFallback]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}

        <View className="badgesRow" style={styles.badgesRow}>
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>Servicio</Text>
          </View>
          {isQuote && (
            <View style={styles.badgeQuote}>
              <Text style={styles.badgeQuoteText}>A cotizar</Text>
            </View>
          )}
        </View>
      </View>

      {/* TÍTULO */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {item?.title?.trim() || "Servicio"}
        </Text>
        {item?.searchableTitle ? (
          <Text style={styles.subtitle}>
            {item.searchableTitle.trim()}
          </Text>
        ) : null}
      </View>

      {/* PRECIO / COTIZACIÓN */}
      <View style={styles.card}>
        {!isQuote && canAddToCart ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceNow}>{priceLabel}</Text>
            <Text style={styles.netLabel}>CLP</Text>
          </View>
        ) : (
          <>
            <Text style={styles.quoteTitle}>Este servicio se cotiza</Text>
            {item?.pricing?.summary ? (
              <Text style={styles.quoteSummary}>
                {item.pricing.summary}
              </Text>
            ) : (
              <Text style={styles.quoteSummary}>
                Contáctanos por WhatsApp para recibir una cotización personalizada.
              </Text>
            )}
          </>
        )}

        {/* CTAs */}
        <View style={styles.ctaRow}>
          {canAddToCart && (
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Agregar al carrito</Text>
            </Pressable>
          )}

          {isQuote && (
            <Pressable
              style={[styles.btn, styles.btnWhats]}
              onPress={handleWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={18} color="#fff" />
              <Text style={styles.btnPrimaryText}>Cotizar por WhatsApp</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* PROVEEDOR */}
      <View style={styles.card}>
        <Text style={styles.blockTitle}>Proveedor</Text>
        <View style={styles.providerRow}>
          <View style={styles.avatar}>
            <Ionicons name="business-outline" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.providerName}>
              {item?.ownerName || "Proveedor"}
            </Text>
            {item?.ownerId && (
              <Text style={styles.providerMeta}>
                ID: {String(item.ownerId).slice(0, 6)}…
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* COBERTURA */}
      <View style={styles.card}>
        <Text style={styles.blockTitle}>Cobertura</Text>
        <View style={styles.chipsWrap}>
          {locations.length ? (
            locations.map((loc: string, i: number) => (
              <View key={i} style={styles.chip}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={KSA.text}
                />
                <Text style={styles.chipText}>{loc}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Sin comunas registradas</Text>
          )}
        </View>
      </View>

      {/* DESCRIPCIÓN */}
      {item?.description ? (
        <View style={styles.card}>
          <Text style={styles.blockTitle}>Descripción</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      ) : null}

      {/* GALERÍA */}
      {images.length > 1 && (
        <View style={styles.card}>
          <Text style={styles.blockTitle}>Galería</Text>
          <FlatList
            horizontal
            data={images.slice(1)}
            keyExtractor={(uri) => uri}
            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
            renderItem={({ item: uri }) => (
              <Image source={{ uri }} style={styles.galleryImg} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 14, backgroundColor: "#fff" },
  media: { position: "relative", marginBottom: 14 },
  hero: { width: "100%", height: 220, borderRadius: 16 },
  heroFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: KSA.surfaceAlt,
    borderRadius: 16,
  },

  badgesRow: {
    position: "absolute",
    left: 12,
    top: 12,
    flexDirection: "row",
    gap: 8,
  },
  badgePrimary: {
    backgroundColor: KSA.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgePrimaryText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  badgeQuote: {
    backgroundColor: "#0ea5e9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeQuoteText: { color: "#fff", fontWeight: "800", fontSize: 12 },

  header: { marginBottom: 8 },
  title: { fontSize: 20, fontWeight: "800", color: KSA.text },
  subtitle: { marginTop: 4, fontSize: 13, color: KSA.muted },

  card: {
    backgroundColor: KSA.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: KSA.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  priceNow: { fontSize: 22, fontWeight: "900", color: KSA.primary },
  netLabel: { fontSize: 12, color: KSA.muted },

  quoteTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: KSA.text,
    marginBottom: 6,
  },
  quoteSummary: { fontSize: 14, color: KSA.text, marginBottom: 6 },

  ctaRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnPrimary: { backgroundColor: KSA.primary },
  btnWhats: { backgroundColor: "#25D366" },
  btnPrimaryText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  blockTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: KSA.text,
    marginBottom: 10,
  },
  providerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: KSA.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  providerName: { fontWeight: "800", color: KSA.text },
  providerMeta: { color: KSA.muted, fontSize: 12 },

  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#eef6ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipText: { fontSize: 12, color: KSA.text },
  muted: { color: KSA.muted, fontSize: 13 },

  desc: { fontSize: 14, color: KSA.text, lineHeight: 20 },

  galleryImg: { width: 140, height: 90, borderRadius: 10 },
});
