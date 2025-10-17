// screens/ConstructionServicesScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { db } from "../../config/firebase";
import { collection, getDocs, doc } from "firebase/firestore";
import ProductCard from "../../components/cards/ProductCard";

export default function ConstructionServicesScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { areaId, categoryId, title } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    if (!areaId || !categoryId) {
      setError("Faltan parámetros de navegación (areaId o categoryId).");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Ruta: areas/{areaId}/categories/{categoryId}/products
      const catRef = doc(db, "areas", areaId, "categories", categoryId);
      const productsRef = collection(catRef, "products");
      const snap = await getDocs(productsRef);

      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(list);
    } catch (e) {
      console.error(e);
      setError(
        "No se pudieron cargar los servicios. Revisa la ruta y permisos."
      );
    } finally {
      setLoading(false);
    }
  }, [areaId, categoryId]);

  useEffect(() => {
    navigation.setOptions({ title: title || "Servicios" });
  }, [navigation, title]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Cargando servicios…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "crimson", textAlign: "center" }}>{error}</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.center}>
        <Text>No hay servicios en esta categoría aún.</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={{ padding: 12 }}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          item={item}
          onPress={() => {
            navigation.navigate("ServiceDetailScreen", { item });
          }}
          onAddToCart={() => {
            // si llega a tener precio fijo:
            // dispatch(addItemToCart({ id: item.id, title: item.title, price: item.price, img: item.img }));
          }}
          onQuote={() => {
            navigation.navigate("ServiceDetailScreen", {
              item,
              autoOpenQuote: true,
            });
          }}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  img: { width: "100%", height: 160, resizeMode: "cover" },
  imgFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  body: { padding: 12 },
  title: { fontSize: 16, fontWeight: "600", color: "#111" },
  desc: { marginTop: 4, color: "#555" },
});
