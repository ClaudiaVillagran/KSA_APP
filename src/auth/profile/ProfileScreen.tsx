import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { clearUser } from "../../store/reducers/userSlice";
import { useNavigation } from "@react-navigation/native";
import { clearCart } from "../../store/reducers/cartSlice";

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.userSlice);

  // console.log("user from profilescreen", user);
  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión en Firebase
      dispatch(clearCart()); // Limpiar el estado de Redux
      dispatch(clearUser()); // Limpiar el estado de Redux
      navigation.navigate("PrincipalTabs");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <View style={styles.container}>
      {user && user.uid ? (
        <>
          <Text style={styles.title}>Perfil de Usuario</Text>
          <Text style={styles.info}>
            Nombre: {user.displayName || "No disponible"}
          </Text>
          <Text style={styles.info}>Correo: {user.email}</Text>
          <Button title="Cerrar sesión" onPress={handleLogout} />
        </>
      ) : (
        <Text>No hay usuario autenticado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginVertical: 10,
  },
});
