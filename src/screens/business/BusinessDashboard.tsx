// screens/business/BusinessDashboard.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Platform, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { startMyServicesListener, resetServicesState } from "../../store/reducers/servicesSlice";

export default function BusinessDashboard() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { items, total, active, inactive, loading } = useSelector((s: RootState) => s.servicesSlice);
  const user = useSelector((s: RootState) => s.userSlice);
  const unsubRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    if (!user?.uid) return;

    // Inicia listener
    unsubRef.current = startMyServicesListener(dispatch, user.uid);

    // Cleanup al salir
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      dispatch(resetServicesState());
    };
  }, [user?.uid]);

  return (
    <View style={styles.screen}>
      {/* Cabecera */}
      <View style={styles.header}>
        <View>
          <Text style={styles.h1}>Panel de Proveedor</Text>
          <Text style={styles.subtitle}>Administra tus servicios y ventas</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>BUSINESS</Text>
        </View>
      </View>

      {/* Stats rápidas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{loading ? "…" : total}</Text>
          <Text style={styles.statLabel}>Servicios</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{loading ? "…" : inactive}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={styles.statCard}>
          {/* Ventas (30d) requiere una colección de órdenes; placeholder por ahora */}
          <Text style={styles.statNumber}>$0</Text>
          <Text style={styles.statLabel}>Ventas (30d)</Text>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => navigation.navigate("CreateService" as never)}
          style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.pressed]}
        >
          <View style={styles.btnRow}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.btnPrimaryText}>Crear nuevo servicio</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("MyServices" as never)}
          style={({ pressed }) => [styles.btn, styles.btnOutline, pressed && styles.pressedLight]}
        >
          <View style={styles.btnRow}>
            <Ionicons name="construct-outline" size={20} color="#0b1220" />
            <Text style={styles.btnOutlineText}>Ver mis servicios</Text>
          </View>
        </Pressable>
      </View>

      {/* Estado de carga / error opcional */}
      {loading && (
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ color: "#6b7785", marginTop: 6 }}>Cargando tus servicios…</Text>
        </View>
      )}

      <View style={styles.cardHelp}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="bulb-outline" size={18} color="#ff8a3d" />
          <Text style={styles.helpTitle}>Guía rápida</Text>
        </View>
        <Text style={styles.helpText}>
          Sube al menos 3 servicios con descripción clara. Activa tu cobertura y tiempos de respuesta para mejorar tu visibilidad.
        </Text>
      </View>

      <View style={styles.footerSpacer} />
    </View>
  );
}

const KSA = {
  bg: "#0f2535",
  accent: "#ff8a3d",
  surface: "#ffffff",
  surfaceAlt: "#F3F4F6",
  text: "#0b1220",
  muted: "#6b7785",
  border: "#e9eef4",
  primary: "#0da2ff",
  success: "#10B981",
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: KSA.surfaceAlt, padding: 16 },
  header: {
    backgroundColor: KSA.surface, borderRadius: 16, padding: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  h1: { fontSize: 22, fontWeight: "800", color: KSA.text },
  subtitle: { marginTop: 4, fontSize: 13, color: KSA.muted },
  badge: { backgroundColor: KSA.success, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 12 },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  statCard: {
    flex: 1, backgroundColor: KSA.surface, borderRadius: 14, paddingVertical: 14,
    alignItems: "center", borderWidth: 1, borderColor: KSA.border,
  },
  statNumber: { fontSize: 20, fontWeight: "800", color: KSA.text },
  statLabel: { marginTop: 2, fontSize: 12, color: KSA.muted },
  actions: { marginTop: 16, gap: 10 },
  btn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16 },
  btnRow: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center" },
  btnPrimary: { backgroundColor: KSA.primary },
  btnPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  btnOutline: { backgroundColor: "#fff", borderWidth: 1.2, borderColor: KSA.border },
  btnOutlineText: { color: KSA.text, fontWeight: "700", fontSize: 15 },
  cardHelp: { backgroundColor: "#fff", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: KSA.border, marginTop: 14 },
  helpTitle: { fontWeight: "800", color: KSA.text },
  helpText: { marginTop: 6, color: KSA.muted, fontSize: 13, lineHeight: 18 },
  pressed: { opacity: Platform.select({ ios: 0.7, android: 0.85 }), transform: [{ scale: 0.995 }] },
  pressedLight: { backgroundColor: "#fafafa", transform: [{ scale: 0.995 }] },
  footerSpacer: { height: 20 },
});
