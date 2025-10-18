// src/components/NavBar.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ShopIcon from "../components/icons/ShopIcon";
import DownIcon from "../components/icons/DownIcon";
import LogoKsa from "../assets/svg/LogoKsa";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Ionicons } from "@expo/vector-icons";
import { selectFilteredSearchables } from "../store/selectors/searchSelectors";

type SearchableService = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  priceSummary?: string;
  image?: string;
  __raw: any; // <- objeto original del servicio (desde Firestore)
};

export default function NavBar() {
  const navigation = useNavigation();
  const { items } = useSelector((state: RootState) => state.cartSlice);
  const user = useSelector((state: RootState) => state.userSlice);

  const [text, setText] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(text), 250);
    return () => clearTimeout(id);
  }, [text]);

  const results = useSelector((state: RootState) =>
    selectFilteredSearchables(state, debounced)
  );

  useEffect(() => {
    setOpen(results.length > 0 && debounced.length >= 2);
  }, [results, debounced]);

  // ✅ enviar el ITEM COMPLETO a ServiceDetailScreen
  const handleSelect = (item: SearchableService) => {
    setOpen(false);
    setText("");
    navigation.navigate(
      "ServiceDetailScreen" as never,
      { item: item.__raw } as never
    );
  };

  const goToFullResults = () => {
    const q = text.trim();
    if (!q) return;
    setOpen(false);
    navigation.navigate("SearchResults" as never, { q } as never);
  };

  return (
    <View style={styles.containerNavbar}>
      {/* fila superior */}
      <View style={styles.row}>
        <View style={styles.logoAndLogin}>
          <LogoKsa style={{ width: 50, height: 50, marginRight: 10 }} />
          {user && (user as any).uid ? (
            <>
              <Pressable
                onPress={() => navigation.navigate("ProfileScreen" as never)}
                style={({ pressed }) => [
                  {
                    ...(Platform.OS === "web" && { cursor: "pointer" }),
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <View style={styles.profileContainer}>
                  <Ionicons
                    name="person-circle"
                    size={28}
                    color="#2563EB"
                    style={styles.profileIcon}
                  />
                  <Text style={styles.loginText}>Mi perfil</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => navigation.navigate("ProfileScreen" as never)}
              >
                <DownIcon />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "AuthStack" as never,
                    { screen: "SignInScreen" } as never
                  )
                }
                style={({ pressed }) => [
                  {
                    ...(Platform.OS === "web" && { cursor: "pointer" }),
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Text style={styles.loginText}>¡HOLA!</Text>
                <Text style={styles.loginText}>Inicia sesión</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "AuthStack" as never,
                    { screen: "SignInScreen" } as never
                  )
                }
              >
                <DownIcon />
              </Pressable>
            </>
          )}
        </View>

        {/* Carrito */}
        <Pressable
          onPress={() =>
            navigation.navigate(
              "ServicesStack" as never,
              { screen: "CartScreen" } as never
            )
          }
        >
          <View style={styles.cartIconContainer}>
            <ShopIcon />
            {items.length > 0 && (
              <View style={styles.cartQuantityCircle}>
                <Text style={styles.cartQuantityText}>{items.length}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {/* Buscador */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.inputSearch}
            placeholder="Buscar servicios..."
            value={text}
            onChangeText={setText}
            placeholderTextColor="#6b7280"
            onFocus={() => setOpen(results.length > 0 && debounced.length >= 2)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
            onSubmitEditing={goToFullResults}
          />
          <Pressable
            onPress={goToFullResults}
            style={({ pressed }) => [
              { paddingHorizontal: 10, opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons name="search" size={22} color="#374151" />
          </Pressable>
        </View>

        {/* Dropdown de resultados (preview) */}
        {open && (
          <View style={styles.dropdown}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={(results as SearchableService[]).slice(0, 10)}
              keyExtractor={(it) => it.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  style={({ pressed }) => [
                    styles.itemRow,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.itemMeta} numberOfLines={1}>
                      {item.subtitle || "General"}
                      {item.priceSummary ? ` • ${item.priceSummary}` : ""}
                    </Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Servicio</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text style={styles.empty}>Sin resultados</Text>
              }
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerNavbar: {
    minHeight: 60,
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 50,
    paddingBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  logoAndLogin: { flexDirection: "row", alignItems: "center" },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  profileIcon: { marginRight: 8 },
  loginText: { fontWeight: "600", fontSize: 16, color: "#000000ff" },

  cartIconContainer: { position: "relative" },
  cartQuantityCircle: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cartQuantityText: { fontSize: 12, color: "white", fontWeight: "bold" },

  // 🔎 búsqueda
  searchWrapper: {
    marginHorizontal: 10,
    marginTop: 10,
    position: "relative",
    zIndex: 60,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingRight: 6,
  },
  inputSearch: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
    lineHeight: 20,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 10,
    maxHeight: 280,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  itemRow: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f2f2f2",
  },
  itemTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  itemMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 999,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    color: "#374151",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  empty: { padding: 12, textAlign: "center", color: "#6b7280" },
});
