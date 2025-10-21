import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function HowWork({
  onViewServices,
  onViewPlans,
  onBeProvider,
}: {
  onViewServices?: () => void;
  onViewPlans?: () => void;
  onBeProvider?: () => void;
}) {
  const C = palette;

  const clientSteps = [
    {
      n: 1,
      icon: <Feather name="search" size={22} color={C.accent} />,
      title: "Paso 1",
      body:
        "Explora las categorías y encuentra el servicio que necesitas: mantención, construcción, asesoría, instalación y servicios.",
    },
    { n: 2, icon: <Entypo name="check" size={22} color={C.accent} />, title: "Paso 2", body: "Selecciona el servicio que necesitas." },
    { n: 3, icon: <Entypo name="location-pin" size={22} color={C.accent} />, title: "Paso 3", body: "Indica tu comuna para ver disponibilidad." },
    { n: 4, icon: <Entypo name="shopping-cart" size={22} color={C.accent} />, title: "Paso 4", body: "Añade el producto al carrito." },
    { n: 5, icon: <AntDesign name="creditcard" size={22} color={C.accent} />, title: "Paso 5", body: "Finaliza la compra." },
    {
      n: 6,
      icon: <FontAwesome name="handshake-o" size={22} color={C.accent} />,
      title: "Paso 6",
      body: "Recibe el servicio contratado y disfruta de la garantía KSA en todos los trabajos.",
    },
  ];

  const clientBenefits = [
    { icon: <Entypo name="clock" size={20} color={C.accent} />, title: "Ahorra tiempo", body: "Encuentra rápido al experto ideal sin complicaciones" },
    { icon: <Entypo name="tools" size={20} color={C.accent} />, title: "Proveedores verificados", body: "Confianza garantizada con profesionales revisados y certificados" },
    { icon: <Entypo name="chat" size={20} color={C.accent} />, title: "Atención personalizada", body: "Soluciones hechas a tu medida, no genéricas" },
    { icon: <Entypo name="check" size={20} color={C.accent} />, title: "Garantía en servicios", body: "Tu inversión segura con respaldo y calidad comprobada de KSA" },
  ];

  const providerSteps = [
    { n: 1, icon: <Entypo name="compass" size={20} color={C.accent} />, title: "Paso 1", body: "Ve al menú Planes y selecciona el que te acomode." },
    { n: 2, icon: <Feather name="file-text" size={20} color={C.accent} />, title: "Paso 2", body: "Completa el formulario de suscripción para enviar tu suscripción." },
    { n: 3, icon: <AntDesign name="lock" size={20} color={C.accent} />, title: "Paso 3", body: "Regístrate o inicia sesión." },
    { n: 4, icon: <Entypo name="shopping-cart" size={20} color={C.accent} />, title: "Paso 4", body: "Revisa tu carrito para finalizar la compra." },
    { n: 5, icon: <Entypo name="stopwatch" size={20} color={C.accent} />, title: "Paso 5", body: "Espera un máximo de 24 hrs para que tu cuenta esté activa." },
    { n: 6, icon: <Entypo name="upload" size={20} color={C.accent} />, title: "Paso 6", body: "Sube tus productos y aumenta tus ventas." },
  ];

  return (
    <ScrollView contentContainerStyle={s.container}>
      {/* HERO estilo KSA (azul profundo) */}
      <View style={s.hero}>
        <Text style={s.h1}>¿Cómo funciona KSA?</Text>
        <Text style={s.lead}>
          Encuentra a los mejores proveedores para el cuidado, instalación o mejora de tu hogar de forma rápida y segura.
        </Text>
        {onViewPlans && (
          <Pressable style={[s.btn, s.btnPrimary, { marginTop: 12 }]} onPress={onViewPlans}>
            <Text style={s.btnPrimaryText}>Súmate ahora</Text>
          </Pressable>
        )}
      </View>

      {/* CLIENTES */}
      <SectionHeader title="¿Estás buscando un servicio? Así funciona para ti" />
      <Timeline steps={clientSteps} />

      {onViewServices && (
        <Pressable style={[s.btn, s.btnOutline, { marginTop: 8 }]} onPress={onViewServices} accessibilityRole="button" hitSlop={8}>
          <Text style={s.btnOutlineText}>Ver servicios disponibles</Text>
        </Pressable>
      )}

      <View style={s.divider} />

      <Text style={s.h2}>¿Por qué elegir KSA?</Text>
      <View style={s.featuresGrid}>
        {clientBenefits.map((b, idx) => (
          <FeatureTile key={`benefit-${idx}`} icon={b.icon} title={b.title} body={b.body} />
        ))}
      </View>

      {/* Banda crema KSA para proveedores */}
      <View style={s.creamBlock}>
        <SectionHeader
          title="¿Eres proveedor? Así funciona para ti"
          subtitle="Publica tus servicios en KSA y comienza a recibir solicitudes de clientes reales."
        />
        <Timeline steps={providerSteps} />

        <View style={{ gap: 10, marginTop: 8 }}>
          {onViewPlans && (
            <Pressable style={[s.btn, s.btnPrimary]} onPress={onViewPlans} accessibilityRole="button" hitSlop={8}>
              <Text style={s.btnPrimaryText}>Ir a Planes</Text>
            </Pressable>
          )}
          {onBeProvider && (
            <Pressable style={[s.btn, s.btnSoft]} onPress={onBeProvider} accessibilityRole="button" hitSlop={8}>
              <Text style={s.btnSoftText}>Quiero ser proveedor</Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={{ height: 28 }} />
    </ScrollView>
  );
}

/* ------------ Subcomponentes ------------ */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={s.sectionHeader}>
      <Text style={s.h2}>{title}</Text>
      {subtitle ? <Text style={s.sub}>{subtitle}</Text> : null}
    </View>
  );
}

