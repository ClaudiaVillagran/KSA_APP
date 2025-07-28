import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { ConstructionData } from "../../data/dataAreasToResolve/ConstructionData";
import ConstructionCard from "../../components/cards/ConstructionCard";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

export default function Construction() {
  const [searchText, setSearchText] = useState("");
  const scrollRef = useRef();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const filteredCards = ConstructionData.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.container}>
          <ImageBackground
            source={require("../../assets/img/construccion.webp")}
            style={styles.hero}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>¿Necesitas construcciones?</Text>
              <Text style={styles.subtitle}>¡Tenemos la solución!</Text>
            </View>
          </ImageBackground>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Construcción</Text>
            <Text style={styles.description}>
              En KSA, construimos tu visión con profesionalismo y confianza.
              Nuestro equipo se encarga de cada detalle para ofrecerte
              resultados duraderos y sin complicaciones. ¿Listo para construir o
              remodelar? ¡Contáctanos, nosotros nos encargamos!
            </Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Buscar en construcción"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />

          {filteredCards.length === 0 ? (
            <Text
              style={{ textAlign: "center", marginTop: 20, color: "#888" }}
            >
              No se encontraron servicios
            </Text>
          ) : (
            filteredCards.map((item, index) => (
              <ConstructionCard
                key={index}
                imageUrl={item.img}
                title={item.title}
              />
            ))
          )}

          <View style={styles.tipContainer}>
            <Text style={styles.tipTitle}>💡 Consejo KSA</Text>
            <Text style={styles.tipDescription}>
              Antes de comenzar una obra, asegúrate de contar con un buen plan
              y permisos al día. Una construcción bien planificada evita
              retrasos, sobrecostos y problemas legales. ¡Invertir tiempo en la
              preparación es construir con inteligencia!
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.floatingButton} onPress={scrollToTop}>
        <AntDesign name="arrowup" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    backgroundColor: "#fff",
  },
  hero: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  breadcrumb: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  breadcrumbText: {
    color: "#888",
    fontSize: 14,
  },
  descriptionSection: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#111",
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
  input: {
    borderWidth: 1,
    borderColor: "#348ba8ff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 20,
    marginHorizontal: 16,
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
  },
  tipContainer: {
    backgroundColor: "#f0f8ff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 30,
    marginBottom: 50,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#348ba8ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  tipDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#348ba8ff",
    borderRadius: 30,
    padding: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
