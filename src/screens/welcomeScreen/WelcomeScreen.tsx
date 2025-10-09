import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LogoKsa from "../../assets/svg/LogoKsa"; // ajusta la ruta si difiere

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  const goAsClient = () => {
    // Abrir tabs con la pestaña "Home" seleccionada
    navigation.reset({
      index: 0,
      routes: [{ name: "PrincipalTabs", params: { initialTab: "Home" } }],
    });
  };

  const goAsProvider = () => {
    // Abrir tabs con la pestaña "HazteProveedor" seleccionada
    navigation.reset({
      index: 0,
      routes: [{ name: "PrincipalTabs", params: { initialTab: "HazteProveedor" } }],
    });
  };

  return (
    <View style={styles.container}>
      <LogoKsa width={120} height={120} />
      <Text style={styles.subtitle}>
        Encuentra servicios para tu hogar o ofrece tus servicios.
      </Text>

      <View style={styles.actions}>
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={goAsClient}>
          <Text style={styles.btnTextPrimary}>Entrar como cliente</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnOutline]} onPress={goAsProvider}>
          <Text style={styles.btnTextOutline}>Entrar como proveedor</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "800", marginTop: 16 },
  subtitle: { marginTop: 8, fontSize: 15, textAlign: "center", color: "#555" },
  actions: { width: "100%", marginTop: 28, gap: 12 },
  btn: { paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  btnPrimary: { backgroundColor: "#0074D9" },
  btnOutline: { borderWidth: 1, borderColor: "#0074D9" },
  btnTextPrimary: { color: "#fff", fontWeight: "700", fontSize: 16 },
  btnTextOutline: { color: "#0074D9", fontWeight: "700", fontSize: 16 },
});
