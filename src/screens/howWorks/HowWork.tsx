import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function HowWork({ scrollToPlansSection }: { scrollToPlansSection?: () => void }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* CLIENTES */}
      <Text style={styles.title}>¿Cómo funciona KSA?</Text>
      <Text style={styles.description}>
        En KSA te conectamos con los mejores proveedores para el cuidado,
        instalación o mejora de tu hogar. ¡Así de fácil!
      </Text>

      <View style={styles.stepContainer}>
        <Feather name="search" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 1</Text>
        <Text style={styles.stepDescription}>
          Explora las categorías y encuentra el servicio que necesitas:
          mantención, construcción, asesoría y servicios.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Feather name="tool" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 2</Text>
        <Text style={styles.stepDescription}>
          Compara opciones, precios y elige al proveedor ideal según tus
          preferencias.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <FontAwesome name="calendar-check-o" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 3</Text>
        <Text style={styles.stepDescription}>
          Agenda el servicio según tus tiempos o solicita contacto.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <FontAwesome name="handshake-o" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 4</Text>
        <Text style={styles.stepDescription}>
          Nuestro equipo o proveedor se encarga de todo, ¡Tú solo relájate!
        </Text>
      </View>

      {/* BENEFICIOS CLIENTES */}
      <Text style={styles.subtitle}>¿Por qué elegir KSA?</Text>

      <View style={styles.featureContainer}>
        <FontAwesome6 name="clock" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Ahorra tiempo</Text>
      </View>

      <View style={styles.featureContainer}>
        <Entypo name="tools" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Proveedores verificados</Text>
      </View>

      <View style={styles.featureContainer}>
        <FontAwesome name="commenting-o" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Atención personalizada</Text>
      </View>

      <View style={styles.featureContainer}>
        <Entypo name="check" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Garantía en servicios</Text>
      </View>

      {/* PROVEEDORES */}
      <Text style={styles.subtitle}>¿Eres proveedor de servicios?</Text>
      <Text style={styles.description}>
        En KSA puedes ofrecer tus servicios a miles de personas que buscan soluciones para su hogar. ¡Es muy fácil comenzar!
      </Text>

      <View style={styles.stepContainer}>
        <AntDesign name="adduser" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 1</Text>
        <Text style={styles.stepDescription}>
          Regístrate como proveedor completando el formulario con tu información básica.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Feather name="edit" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 2</Text>
        <Text style={styles.stepDescription}>
          Elige el plan que mejor se adapte a tu negocio: mensual, semestral, anual o flexible sin costo inicial.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <FontAwesome6 name="eye" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 3</Text>
        <Text style={styles.stepDescription}>
          Tu perfil aparecerá en KSA y será visible para miles de personas en tu ciudad.
        </Text>
      </View>

      <View style={styles.stepContainer}>
        <Feather name="dollar-sign" size={40} color="#007BFF" />
        <Text style={styles.stepTitle}>Paso 4</Text>
        <Text style={styles.stepDescription}>
          Recibe solicitudes, gestiona tus servicios desde tu cuenta y comienza a generar ingresos.
        </Text>
      </View>

      <Text style={styles.subtitle}>Beneficios para proveedores</Text>

      <View style={styles.featureContainer}>
        <Entypo name="bar-graph" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Visibilidad en 16 ciudades</Text>
      </View>

      <View style={styles.featureContainer}>
        <FontAwesome name="star-o" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Perfil destacado y reseñas</Text>
      </View>

      <View style={styles.featureContainer}>
        <Feather name="users" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Acceso a la comunidad KSA</Text>
      </View>

      <View style={styles.featureContainer}>
        <AntDesign name="like2" size={28} color="#007BFF" />
        <Text style={styles.featureText}>Publicidad dirigida y analítica</Text>
      </View>

      {scrollToPlansSection && (
        <Pressable style={styles.ctaButton} onPress={scrollToPlansSection}>
          <Text style={styles.ctaButtonText}>Ver planes</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 15,
  },
  stepContainer: {
    marginBottom: 25,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
    color: "#007BFF",
  },
  stepDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
    padding: 10,
    width: "80%",
    marginLeft: "10%",
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  ctaButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 24,
    alignSelf: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
