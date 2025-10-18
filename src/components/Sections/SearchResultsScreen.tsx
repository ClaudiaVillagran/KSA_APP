// src/components/Sections/SearchResultsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { selectFilteredSearchables } from "../../store/selectors/searchSelectors";
import { Ionicons } from "@expo/vector-icons";

type RouteParams = { q?: string };

type SearchableItem = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  priceSummary?: string;
  image?: string;
  __raw: any;
};

// Helpers locales (formatear slugs como “construcción_en_general” -> “Construcción en general”)
const prettifySlug = (s?: string) => {
  if (!s) return "";
  const clean = s.replace(/[_-]/g, " ").trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};
const joinPretty = (arr?: string[]) =>
  (arr || []).map(prettifySlug).filter(Boolean).join(", ");

export default function SearchResultsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const initialQ = (route?.params as RouteParams)?.q ?? "";
  const [q, setQ] = useState(initialQ);

  useEffect(() => {
    const newQ = (route?.params as RouteParams)?.q ?? "";
    setQ(newQ);
  }, [route?.params?.q]);

  const results = useSelector((state: RootState) =>
    selectFilteredSearchables(state, q)
  ) as SearchableItem[];

  const goDetail = (service: SearchableItem) => {
    console.log(service);
    navigation.navigate(
      "ServiceDetailScreen" as never,
      { item: service.__raw } as never // 👈 enviamos el objeto completo
    );
  };

  const renderCard = ({ item }: { item: SearchableItem }) => {
    const raw = item.__raw || {};
    const areaText = joinPretty(raw.areaIds);
    const categoryText = joinPretty(raw.categoryIds);
    const locationText = joinPretty(raw.locationIds);
    const owner = raw.ownerName || raw.author?.name || "Proveedor";
    const priceSummary = item.priceSummary || raw.pricing?.summary || undefined;

    return (
      <View style={styles.card}>
        {/* Imagen / placeholder */}
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cover, styles.coverPlaceholder]}>
            <Ionicons name="image" size={28} color="#9CA3AF" />
            <Text style={styles.coverPlaceholderText}>
              Imagen no disponible
            </Text>
          </View>
        )}

        {/* Contenido */}
        <View style={styles.cardBody}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          {/* Badges de categoría / área / precio */}
          <View style={styles.badgesRow}>
            {!!categoryText && <Badge text={categoryText} />}
            {!!areaText && <Badge text={areaText} />}
            {!!priceSummary && <Badge text={priceSummary} strong />}
          </View>

          {/* Ubicaciones */}
          {!!locationText && (
            <Text style={styles.meta} numberOfLines={1}>
              {locationText}
            </Text>
          )}

          {/* Proveedor */}
          <Text style={styles.owner} numberOfLines={1}>
            {owner}
          </Text>

          {/* Descripción (2 líneas) */}
          {!!item.description && (
            <Text style={styles.desc} numberOfLines={2}>
              {item.description}
            </Text>
          )}

          {/* Botón Ver detalle */}
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => goDetail(item)}
              style={({ pressed }) => [
                styles.button,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color="#fff"
              />
              <Text style={styles.buttonText}>Ver detalle</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search bar arriba para refinar búsqueda */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Buscar servicios..."
          value={q}
          onChangeText={setQ}
          returnKeyType="search"
          onSubmitEditing={() => {}}
          placeholderTextColor="#6b7280"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Ionicons name="search" size={20} color="#374151" />
      </View>

      <Text style={styles.counter}>
        {q
          ? `Resultados para “${q}” (${results.length})`
          : "Escribe para buscar servicios"}
      </Text>

      <FlatList
        data={results}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={renderCard}
        ListEmptyComponent={
          q ? (
            <Text style={styles.empty}>No se encontraron servicios</Text>
          ) : null
        }
      />
    </View>
  );
}

// Badge simple reutilizable
function Badge({ text, strong = false }: { text: string; strong?: boolean }) {
  return (
    <View style={[styles.badge, strong && styles.badgeStrong]}>
      <Text
        style={[styles.badgeText, strong && styles.badgeTextStrong]}
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    marginRight: 8,
  },
  counter: { marginTop: 10, marginBottom: 6, color: "#374151" },

  // Card
  card: {
    borderRadius: 12,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    overflow: "hidden",
  },
  cover: { width: "100%", height: 160, backgroundColor: "#F3F4F6" },
  coverPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  coverPlaceholderText: { color: "#9CA3AF", fontSize: 12 },

  cardBody: { padding: 12 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },

  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
  },
  badgeStrong: { backgroundColor: "#2563EB" },
  badgeText: { fontSize: 12, color: "#374151" },
  badgeTextStrong: { color: "#fff", fontWeight: "700" },

  meta: { fontSize: 12, color: "#6b7280", marginTop: 6 },
  owner: { fontSize: 12, color: "#374151", marginTop: 2, fontWeight: "600" },

  desc: { fontSize: 13, color: "#374151", marginTop: 8 },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#0ea5e9", // azul agradable
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "700" },

  empty: { textAlign: "center", color: "#6b7280", marginTop: 40 },
});
