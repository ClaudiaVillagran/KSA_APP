import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import LogoKsa from "../../assets/svg/LogoKsa";
import ItemCart from "./ItemCart"; // puedes mapear múltiples
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import EmptyCart from "./EmptyCart";
import {
  addItemToCart,
  removeItemFromCart,
  removeProductFromCart,
} from "../../store/reducers/cartSlice";
import { useNavigation } from "@react-navigation/native";

export default function CartScreen() {
  const navigation = useNavigation();
  const { items } = useSelector((state: RootState) => state.cartSlice);

  const dispatch = useDispatch();

  // Calcular el subtotal
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoKsa width={100} height={50} />
      </View>

      <View style={styles.body}>
        {/* Si el carrito está vacío, muestra el componente EmptyCart */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ItemCart
                id={item.id}
                image={item.image}
                title={item.title}
                price={item.sum}
                qty={item.qty}
                // Lógica para aumentar cantidad
                onAdd={() => dispatch(addItemToCart(item))}
                // Lógica para disminuir cantidad
                onRemove={() => dispatch(removeItemFromCart(item))}
                // Lógica para eliminar producto
                onDelete={() => dispatch(removeProductFromCart(item))}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Solo muestra el footer si hay productos en el carrito */}
        {items.length > 0 && (
          <View style={styles.footer}>
            {/* Detalles del subtotal */}
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal:</Text>
              <Text style={styles.subtotalValue}>
                ${subtotal.toLocaleString()}
              </Text>
            </View>

            <Pressable
              style={styles.checkoutButton}
              onPress={() =>
                navigation.navigate("CheckOutStack")
              }
            >
              <Text style={styles.checkoutButtonText}>Finalizar compra</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  body: {
    flex: 1,
    justifyContent: "space-between",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
  },
  subtotalValue: {
    fontSize: 16,
    color: "#111",
    fontWeight: "700",
  },
  checkoutButton: {
    backgroundColor: "#348ba8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
