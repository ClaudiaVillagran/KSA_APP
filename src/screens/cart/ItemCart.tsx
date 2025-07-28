import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ItemCart({
  id,
  image,
  title,
  price,
  qty,
  onAdd,
  onRemove,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <Image source={image} style={styles.image} />

      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>${price.toLocaleString()}</Text>
        <View style={styles.actionsRow}>
          <View style={styles.quantityContainer}>
            {/* Aumentar cantidad */}
            <Pressable style={styles.iconButton} onPress={onRemove}>
              <FontAwesome5 name="minus" size={10} color="#348ba8" />
            </Pressable>

            <Text style={styles.quantityText}>{qty}</Text>

            {/* Disminuir cantidad */}
            <Pressable style={styles.iconButton} onPress={onAdd}>
              <FontAwesome5 name="plus" size={10} color="#348ba8" />
            </Pressable>
          </View>

          {/* Eliminar producto */}
          <Pressable style={styles.deleteButton} onPress={onDelete}>
            <AntDesign name="delete" size={16} color="#d9534f" />
            <Text style={styles.deleteText}>Eliminar</Text>
          </Pressable>
        </View>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderWidth: 0.7,
    borderColor: "#348ba8",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 10,
  },
  iconButton: {
    borderWidth: 1,
    borderColor: "#348ba8",
    borderRadius: 9,
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    minWidth: 20,
    textAlign: "center",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20, // espacio entre contador y eliminar
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  deleteText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#d9534f",
    fontWeight: "500",
  },
});
