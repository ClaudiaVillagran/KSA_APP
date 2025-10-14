import React, { useMemo } from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { clearUser } from "../../store/reducers/userSlice";
import { useNavigation } from "@react-navigation/native";
import { clearCart } from "../../store/reducers/cartSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.userSlice);

  const getInitials = (fullName?: string | null, email?: string | null) => {
    if (fullName && fullName.trim().length > 0) {
      const parts = fullName.trim().split(/\s+/);
      return (parts[0]?.[0] ?? "").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
    }
    if (email) return email[0]?.toUpperCase() ?? "U";
    return "U";
  };

  const initials = useMemo(
    () => getInitials(user?.displayName, user?.email),
    [user?.displayName, user?.email]
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearCart());
      dispatch(clearUser());
      navigation.navigate("PrincipalTabs" as never);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.bgDecor} />
      <View style={styles.card}>
        {user && user.uid ? (
          <>
            <View style={styles.headerRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>
                  {user.displayName || "Usuario"}
                </Text>
                <Text style={styles.subtitle}>{user.email}</Text>
              </View>
            </View>

            {user?.isBusiness && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  BUSINESS{user?.businessPlan ? ` • ${user.businessPlan}` : ""}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.actions}>
              {user?.isBusiness ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    styles.primary,
                    pressed && styles.pressed,
                  ]}
                  onPress={() =>
                    navigation.navigate("BusinessStack" as never, {
                      screen: "BusinessDashboard",
                    } as never)
                  }
                >
                  <Text style={styles.primaryText}>Ir a Panel Proveedor</Text>
                </Pressable>
              ) : (
                <>
                  <Text style={styles.helperText}>
                    ¿Tienes un negocio? Solicita tu cuenta Proveedor.
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.button,
                      styles.success,
                      pressed && styles.pressed,
                    ]}
                    onPress={() =>
                      navigation.navigate("ServicesStack" as never, {
                        screen: "BecomeSupplier",
                      } as never)
                    }
                  >
                    <Text style={styles.successText}>Quiero ser Proveedor</Text>
                  </Pressable>
                </>
              )}

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.outline,
                  pressed && styles.pressed,
                ]}
                onPress={() => navigation.navigate("PrincipalTabs" as never)}
              >
                <Text style={styles.outlineText}>Volver al Inicio</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.danger,
                  pressed && styles.pressedDanger,
                ]}
                onPress={handleLogout}
              >
                <Text style={styles.dangerText}>Cerrar sesión</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>No hay usuario autenticado</Text>
            <Text style={styles.subtitle}>
              Inicia sesión para ver tu perfil y tus beneficios.
            </Text>
            <View style={{ height: 12 }} />
            <Pressable
              style={({ pressed }) => [
                styles.button,
                styles.primary,
                pressed && styles.pressed,
              ]}
              onPress={() =>
                navigation.navigate("AuthStack" as never, { screen: "Login" } as never)
              }
            >
              <Text style={styles.primaryText}>Iniciar sesión</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const KSA_COLORS = {
  bg: "#0f2535",          // Azul KSA profundo para acentos decorativos
  accent: "#ff8a3d",      // Naranja KSA
  surface: "#FFFFFF",     // Card
  surfaceAlt: "#F3F4F6",  // Fondo suave
  text: "#0b1220",
  muted: "#6b7785",
  border: "#e9eef4",
  primary: "#0da2ff",
  success: "#10B981",
  danger: "#ef4444",
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: KSA_COLORS.surfaceAlt,
    padding: 20,
    justifyContent: "center",
  },
  bgDecor: {
    position: "absolute",
    top: -120,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: "#0f25351a", // bg con 10% de opacidad
  },
  card: {
    backgroundColor: KSA_COLORS.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f253512", // leve
    borderWidth: 1,
    borderColor: KSA_COLORS.border,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "800",
    color: KSA_COLORS.bg,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: KSA_COLORS.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: KSA_COLORS.muted,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: KSA_COLORS.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 14,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: KSA_COLORS.border,
    marginVertical: 16,
  },
  actions: {
    gap: 10,
  },
  helperText: {
    textAlign: "center",
    color: KSA_COLORS.muted,
    marginBottom: 6,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: KSA_COLORS.primary,
  },
  primaryText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  success: {
    backgroundColor: KSA_COLORS.success,
  },
  successText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  outline: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: KSA_COLORS.border,
  },
  outlineText: {
    color: KSA_COLORS.text,
    fontWeight: "700",
    fontSize: 15,
  },
  danger: {
    backgroundColor: "#fff",
    borderWidth: 1.2,
    borderColor: "#fecaca",
  },
  dangerText: {
    color: KSA_COLORS.danger,
    fontWeight: "800",
    fontSize: 15,
  },
  pressed: {
    opacity: Platform.select({ ios: 0.7, android: 0.85 }),
    transform: [{ scale: 0.995 }],
  },
  pressedDanger: {
    backgroundColor: "#fff5f5",
    transform: [{ scale: 0.995 }],
  },
});