function FeatureTile({ icon, title, body }: { icon: JSX.Element; title: string; body: string }) {
  return (
    <View style={s.featureItem}>
      <View style={{ marginRight: 10 }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={s.featureTitle}>{title}</Text>
        <Text style={s.featureBody}>{body}</Text>
      </View>
    </View>
  );
}

function Timeline({ steps }: { steps: Array<{ n: number; icon: JSX.Element; title: string; body: string }> }) {
  return (
    <View style={s.timeline}>
      {steps.map((step, i) => (
        <View key={`tl-${step.n}-${i}`} style={s.timelineRow}>
          <View style={s.timelineLeft}>
            <View style={s.badgeWrap}>
              <View style={s.badgeCircle}><Text style={s.badgeText}>{step.n}</Text></View>
              <View style={s.badgeIcon}>{step.icon}</View>
            </View>
            {i !== steps.length - 1 && <View style={s.badgeLine} />}
          </View>
          <View style={s.timelineCard}>
            <Text style={s.cardTitle}>{step.title}</Text>
            <Text style={s.cardBody}>{step.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ------------ Paleta KSA ------------ */
const palette = {
  // Colores “equivalentes” a tu CSS
  bg: "#ffffffff",
  paper: "#ffffff",
  text: "#1f2a34",
  muted: "#6b7785",
  accent: "#2f8bf4ff", // KSA CTA naranja
  accentDarkText: "#231a12",
  soft: "#e9f8ffff",
  line: "#edf1f4",
  heroBg: "#0f2535", // azul hero
  cream: "#ffffffff",  // crema secciones
  successBg: "#e8fffeff",
  successText: "#126f3a",
  cardShadow: "rgba(15,37,53,.08)",
};

/* ------------ Estilos ------------ */
const s = StyleSheet.create({
  container: { backgroundColor: palette.bg },

  /* HERO */
  hero: {
    backgroundColor: palette.heroBg,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 6,
  },
  h1: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  lead: { fontSize: 15, color: "#dbe6ef", textAlign: "center", lineHeight: 22 },

  /* Sección */
  sectionHeader: { marginTop: 16, marginBottom: 10 },
  h2: {
    fontSize: 20,
    fontWeight: "800",
    color: palette.text,
    textAlign: "center",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  sub: { fontSize: 14, color: palette.muted, textAlign: "center" },
  divider: { height: 1, backgroundColor: palette.line, marginVertical: 16 },

  /* Timeline */
  timeline: { marginTop: 6 },
  timelineRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  timelineLeft: { width: 46, alignItems: "center" },
  badgeWrap: { alignItems: "center" },
  badgeCircle: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: palette.accent, alignItems: "center", justifyContent: "center",
    shadowColor: palette.accent, shadowOpacity: 0.25, shadowRadius: 8, elevation: 2,
  },
  badgeText: { color: palette.accentDarkText, fontWeight: "900", fontSize: 12 },
  badgeIcon: { marginTop: 6, backgroundColor: palette.soft, borderRadius: 16, padding: 6, borderWidth: 1, borderColor: "#b6ddffff" },
  badgeLine: { width: 2, flex: 1, backgroundColor: palette.line, marginTop: 6 },

  timelineCard: {
    flex: 1,
    backgroundColor: palette.paper,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  cardTitle: { fontSize: 15, fontWeight: "800", color: palette.text, marginBottom: 4 },
  cardBody: { fontSize: 14, color: palette.muted },

  /* Beneficios */
  featuresGrid: { gap: 10, marginTop: 6 },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: palette.paper,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: palette.line,
    shadowColor: palette.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  featureTitle: { fontSize: 15, fontWeight: "800", color: palette.text, marginBottom: 2 },
  featureBody: { fontSize: 13.5, color: palette.muted },

  /* Banda crema (look KSA) */
  creamBlock: {
    marginTop: 16,
    backgroundColor: palette.cream,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#cfe0f0ff",
  },

  /* Botones KSA */
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignSelf: "stretch",
  },
  btnPrimary: {
    backgroundColor: palette.accent,
    shadowColor: palette.accent,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 3,
  },
  btnPrimaryText: {
    color: palette.accentDarkText,
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  btnOutline: {
    backgroundColor: palette.paper,
    borderColor: palette.accent,
    borderWidth: 1,
  },
  btnOutlineText: {
    color: palette.accent,
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  btnSoft: {
    backgroundColor: "#dceeffff",
    borderColor: "#c1e8ffff",
    borderWidth: 1,
    shadowColor: palette.accent,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 2,
  },
  btnSoftText: {
    color: "#183b6bff",
    fontWeight: "800",
    fontSize: 15,
    textAlign: "center",
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
});
