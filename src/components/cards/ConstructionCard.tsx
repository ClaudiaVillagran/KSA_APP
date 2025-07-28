import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

export default function ConstructionCard({ imageUrl, title }) {
  const cleanedUrl = imageUrl?.trim();
  return (
    <View style={styles.card}>
         <Pressable style={styles.imageWrapper}>
           {cleanedUrl && cleanedUrl.startsWith("http") ? (
             <Image style={styles.image} source={{ uri: cleanedUrl }} />
           ) : (
             <Text style={{ color: "red", textAlign: "center" }}>
               Imagen no disponible
             </Text>
           )}
         </Pressable>
         <View style={styles.cardContent}>
           <Text style={styles.cardTitle}>{title}</Text>
           <Text style={styles.cardSubtitle}>
             Servicio especializado en {title}
           </Text>
           <Pressable>
             <Text style={styles.link}>Ver más</Text>
           </Pressable>
         </View>
       </View>
     );
}

const styles = StyleSheet.create({
     card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    marginHorizontal: 16,
    // Sombra para iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    // Sombra para Android
    elevation: 5,
  },
  imageWrapper: {
    width: "100%",
    height: 180,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  link: {
    color: "#007bff",
    fontWeight: "bold",
  },
});
