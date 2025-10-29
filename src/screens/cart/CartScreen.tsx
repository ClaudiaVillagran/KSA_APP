// screens/cart/CartScreen.tsx
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import LogoKsa from "../../assets/svg/LogoKsa";
import ItemCart from "./ItemCart";
import { RootState } from "../../store/store";
import EmptyCart from "./EmptyCart";
import {
  addItemToCart,
  removeItemFromCart,
  removeProductFromCart,
} from "../../store/reducers/cartSlice";

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const { items } = useSelector((state: RootState) => state.cartSlice);

  // ✅ Subtotal consistente: usa price si existe; si no, usa sum (unitario) y multiplica por qty
  const subtotal = items.reduce((total, item: any) => {
    const unit = (typeof item.price === "number" ? item.price : item.sum) || 0;
    const qty = item?.qty || 0;
    return total + unit * qty;
  }, 0);

  return (
    <View style={styles.container}>
      {/* Header: logo */}
      <View style={styles.logoContainer}>
        <LogoKsa width={100} height={50} />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item: any) => String(item.id)}
            renderItem={({ item }: any) => {
              const unit = (typeof item.price === "number" ? item.price : item.sum) || 0;
              return (
                <ItemCart
                  id={item.id}
                  image={item.image}
                  title={item.title}
                  price={unit}     // 👈 El ItemCart muestra el precio unitario
                  qty={item.qty}
                  onAdd={() => dispatch(addItemToCart(item))}
                  onRemove={() => dispatch(removeItemFromCart(item))}
                  onDelete={() => dispatch(removeProductFromCart(item))}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}

        {/* Footer solo si hay productos */}
        {items.length > 0 && (
          <View style={styles.footer}>
            <View style={styles.subtotalRow}>
              <Text style={styles.subtotalLabel}>Subtotal:</Text>
              <Text style={styles.subtotalValue}>
                ${subtotal.toLocaleString("es-CL")}
              </Text>
            </View>

            <Pressable
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("CartBillingDetails")}
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
  container: { flex: 1, backgroundColor: "#fff" },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: "#fff",
  },
  body: { flex: 1, justifyContent: "space-between" },
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
  subtotalLabel: { fontSize: 16, color: "#444", fontWeight: "600" },
  subtotalValue: { fontSize: 16, color: "#111", fontWeight: "700" },
  checkoutButton: {
    backgroundColor: "#348ba8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  checkoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
