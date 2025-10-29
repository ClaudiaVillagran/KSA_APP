import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useState } from "react";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

type Props = {
  id: string;
  image?: string;           // puede venir vacío o undefined
  title: string;
  price: number;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onDelete: () => void;
};

export default function ItemCart({
  id,
  image,
  title,
  price,
  qty,
  onAdd,
  onRemove,
  onDelete,
}: Props) {
  // Estado de la imagen: loading | ok | error
  const [imgStatus, setImgStatus] = useState<"loading" | "ok" | "error">(
    image ? "loading" : "error"
  );

  const showImage = imgStatus === "ok";
  const showLoading = imgStatus === "loading";
  const showPlaceholder = imgStatus === "error";

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {showImage && !!image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            onLoad={() => setImgStatus("ok")}
            onLoadEnd={() => {
              // si no pasó por onLoad (algunas plataformas), mantenemos estado actual
            }}
            onError={() => setImgStatus("error")}
          />
        ) : showLoading ? (
          <View style={styles.placeholder}>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.placeholder}>
            <AntDesign name="picture" size={22} color="#9aa5b1" />
            <Text style={styles.placeholderText}>Imagen no disponible</Text>
          </View>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.price}>${price.toLocaleString("es-CL")}</Text>

        <View style={styles.actionsRow}>
          <View style={styles.quantityContainer}>
            {/* Disminuir cantidad */}
            <Pressable style={styles.iconButton} onPress={onRemove}>
              <FontAwesome5 name="minus" size={10} color="#348ba8" />
            </Pressable>

            <Text style={styles.quantityText}>{qty}</Text>

            {/* Aumentar cantidad */}
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

const IMG_SIZE = 80;

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
  imageWrap: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    borderRadius: 8,
    marginRight: 12,
    overflow: "hidden",
    backgroundColor: "#f2f6f9",
    borderWidth: 1,
    borderColor: "#e6eef3",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    gap: 4,
  },
  placeholderText: {
    fontSize: 10,
    color: "#9aa5b1",
    textAlign: "center",
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
    gap: 20,
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
