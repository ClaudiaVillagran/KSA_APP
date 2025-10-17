import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  name: string;
  logo?: string | null;
  rating?: number;
  totalProducts?: number;
  tags?: string[];
  description?: string;
  onOpenProfile?: () => void; // <-- único handler
};

export default function CompanyCard({
  name,
  logo,
  rating = 4.8,
  totalProducts = 0,
  tags = [],
  description = "",
  onOpenProfile,
}: Props) {
  return (
    <Pressable onPress={onOpenProfile} style={styles.card}>
      <View style={styles.header}>
        {logo ? (
          <Image source={{ uri: logo }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoFallback]}>
            <Text style={{ fontWeight: "800" }}>{name?.charAt(0) ?? "K"}</Text>
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.title}>{name}</Text>
          <Text style={styles.meta}>
            ⭐ {rating.toFixed(1)} · {totalProducts} servicios
          </Text>
        </View>
      </View>

      {!!description && (
        <Text numberOfLines={2} style={styles.description}>
          {description}
        </Text>
      )}

      {!!tags.length && (
        <View style={styles.tagsRow}>
          {tags.slice(0, 3).map((t, i) => (
            <View key={i} style={styles.tagChip}>
              <Text style={styles.tagText}>{t}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.footer}>
        <Pressable style={styles.ctaPrimary} onPress={onOpenProfile}>
          <Text style={styles.ctaPrimaryText}>Ver perfil</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 52, height: 52, borderRadius: 10, backgroundColor: "#eee" },
  logoFallback: { alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "800" },
  meta: { fontSize: 12, color: "#666", marginTop: 2 },
  description: { fontSize: 12, color: "#333", marginTop: 8 },
  tagsRow: { flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" },
  tagChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  tagText: { fontSize: 11, color: "#334155" },
  footer: { flexDirection: "row", marginTop: 12 },
  ctaPrimary: {
    flex: 1,
    backgroundColor: "#0074D9",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaPrimaryText: { color: "#fff", fontWeight: "700" },
});
