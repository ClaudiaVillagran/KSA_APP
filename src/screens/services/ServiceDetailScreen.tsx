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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
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
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${(n || 0).toLocaleString("es-CL")}`;
  }
}

function tsToDateStr(ts: any) {
  // Soporta {seconds, nanoseconds} de Firestore o Date
  try {
    if (ts?.seconds) {
      const d = new Date(ts.seconds * 1000);
      return d.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    if (ts instanceof Date) {
      return ts.toLocaleDateString("es-CL", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch {}
  return "";
}

export default function ServiceDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { item, autoOpenQuote } = (route.params as any) || {};

// console.log(item);
  const images: string[] = Array.isArray(item?.images) ? item.images : [];
  const hero = images?.[0] || item?.img || null;

  const isQuote = item?.pricing?.type === "quote" || item?.price == null;
  const hasPrice = !isQuote && typeof item?.price === "number";

  useEffect(() => {
    navigation.setOptions?.({ title: item?.title || "Detalle de servicio" });
  }, [navigation, item?.title]);

  useEffect(() => {
    if (autoOpenQuote) {
      setTimeout(() => {
        Alert.alert(
          "Cotización",
          "Completa el formulario para cotizar tu servicio."
        );
      }, 300);
    }
  }, [autoOpenQuote]);

  const locations = useMemo(() => {
    return (item?.locationIds || []).map((id: string) => id.replace(/-/g, " "));
  }, [item?.locationIds]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.media}>
        {hero ? (
          <Image source={{ uri: hero }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, styles.heroFallback]}>
            <Text style={{ color: "#999" }}>Sin imagen</Text>
          </View>
        )}
        <View style={styles.badgesRow}>
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>Servicio</Text>
          </View>
          {isQuote && (
            <View style={styles.badgeQuote}>
              <Text style={styles.badgeQuoteText}>A cotizar</Text>
            </View>
          )}
        </View>
        {/* <Pressable
          onPress={() => Alert.alert("Favoritos", "Guardado en favoritos")}
          style={styles.favBtn}
          hitSlop={10}
        >
          <AntDesign name="hearto" size={18} color="#fff" />
        </Pressable> */}
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{item?.title?.trim() || "Servicio"}</Text>
        {item?.searchableTitle ? (
          <Text style={styles.subtitle}>{item.searchableTitle.trim()}</Text>
        ) : null}
      </View>

      {/* Precio / Cotización */}
      <View style={styles.card}>
        {hasPrice ? (
          <View style={styles.priceRow}>
            <Text style={styles.priceNow}>{formatCLP(item.price)}</Text>
            {item?.pricing?.minPrice || item?.pricing?.maxPrice ? (
              <Text style={styles.priceRange}>
                {item?.pricing?.minPrice
                  ? `Desde ${formatCLP(item.pricing.minPrice)}`
                  : ""}
                {item?.pricing?.maxPrice
                  ? ` a ${formatCLP(item.pricing.maxPrice)}`
                  : ""}
              </Text>
            ) : null}
            <Text style={styles.netLabel}>CLP</Text>
          </View>
        ) : (
          <>
            <Text style={styles.quoteTitle}>Este servicio se cotiza</Text>
            {item?.pricing?.summary ? (
              <Text style={styles.quoteSummary}>{item.pricing.summary}</Text>
            ) : null}
            {item?.pricing?.notes ? (
              <View style={styles.noteBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={KSA.primary}
                />
                <Text style={styles.noteText}>{item.pricing.notes}</Text>
              </View>
            ) : null}
          </>
        )}

        <View style={styles.ctaRow}>
          {hasPrice ? (
            <>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() => Alert.alert("Carrito", "Agregado al carrito")}
              >
                <Ionicons name="cart-outline" size={18} color="#fff" />
                <Text style={styles.btnPrimaryText}>Agregar</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnGhost]}
                onPress={() =>
                  Alert.alert("Cotización", "Te contactaremos pronto")
                }
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={18}
                  color={KSA.primary}
                />
                <Text style={styles.btnGhostText}>Cotizar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={() =>
                  Alert.alert("Cotización", "Abrir formulario de cotización")
                }
              >
                <Ionicons name="document-text-outline" size={18} color="#fff" />
                <Text style={styles.btnPrimaryText}>Cotizar ahora</Text>
              </Pressable>
              {/* <Pressable
                style={[styles.btn, styles.btnGhost]}
                onPress={() => Alert.alert("Contacto", "Abrir chat/WhatsApp")}
              >
                <Ionicons name="logo-whatsapp" size={18} color={KSA.primary} />
                <Text style={styles.btnGhostText}>Contactar</Text>
              </Pressable> */}
            </>
          )}
        </View>
      </View>

      {/* Propietario / Empresa */}
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
            <Text style={styles.providerMeta}>
              ID: {item?.ownerId?.slice(0, 6)}…
            </Text>
          </View>
          <Pressable
            style={styles.smallGhost}
            onPress={() =>
              navigation.navigate(
                "CompanyProfileScreen" as never,
                {
                  ownerId: item?.ownerId,
                  ownerName: item?.ownerName || "Proveedor",
                } as never
              )
            }
          >
            <Text style={styles.smallGhostText}>Ver perfil</Text>
          </Pressable>
        </View>
      </View>

      {/* Cobertura / Comunas */}
      <View style={styles.card}>
        <Text style={styles.blockTitle}>Cobertura</Text>
        <View style={styles.chipsWrap}>
          {locations.length ? (
            locations.map((loc: string, i: number) => (
              <View key={i} style={styles.chip}>
                <Ionicons name="location-outline" size={14} color={KSA.text} />
                <Text style={styles.chipText}>{loc}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Sin comunas registradas</Text>
          )}
        </View>
      </View>

      {item?.description ? (
        <View style={styles.card}>
          <Text style={styles.blockTitle}>Descripción</Text>
          <Text style={styles.desc}>{item.description}</Text>
        </View>
      ) : null}

      {/* Galería secundaria */}
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

  favBtn: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

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
  priceRange: { fontSize: 14, color: KSA.muted },
  netLabel: { fontSize: 12, color: KSA.muted },
  quoteTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: KSA.text,
    marginBottom: 6,
  },
  quoteSummary: { fontSize: 14, color: KSA.text, marginBottom: 6 },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eef6ff",
    padding: 10,
    borderRadius: 10,
  },

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
  btnPrimaryText: { color: "#fff", fontWeight: "900", fontSize: 14 },
  btnGhost: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: KSA.primary,
  },
  btnGhostText: { color: KSA.primary, fontWeight: "900", fontSize: 14 },

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
  smallGhost: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KSA.border,
  },
  smallGhostText: { color: KSA.primary, fontWeight: "800", fontSize: 12 },

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

  desc: { fontSize: 14, color: KSA.text, lineHeight: 20 },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  kvKey: { fontSize: 13, color: KSA.muted },
  kvVal: { fontSize: 13, color: KSA.text, fontWeight: "600" },

  galleryImg: { width: 140, height: 90, borderRadius: 10 },
});
