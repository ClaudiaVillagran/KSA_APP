import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { AreasToResolve } from "../../data/AreasToResolve";
import AreaToRelsoveCard from "../../components/cards/AreaToRelsoveCard";
import { vs } from "react-native-size-matters";
import { collection, doc } from "firebase/firestore";
import { db } from "../../config/firebase";
export default function AreaToResolve() {
  const addProductToCategory = async (categoryId, product) => {
    try {
      const productRef = doc(
        collection(
          db,
          "areas",
          "mantencion-y-reparacion",
          "categories",
          categoryId,
          "products"
        ),
        product.id
      );

      await setDoc(productRef, product);
      console.log("Producto añadido con éxito.");
    } catch (e) {
      console.error("Error al agregar producto: ", e);
    }
  };

  // Llamamos a la función para agregar el producto
  const createProductForCategory = async () => {
    // const categoryId = ; // ID de la categoría a la que pertenece el producto
    // await addProductToCategory(categoryId, product);
  };

  // Llamamos a la función para agregar el producto
  createProductForCategory();
  return (
    <View style={styles.containerArea}>
      <Text style={styles.title}>Áreas que resolvemos</Text>

      <FlatList
        horizontal={true}
        data={AreasToResolve}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AreaToRelsoveCard
            imageUrl={item.imageUrl}
            title={item.title}
            description={item.description}
            navigateTo={item.screen}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
      {/* {AreasToResolve.map((item) => (
        <AreaToRelsoveCard
          key={item.id}
          imageUrl={item.image}
          title={item.title}
          description={item.description}
        />
      ))} */}
    </View>
  );
}

const styles = StyleSheet.create({
  containerArea: {
    minHeight: 200,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },
});
