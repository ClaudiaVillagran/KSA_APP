import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useRoute } from "@react-navigation/native"; // Importa useRoute para acceder a los parámetros
import { useDispatch, useSelector } from "react-redux"; // Usamos Redux para acceder a las áreas y categorías
import { RootState } from "../../store/store";
import { addItemToCart } from "../../store/reducers/cartSlice";

export default function ServiceFromServicesScreen() {
  const route = useRoute();
  const { categoryId } = route.params; // Accede al categoryId que pasamos desde la pantalla anterior

  const { areas } = useSelector((state: RootState) => state.areaSlice);

  const [services, setServices] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const dispatch = useDispatch();
  const constructionArea = areas.find(
    (area) => area.screen === "ServiceScreen"
  );

  useEffect(() => {
    if (constructionArea) {
      const category = constructionArea.categories.find(
        (category) => category.id === categoryId
      );
      if (category) {
        setServices(category.products); // Establece los productos de la categoría
        setCategoryName(category.title); // Establece el nombre de la categoría
      }
    }
  }, [categoryId, areas]);
  const handleAddToCart = (service) => {
    dispatch(addItemToCart(service)); // Agregar el servicio al carrito
     Alert.alert("Producto agregado", `${service.title} ha sido agregado, mira tu al carrito.`, [
      { text: "OK" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios de {categoryName} disponibles</Text>

      {services.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
          No hay servicios disponibles para esta categoría.
        </Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <View style={styles.cardContent}>
                <Text style={styles.serviceTitle}>{item.title}</Text>
                <Text style={styles.serviceDescription}>
                  {item.description || "Descripción no disponible"}
                </Text>
                <Text style={styles.servicePrice}>Precio: ${item.price}</Text>
                <Text style={styles.serviceLocation}>
                  Ubicación: {item.location.join(", ")}
                </Text>
                <Pressable onPress={() => handleAddToCart(item)} style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Agregar al carrito</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 16,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
  },
  serviceLocation: {
    fontSize: 14,
    color: "#888",
  },
  addToCartButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});