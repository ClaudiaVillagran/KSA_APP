import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Linking } from "react-native";
import { s, vs } from "react-native-size-matters";
import { Feather } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import LogoTransbank from "../assets/svg/LogoTransbank";


export default function FooterComponent() {
  return (
    <View style={styles.container}>
      {/* Contacto */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>Contacto</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="whatsapp" size={20} color="#00bfff" marginRight="10" />
          <Text style={styles.text}>+569 4474 8591</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Fontisto name="email" size={20} color="#00bfff" marginRight="10" />
          <Text style={styles.text}>contacto@ksa.cl</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="clockcircleo" size={20} color="#00bfff" marginRight="10" />
          <View>
            <Text style={styles.text}>Lunes a Viernes de 9:00 a 18:00</Text>
            <Text style={styles.text}>Sábado de 9:00 a 13:00</Text>
          </View>
        </View>

      </View>

      {/* Redes Sociales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Síguenos</Text>
        <View style={styles.iconRow}>
          <Pressable onPress={() => Linking.openURL("https://www.facebook.com/ksachile")}>
            <FontAwesome6 name="facebook" size={24} color="#00bfff" />
          </Pressable>
          <Pressable onPress={() => Linking.openURL("https://www.instagram.com/ksa_servicios")}>
           <FontAwesome6 name="instagram" size={24} color="#00bfff" />
          </Pressable>
          <Pressable onPress={() => Linking.openURL("https://www.tiktok.com/@ksa.cl")}>
        <FontAwesome6 name="tiktok" size={24} color="#00bfff" />
          </Pressable>
        </View>
      </View>

      {/* Enlaces rápidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enlaces rápidos</Text>
        {[
          { label: "Quiénes somos", url: "#" },
          { label: "Conviértete en proveedor", url: "#" },
          { label: "Preguntas frecuentes", url: "#" },
          { label: "Términos y condiciones", url: "#" },
          { label: "Políticas de privacidad", url: "#" },
          { label: "Contáctanos", url: "#" },
        ].map((item, index) => (
          <Pressable key={index} onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.link}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Pagos seguros */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos seguros</Text>
        <View style={styles.paymentLogos}>
          
          <LogoTransbank style={{ width: 150 , height: 50 }} />
          {/* <Image source={require("../assets/transbank.png")} style={styles.logo} />
          <Image source={require("../assets/flow.png")} style={styles.logo} /> */}
        </View>
      </View>

      {/* Copyright */}
      <Pressable onPress={() => Linking.openURL("https://github.com/ClaudiaVillagran")}>
        <Text style={styles.copy}>© 2025 KSA. Todos los derechos reservados.</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#040714",
    paddingVertical: vs(30),
    paddingHorizontal: s(20),
    alignItems: "center",
  },
  section: {
    marginBottom: vs(20),
    alignItems: "center",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: s(14),
    color: "#fff",
    marginBottom: 15,
    textTransform: "uppercase",
  },
  text: {
    fontSize: s(12),
    marginBottom: 10,
    color: "#ccc",
    textAlign: "center",
  },
  iconRow: {
    flexDirection: "row",
    gap: s(15),
    marginTop: 8,
  },
  link: {
    fontSize: s(12),
    color: "#ccc",
    textDecorationLine: "none",
    marginVertical: 5,
    textAlign: "center",
  },
  paymentLogos: {
    flexDirection: "row",
    gap: s(15),
    marginTop: 10,
  },
  logo: {
    width: 60,
    height: 30,
    resizeMode: "contain",
  },
  copy: {
    fontSize: s(10),
    color: "#555",
    marginTop: vs(20),
    textAlign: "center",
  },
});
