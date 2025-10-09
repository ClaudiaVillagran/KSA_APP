import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import LogoKsa from "../../assets/svg/LogoKsa";
import PlanTable from "../howWorks/PlanTable";
import { Feather as Icon } from "@expo/vector-icons";

export default function OurPlans({ scrollToPlansSection, onPlanSelect }) {
  const planImages: { [key: string]: any } = {
    planBasico: require("../../assets/img/planBasico.webp"),
    planPro: require("../../assets/img/planPro.webp"),
    planPremium: require("../../assets/img/planPremium.webp"),
    planFlexible: require("../../assets/img/planPremium.webp"), // asegúrate de tener esta imagen
  };

  const renderFeature = (text: string) => (
    <View style={styles.planFeatureRow} key={text}>
      <Icon
        name="check-circle"
        size={16}
        color="#007BFF"
        style={{ marginRight: 8 }}
      />
      <Text style={styles.planFeature}>{text}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Sección de propósito */}
      <View style={styles.sectionContent}>
        <LogoKsa style={{ width: 100, height: 50 }} />
        <Text style={styles.sectionTitle}>Impulsa tu negocio con KSA</Text>
        <Text style={styles.sectionText}>
          Facilitamos el acceso a servicios de alta calidad para el hogar
          mediante nuestra plataforma KSA, de forma digital, intuitiva y fácil,
          beneficiando tanto a usuarios como a proveedores.
        </Text>
        <Pressable style={styles.ctaButton} onPress={scrollToPlansSection}>
          <Text style={styles.ctaButtonText}>¡Suscríbete ahora!</Text>
        </Pressable>
      </View>

      {/* Sección visual */}
      <View style={styles.sectionHero}>
        <Image
          style={styles.heroImage}
          source={require("../../assets/img/HowWorksPage.webp")}
        />
        <Text style={styles.heroTitle}>
          ¿Tienes un negocio de servicios para el hogar?
        </Text>
        <Text style={styles.heroSubtitle}>
          Conviértete en proveedor de KSA y atrae más clientes todos los días
        </Text>
      </View>

      {/* Sección cifras */}
      <View style={styles.sectionContent}>
        <Text style={styles.sectionTitle}>¡KSA EN CIFRAS!</Text>
        <Text style={styles.sectionText}>
          ¿Sabías que un plan de marketing digital tradicional solo para redes
          sociales puede costar hasta $4.560.000 al año? ¡Con KSA, ahorras más
          del 80% y obtienes masividad, visibilidad, nuevos clientes y soporte
          incluido!
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>Exclusividad</Text>
            <Text style={styles.statValue}>Solo 4600 cupos para 2025</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>+300 servicios</Text>
            <Text style={styles.statValue}>5 categorías y 16 ciudades</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statTitle}>80% de ahorro</Text>
            <Text style={styles.statValue}>En marketing y publicidad</Text>
          </View>
        </View>
      </View>

      {/* Tabla de comparación */}
      <PlanTable />

      {/* Planes */}
      <View style={styles.planSection}>
        <Text style={styles.sectionTitle}>Planes KSA</Text>

        {["planFlexible", "planBasico", "planPro", "planPremium"].map(
          (plan, index) => {
            const isFlexible = plan === "planFlexible";
            return (
              <View
                key={index}
                style={[
                  styles.planCard,
                  isFlexible && {
                    backgroundColor: "#e6f7ff",
                    borderWidth: 2,
                    borderColor: "#007BFF",
                  },
                ]}
              >
                {isFlexible && (
                  <View style={styles.ribbon}>
                    <Text style={styles.ribbonText}>¡Sin costo inicial!</Text>
                  </View>
                )}

                <Image style={styles.planImage} source={planImages[plan]} />

                <View style={styles.planDetails}>
                  {[
                    "Alcance y visibilidad",
                    "Masividad y escalabilidad",
                    "Soporte",
                    "Perfil destacado",
                    "Control de servicios",
                    "Generación de leads",
                    ...(plan !== "planBasico"
                      ? ["Publicidad dirigida", "Analítica avanzada"]
                      : []),
                    ...(plan === "planPro" || plan === "planPremium"
                      ? ["KSA Networking", "KSA Community"]
                      : []),
                    ...(plan === "planPremium"
                      ? ["KSA Marketing", "KSA Academy", "KSA Showcase"]
                      : []),
                    ...(isFlexible
                      ? [
                          "Sin pago mensual fijo",
                          "Solo comisión por venta",
                          "5% de comisión con tope $5.000.000",
                          "Ideal para comenzar sin inversión",
                        ]
                      : []),
                  ].map(renderFeature)}
                </View>

                <View style={styles.planPricing}>
                  <Text style={styles.planCupos}>
                    {isFlexible
                      ? "Modelo sin mensualidad"
                      : plan === "planPremium"
                      ? "Solo 4000 Cupos"
                      : "Solo 300 Cupos"}
                  </Text>
                  <Text style={styles.planType}>
                    {isFlexible
                      ? "Plan Flexible"
                      : plan === "planBasico"
                      ? "Plan mensual"
                      : plan === "planPro"
                      ? "Plan semestral"
                      : "Plan anual"}
                  </Text>
                  <Text
                    style={[
                      styles.planPrice,
                      isFlexible && { color: "#28a745" },
                    ]}
                  >
                    {isFlexible
                      ? "Comienza gratis • Comisión del 5%"
                      : plan === "planBasico"
                      ? "3,49 UF + IVA/Mes"
                      : plan === "planPro"
                      ? "3,19 UF + IVA/Mes"
                      : "2,89 UF + IVA/Mes"}
                  </Text>

                  {/* CTA según plan */}
                {isFlexible ? (
  <Pressable
    style={styles.ctaButtonGreen}
    onPress={() => onPlanSelect("flexible")}
  >
    <Text style={styles.ctaButtonText}>¡Quiero empezar gratis!</Text>
  </Pressable>
) : (
  <Pressable
    style={styles.ctaButton}
    onPress={() =>
      onPlanSelect(
        plan === "planBasico"
          ? "monthly"
          : plan === "planPro"
          ? "semiannual"
          : "annual"
      )
    }
  >
    <Text style={styles.ctaButtonText}>¡Lo quiero!</Text>
  </Pressable>
)}


                </View>
              </View>
            );
          }
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  sectionHero: {
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    color: "#222",
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  ctaButtonGreen: {
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 8,
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heroImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginTop: 12,
  },
  sectionContent: {
    backgroundColor: "#fff",
    padding: 16,
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionText: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f0f4ff",
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statTitle: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
    color: "#007BFF",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  planSection: {
    marginBottom: 50,
  },
  planCard: {
    marginVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  planImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  planDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  planFeatureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  planFeature: {
    fontSize: 14,
    color: "#444",
  },
  planPricing: {
    padding: 16,
    alignItems: "center",
  },
  planCupos: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  planType: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  planPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007BFF",
    marginBottom: 12,
  },
  ribbon: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    zIndex: 10,
  },
  ribbonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
