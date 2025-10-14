// screens/business/MyServicesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Pressable, Image } from 'react-native';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { fmtCLP } from '../../utils/format';

export default function MyServicesScreen() {
  const { items, loading } = useSelector((s: RootState) => s.servicesSlice);

  console.log(items);
  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#6b7785" }}>Cargando…</Text>
      </View>
    );
  }

  if (!items.length) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#6b7785" }}>Aún no tienes servicios publicados.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
       <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => {
          const summary = 
            item?.pricing?.summary ||
            (item.price != null ? fmtCLP(item.price) : "A cotizar");

          return (
            <View style={styles.card}>
              {item.images?.[0] ? (
                <Image source={{ uri: item.images[0] }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={{ color: "#6b7785", fontSize: 12 }}>Sin imagen</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{summary}</Text>
                <Text style={styles.meta}>
                  {item.isActive ? "Activo" : "Inactivo"} · {item.locationIds?.length || 0} comunas
                </Text>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const KSA = {
  border: "#e9eef4",
  text: "#0b1220",
  muted: "#6b7785",
  surface: "#ffffff",
  surfaceAlt: "#F3F4F6",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: KSA.surfaceAlt },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    flexDirection: "row", gap: 10, backgroundColor: KSA.surface,
    padding: 10, borderRadius: 12, borderWidth: 1, borderColor: KSA.border,
  },
  thumb: { width: 68, height: 68, borderRadius: 10, borderWidth: 1, borderColor: KSA.border },
  thumbPlaceholder: { alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" },
  title: { fontWeight: "800", color: KSA.text },
  sub: { marginTop: 2, color: KSA.text },
  meta: { marginTop: 4, color: KSA.muted, fontSize: 12 },
});