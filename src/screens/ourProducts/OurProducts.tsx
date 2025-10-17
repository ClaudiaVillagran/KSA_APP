import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";

import AvailableProductsCard from "../../components/cards/AvailableProductsCard";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../../store/reducers/cartSlice";
import { RootState } from "../../store/store";
export default function OurProducts() {
 const { areas } = useSelector((state: RootState) => state.areaSlice);
 const dispatch = useDispatch();

  // Obtenemos todos los productos de todas las categorías dentro de las áreas
  const allProducts = areas.reduce((acc, area) => {
    area.categories.forEach((category) => {
      category.products.forEach((product) => {
        // Comprobamos si el producto ya existe en el array `acc` basándonos en el id
        if (!acc.some((existingProduct) => existingProduct.id === product.id)) {
          acc.push(product); // Solo agregamos el producto si no está repetido
        }
      });
    });
    return acc; // Devolvemos el array de productos sin duplicados
  }, []);

  // console.log(allProducts);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Nuestros servicios
      </Text>
      <FlatList
        horizontal={true}
        data={allProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AvailableProductsCard
          imageUrl={item.image}
            title={item.title}
            price={item.price}
            author={item.author}
            onAddToCartPress={() => dispatch(addItemToCart(item))}
          />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: "#f9f9f9",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 16,
    marginBottom: 12,
    color: "#222",
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});
