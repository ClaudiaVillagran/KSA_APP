import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { AdviceData } from "../../data/dataAreasToResolve/AdviceData";
import AdviceCard from "../../components/cards/AdviceCard";
import { ScrollView } from "react-native-gesture-handler";
export default function Advice() {
  const [searchText, setSearchText] = useState("");
  const filteredCards = AdviceData.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/img/asesoria.webp")}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>¿Necesitas asesoría?</Text>
            <Text style={styles.subtitle}>¡Tenemos la solución!</Text>
          </View>
        </ImageBackground>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Asesoría Profesional</Text>
          <Text style={styles.description}>
            En KSA te ofrecemos soluciones expertas en arquitectura, ingeniería,
            construcción y más. Con asesoría especializada y cumplimiento de
            plazos, garantizamos calidad, eficiencia y total tranquilidad en
            cada proyecto.
          </Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Buscar en asesoría"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        {filteredCards.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No se encontraron servicios
          </Text>
        ) : (
          filteredCards.map((item, index) => (
            <AdviceCard key={index} imageUrl={item.img} title={item.title} />
          ))
        )}
        <View style={styles.tipContainer}>
          <Text style={styles.tipTitle}>💡 Consejo KSA</Text>
          <Text style={styles.tipDescription}>
            Antes de iniciar cualquier proyecto, busca asesoría especializada.
            Un buen consejo a tiempo puede ahorrarte costos, evitar errores y
            optimizar recursos. En KSA, te guiamos desde el inicio para que
            tomes decisiones seguras y acertadas.
          </Text>
        </View>
      </View>
    </ScrollView>
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
    backgroundColor: "rgba(0, 0, 0, 0.6)", // oscurecer un poco la imagen
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
    backgroundColor: "#f0f8ff", // azul muy claro o el color de tu marca
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 30,
    marginBottom: 50,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: "#348ba8ff", // un color distintivo como azul KSA
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3, // Android shadow
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
});
