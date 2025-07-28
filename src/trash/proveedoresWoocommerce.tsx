import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import base64 from "base-64";

export default function CartScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = "ck_7f2e9ed2cdb31454d03992002ecc5b5c3306f0ea";
    const password = "cs_5cf78be72cbbfd0a5b2301b6dd9f2a91977d8ce9";
    const url = "https://ksa.cl/wp-json/wc/v3/products";

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Basic " + base64.encode(username + ":" + password),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#348ba8" />
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.images[0]?.src ? (
            <Image style={styles.image} source={{ uri: item.images[0].src }} />
          ) : (
            <Text style={styles.noImage}>Sin imagen</Text>
          )}
          <View style={styles.info}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>${item.price} CLP</Text>
            
      
          </View>

        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    marginBottom: 12,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  noImage: {
    width: 100,
    height: 100,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#888",
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  price: {
    fontSize: 14,
    color: "#555",
    marginTop: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
