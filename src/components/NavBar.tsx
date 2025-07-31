import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ShopIcon from "../components/icons/ShopIcon";
import DownIcon from "../components/icons/DownIcon";
import LogoKsa from "../assets/svg/LogoKsa";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Ionicons } from "@expo/vector-icons"; // Para el ícono de perfil

export default function NavBar() {
  const navigation = useNavigation();
  const { items } = useSelector((state: RootState) => state.cartSlice);
  const user = useSelector((state: RootState) => state.userSlice); // Obtener el usuario desde Redux
  // console.log("user from navbar", user);
  const [text, setText] = useState("");

  // Función para obtener solo la primera parte del nombre (antes del primer espacio)
  const getFirstName = (name: string | null) => {
    if (name) {
      return name.split(" ")[0]; // Dividir el nombre por el espacio y tomar la primera parte
    }
    return "Usuario"; // Valor por defecto si no hay nombre
  };

  return (
    <View style={styles.containerNavbar}>
      <View style={styles.row}>
        <View style={styles.logoAndLogin}>
          <LogoKsa style={{ width: 50, height: 50, marginRight: 10 }} />

          {/* Mostrar el perfil o iniciar sesión dependiendo de si el usuario está autenticado */}
          {user && user.uid ? (
            <>
              <Pressable
                onPress={() => navigation.navigate("ProfileScreen")} // Redirigir a ProfileScreen si el usuario está autenticado
                style={({ pressed }) => [
                  {
                    ...(Platform.OS === "web" && { cursor: "pointer" }),
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <View style={styles.profileContainer}>
                  <Ionicons
                    name="person-circle"
                    size={28}
                    color="#2563EB"
                    style={styles.profileIcon}
                  />
                  <Text style={styles.loginText}>
                    ¡Hola, {getFirstName(user.displayName)}!
                  </Text>
                </View>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("ProfileScreen")}>
                <DownIcon />
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                onPress={() =>
                  navigation.navigate("AuthStack", { screen: "SignInScreen" }) // Redirigir a AuthStack si el usuario no está autenticado
                }
                style={({ pressed }) => [
                  {
                    ...(Platform.OS === "web" && { cursor: "pointer" }),
                    opacity: pressed ? 0.6 : 1,
                  },
                ]}
              >
                <Text style={styles.loginText}>¡HOLA!</Text>
                <Text style={styles.loginText}>Inicia sesión</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate("AuthStack", { screen: "SignInScreen" })
                }
              >
                <DownIcon />
              </Pressable>
            </>
          )}
        </View>

        {/* Carrito */}
        <Pressable
          onPress={() =>
            navigation.navigate("ServicesStack", { screen: "CartScreen" })
          }
        >
          <View style={styles.cartIconContainer}>
            <ShopIcon />
            {/* Mostrar el círculo con la cantidad si hay productos en el carrito */}
            {items.length > 0 && (
              <View style={styles.cartQuantityCircle}>
                <Text style={styles.cartQuantityText}>{items.length}</Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.inputSearch}
          placeholder="Buscar servicios..."
          value={text}
          onChangeText={setText}
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerNavbar: {
    minHeight: 60,
    justifyContent: "center",
    backgroundColor: "#fff", // Fondo blanco
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd", // Línea inferior sutil
  },
  logoAndLogin: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#f0f0f0", // Fondo sutil detrás del nombre y el ícono
  },
  profileIcon: {
    marginRight: 8, // Espacio entre el ícono y el nombre
  },
  loginText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#000000ff", // Color azul moderno
  },
  searchBar: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputSearch: {
    flex: 1,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: "#000",
  },
  cartIconContainer: {
    position: "relative",
  },
  cartQuantityCircle: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 20,
    height: 20,
    borderRadius: 10, // Círculo
    justifyContent: "center",
    alignItems: "center",
  },
  cartQuantityText: {
    fontSize: 12,
    color: "white",
    fontWeight: "bold",
  },
});
