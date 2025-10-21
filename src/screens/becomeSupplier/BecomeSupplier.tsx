import React, { useRef, useState, useMemo } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  useWindowDimensions,
  findNodeHandle,
} from "react-native";
import SupplierForm from "./SupplierForm"; // ← ajusta la ruta si es necesario

/* ========= Paleta CELESTE coherente con marca ========= */
const COLORS = {
  // Base
  ksaBg:    "#0F3550", // azul celeste profundo (HERO)
  ksaCream: "#F2F8FD", // crema fría azulado para secciones claras
  ksaAccent:"#3BA7E1", // CELESTE corporativo (CTA / énfasis)
  ksaText:  "#102331", // texto principal
  ksaMuted: "#5E7283", // texto secundario

  // Superficies
  ksaCard:  "#FFFFFF",
  ksaBorder:"#E2EDF6",

  // Utilidades
  heroMuted:"#D6E7F4", // texto suave sobre hero
  accentSoft:"#EAF6FF",// fondo CTA suave
  accentLine:"#CDEAFF",// borde CTA suave
  gray200:  "#F1F6FA", // franja ploma azulada
  gray300:  "#DCE8F2", // línea superior franja
  strike:   "#7F93A3", // precio tachado
};

const EXTERNAL = {
  whatsapp: "https://wa.me/56944748591",
  ig1: "https://www.instagram.com/reel/DOq1YOnEelQ/",
  ig2: "https://www.instagram.com/reel/DOWbVdMDb-t/",
};

// ---------- UI helpers ----------
const CTAButton = ({
  title,
  onPress,
  primary,
  full,
}: {
  title: string;
  onPress: () => void;
  primary?: boolean;
  full?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.btn, primary && styles.btnPrimary, full && { alignSelf: "stretch" }]}
  >
    <Text style={[styles.btnText, primary && styles.btnTextPrimary]}>{title}</Text>
  </Pressable>
);

const Bullet = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <View style={styles.bulletRow}>
    <View style={styles.bulletIcon}><Text style={styles.bulletIconText}>✔</Text></View>
    <Text style={[styles.bulletText, dark && { color: COLORS.ksaText }]}>{children}</Text>
  </View>
);

const FeatureCard = ({ title, desc, icon = "★" }: { title: string; desc: string; icon?: string }) => (
  <View style={styles.feature}>
    <View style={[styles.miniIcon, styles.miniIconOrange]}><Text style={styles.miniIconText}>{icon}</Text></View>
    <View style={{ flex: 1 }}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </View>
  </View>
);

const StepCard = ({ index, title, desc }: { index: number; title: string; desc: string }) => (
  <View style={styles.step}>
    <Text style={styles.stepStrong}>{index}. {title}</Text>
    <Text style={styles.stepRest}>{desc}</Text>
  </View>
);

const Tag = ({ children, yellow }: { children: React.ReactNode; yellow?: boolean }) => (
  <View style={[styles.tag, yellow && styles.tagYellow]}>
    <Text style={[styles.tagText, yellow && styles.tagYellowText]}>{children}</Text>
  </View>
);

const DealBadge = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.dealBadge}><Text style={styles.dealBadgeText}>{children}</Text></View>
);

const PriceBlock = ({ now, normal, fine }: { now: string; normal?: string; fine?: string[] }) => (
  <View style={{ marginTop: 4 }}>
    <Text style={styles.priceNow}>{now}</Text>
    {!!normal && (
      <View style={styles.normalPriceBox}>
        <Text style={styles.normalPriceText}>
          Precio normal <Text style={styles.strike}>{normal}</Text>
        </Text>
      </View>
    )}
    {!!fine?.length && (
      <View style={{ marginTop: 4 }}>
        {fine.map((f, i) => (<Text key={i} style={styles.fineText}>{f}</Text>))}
      </View>
    )}
  </View>
);

const PlanCard = ({
  title, badge, points, now, normal, cta, featured, deal, fine, onSelect,
}: {
  title: string;
  badge: string;
  points: string[];
  now: string;
  normal?: string;
  cta: string;
  featured?: boolean;
  deal?: string;
  fine?: string[];
  onSelect: () => void;
}) => (
  <View style={[styles.plan, featured && styles.planFeatured]}>
    {!!deal && <DealBadge>{deal}</DealBadge>}
    <View style={styles.planBadge}><Text style={styles.planBadgeText}>{badge}</Text></View>
    <Text style={styles.planTitle}>{title}</Text>
    {featured && (<View style={{ marginTop: 4 }}><Tag yellow>Más solicitado</Tag></View>)}
    <Text style={styles.planMuted}>
      {title === "Básico"
        ? "Ideal para comenzar y probar la plataforma sin costo."
        : title === "Pro"
        ? "Para empresas que buscan mayor visibilidad y escalabilidad."
        : "El paquete más completo para maximizar tu crecimiento."}
    </Text>
    <View style={{ marginTop: 8 }}>
      {points.map((p, i) => (
        <View key={i} style={styles.pointRow}>
          <View style={styles.bulletIcon}><Text style={styles.bulletIconText}>✔</Text></View>
          <Text style={styles.pointText}>{p}</Text>
        </View>
      ))}
    </View>
    <PriceBlock now={now} normal={normal} fine={fine} />
    <CTAButton title={cta} primary={featured} onPress={onSelect} />
  </View>
);

const InstagramTile = ({ url, title }: { url: string; title: string }) => (
  <Pressable onPress={() => Linking.openURL(url)} style={styles.igTile}>
    <View style={styles.igThumb} />
    <Text style={styles.igLink}>Ver esta publicación en Instagram</Text>
    <Text numberOfLines={1} style={styles.igCaption}>{title}</Text>
  </Pressable>
);

// ---------- Main ----------
export default function BecomeSupplier() {
  const scrollRef = useRef<ScrollView | null>(null);
  const formAnchorRef = useRef<View | null>(null);
  const [plansY, setPlansY] = useState(0); // ancla real de Planes
  const [formY, setFormY] = useState<number | null>(null);

  // Estado del plan seleccionado para enviar al formulario
  // Tipos esperados por SupplierForm: "monthly" | "semiannual" | "annual" | "flexible"
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "semiannual" | "annual" | "flexible">("flexible");

  const { width } = useWindowDimensions();

  const goTo = (y: number) => {
    const target = Math.max(y - 8, 0);
    scrollRef.current?.scrollTo({ y: target, animated: true });
  };

  const goToPlans = () => goTo(plansY);
  const goToForm = () => {
    if (formY != null) {
      goTo(formY);
    } else if (formAnchorRef.current && scrollRef.current) {
      // fallback: medir en caliente si aún no se guardó el onLayout
      const node = findNodeHandle(formAnchorRef.current);
      if (node) {
        // En RN puro usar measureLayout requeriría refs nativos; este fallback es por si acaso.
        // Igual mantenemos el onLayout más abajo que setea formY.
        goTo(plansY); // fallback suave
      }
    }
  };

  // Mapeo de cards → claves del formulario
  // Básico = 5% comisión → "flexible"
  // Pro = precio semestral → "semiannual"
  // Premium = precio anual (también menciona mensual, pero lo principal es anual) → "annual"
  const selectPlanAndScroll = (plan: "basic" | "pro" | "premium") => {
    if (plan === "basic") setSelectedPlan("flexible");
    if (plan === "pro") setSelectedPlan("semiannual");
    if (plan === "premium") setSelectedPlan("annual");
    // Ir directo al formulario
    // Le damos un pequeño delay para asegurar que el estado se pinte antes del scroll (opcional).
    requestAnimationFrame(() => goToForm());
  };

  const isWide = width >= 900;
  const isMedium = width >= 640;

  const planData = useMemo(() => [
    {
      key: "basic" as const,
      title: "Básico",
      badge: "Plan Básico",
      points: [
        "Publicación gratuita de tus servicios",
        "Acceso a clientes reales",
        "Soporte esencial y control de tus servicios",
        "Solo 5% de comisión por venta",
      ],
      now: "GRATIS",
      normal: undefined,
      cta: "Comenzar ahora",
      featured: false,
      deal: undefined,
      fine: ["Solo pagas 5% de comisión por venta"],
    },
    {
      key: "pro" as const,
      title: "Pro",
      badge: "Plan Pro",
      points: [
        "Alcance y visibilidad elevados",
        "Perfil destacado en tu categoría y comuna",
        "Soporte prioritario",
        "Generación de leads ilimitados",
        "Publicidad dirigida y analítica avanzada",
        "Acceso CMR",
      ],
      now: "$720.000 + IVA / semestre",
      normal: "$990.000 + IVA",
      cta: "Comenzar ahora",
      featured: false,
      deal: "-27%",
      fine: ["Solo 500 cupos"],
    },
    {
      key: "premium" as const,
      title: "Premium",
      badge: "Plan Premium",
      points: [
        "Todo lo incluido en el Plan Pro",
        "Red de networking y comunidad KSA",
        "Apoyo en marketing y vitrinas destacadas",
        "Mentorías y capacitaciones en ventas, cotización y RRSS",
        "Showcase según KPI (ferias/presentaciones)",
        "0% de comisión por venta",
      ],
      now: "$1.500.000 + IVA / año",
      normal: "$2.500.000 + IVA / año",
      cta: "Comenzar ahora",
      featured: true,
      deal: "-40%",
      fine: ["Solo 4500 cupos", "o $150.000 + IVA / mes"],
    },
  ], []);

  const cardBasis = isWide ? "32%" : isMedium ? "48%" : "100%";

  // Etiqueta legible del plan en base a la clave del formulario
  const readablePlanLabel =
    selectedPlan === "flexible"  ? "Plan Básico (5% comisión)" :
    selectedPlan === "semiannual"? "Plan Pro (Semestral)" :
    selectedPlan === "annual"    ? "Plan Premium (Anual)" :
                                   "Plan Mensual";

  return (
    <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 40, backgroundColor: "#fff" }}>
      {/* Alerta superior */}
      <View style={styles.alertWrap}>
        <View style={styles.alertDot} />
        <Text style={styles.alertText}>
          Advertencia. Mientras lees esto, otros proveedores ya recibieron solicitudes reales desde KSA.cl.
        </Text>
      </View>

      {/* HERO */}
      <View style={[styles.section, { backgroundColor: COLORS.ksaBg }]}>
        <View style={styles.sectionInner}>
          <Text style={styles.h1}>Haz crecer tu empresa de servicios y construcciones</Text>
          <Text style={styles.heroP}>
            Si tienes una empresa de construcción, mantención, instalaciones y asesorías, KSA te conecta con miles de clientes reales en Chile.
            Descubre cómo aumentar tu visibilidad, ahorrar en marketing y recibir solicitudes de trabajo todos los días.
          </Text>

          <View style={{ marginTop: 6 }}>
            <Bullet>+300 servicios organizados en 5 categorías.</Bullet>
            <Bullet>Hasta 80% de ahorro frente al marketing digital tradicional.</Bullet>
            <Bullet>Cupos limitados por comuna para asegurar tu exposición y exclusividad.</Bullet>
          </View>

          <View style={{ marginTop: 12 }}>
            <CTAButton title="Súmate ahora" primary onPress={goToPlans} />
          </View>
        </View>
      </View>

      {/* Por qué unirte */}
      <View style={styles.section}>
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>¿Por qué unirte a KSA?</Text>
          <Text style={styles.muted}>
            KSA es mucho más que una plataforma de búsqueda; es tu aliado para impulsar tu negocio y optimizar tus recursos:
          </Text>

          <View style={styles.wrapRow}>
            <View style={[styles.wrapItem, { flexBasis: cardBasis }]}>
              <FeatureCard title="Visibilidad y alcance" desc="Posiciona tu empresa en listados destacados y llega a clientes de tu comuna, región o de todo Chile." />
            </View>
            <View style={[styles.wrapItem, { flexBasis: cardBasis }]}>
              <FeatureCard title="Leads verificados" desc="Recibe solicitudes de clientes realmente interesados en tus servicios; cero llamadas al vacío." icon="✓" />
            </View>
            <View style={[styles.wrapItem, { flexBasis: cardBasis }]}>
              <FeatureCard title="Soporte y analítica" desc="Accede gratis a nuestro CRM para controlar reportes, ventas y asesoría personalizada." icon="⚙" />
            </View>
            <View style={[styles.wrapItem, { flexBasis: cardBasis }]}>
              <FeatureCard title="Networking y comunidad" desc="Genera alianzas B2B con empresas que ya son parte de KSA." icon="🤝" />
            </View>
            <View style={[styles.wrapItem, { flexBasis: cardBasis }]}>
              <FeatureCard title="Ahorro en marketing" desc="Reduce hasta un 80% tus gastos en RRSS, web y SEO." icon="💸" />
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <CTAButton title="Quiero unirme" primary onPress={goToPlans} />
          </View>
        </View>
      </View>

      {/* Cómo funciona */}
      <View style={[styles.section, { backgroundColor: COLORS.ksaCream }]}>
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>¿Cómo funciona KSA?</Text>
          <Text style={styles.muted}>Unirse a nuestra plataforma es sencillo. Sigue estos pasos y comienza a recibir trabajos:</Text>

          <View style={styles.wrapRow}>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <StepCard index={1} title="Regístrate gratis" desc="Completa tu perfil y verifica tu empresa." />
            </View>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <StepCard index={2} title="Elige tus servicios" desc="Selecciona categorías y zonas donde quieres operar." />
            </View>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <StepCard index={3} title="Publica y recibe solicitudes" desc="Confirma o rechaza desde tu panel." />
            </View>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <StepCard index={4} title="Gestiona y crece" desc="Usa nuestro CRM, comunidad y mentorías para escalar." />
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <CTAButton title="Comenzar ahora" primary onPress={goToPlans} />
          </View>
        </View>
      </View>

      {/* PLANES (ancla exacta) */}
      <View style={styles.section} onLayout={(e) => setPlansY(e.nativeEvent.layout.y)}>
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>Planes para proveedores</Text>
          <View style={styles.wrapRow}>
            {planData.map((p) => (
              <View key={p.key} style={[styles.wrapItem, { flexBasis: cardBasis }]}>
                <PlanCard
                  title={p.title}
                  badge={p.badge}
                  points={p.points}
                  now={p.now}
                  normal={p.normal}
                  cta={p.cta}
                  featured={p.featured}
                  deal={p.deal}
                  fine={p.fine}
                  onSelect={() => selectPlanAndScroll(p.key)}
                />
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Ahorro */}
      <View style={[styles.section, { backgroundColor: COLORS.ksaCream }]}>
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>Ahorro que marca la diferencia</Text>
          <View style={styles.slab}>
            <Bullet dark>
              Lo que pocos saben (y muchos ya están pagando de más): el marketing digital tradicional —manejo de RRSS,
              página web, SEO y publicidad básica— puede superar fácilmente los $380.000 CLP/mes ($4.560.000 CLP/año).
            </Bullet>
            <Text style={[styles.text, { marginTop: 8 }]}>
              ✨ Con KSA Plan Premium ahorras más del 67% de ese valor y, además, recibes Marketing, Networking, Comunidad, Soporte
              Profesional… y lo más importante: ¡Potenciales Clientes todos los días!
            </Text>
            <Text style={[styles.text, { marginTop: 8 }]}>
              👉 No te quedes fuera: los cupos por comuna son limitados.
            </Text>
            <View style={{ marginTop: 12 }}>
              <CTAButton
                title="Solicitar más información"
                primary
                onPress={() => {
                  setSelectedPlan("annual"); // premium por defecto
                  goToForm();
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* FORMULARIO (ancla exacta) */}
      <View
        ref={formAnchorRef}
        onLayout={(e) => setFormY(e.nativeEvent.layout.y)}
        style={styles.section}
      >
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>Completa tu suscripción</Text>
          <View style={{ marginBottom: 8 }}>
            <Tag yellow>Plan seleccionado: {readablePlanLabel}</Tag>
          </View>

          <SupplierForm selectedPlan={selectedPlan} />
        </View>
      </View>

      {/* Historias IG */}
      <View style={styles.section}>
        <View style={styles.sectionInner}>
          <Text style={styles.h2}>Historias de éxito</Text>
          <View style={styles.wrapRow}>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <InstagramTile url={EXTERNAL.ig1} title="Una publicación compartida por KSA (@ksa_servicios)" />
            </View>
            <View style={[styles.wrapItem, { flexBasis: isMedium ? "48%" : "100%" }]}>
              <InstagramTile url={EXTERNAL.ig2} title="Una publicación compartida por KSA (@ksa_servicios)" />
            </View>
          </View>
        </View>
      </View>

      {/* CTA Final */}
      <View style={styles.section}>
        <View style={styles.sectionInner}>
          <View style={styles.endCta}>
            <Text style={styles.endCtaTitle}>¿Qué necesitas?</Text>
            <View style={styles.ctaRow}>
              <CTAButton
                title="Suscribirme"
                primary
                onPress={() => {
                  setSelectedPlan("annual"); // Premium por defecto al suscribirse
                  goToForm();
                }}
              />
              <CTAButton title="Agendar reunión" onPress={() => Linking.openURL(EXTERNAL.whatsapp)} />
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ---------- styles ----------
const styles = StyleSheet.create({
  section: { paddingVertical: 36, paddingHorizontal: 16 },
  sectionInner: { maxWidth: 1200, width: "100%", alignSelf: "center" },

  // Alert
  alertWrap: {
    margin: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#d40000",
    borderWidth: 1,
    borderColor: "#a80000",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#d40000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  alertDot: { width: 12, height: 12, borderRadius: 999, backgroundColor: "#fff", marginRight: 10 },
  alertText: { color: "#fff", fontWeight: "900", flex: 1 },

  // Headings
  h1: { color: "#fff", fontSize: 30, fontWeight: "800", letterSpacing: -0.3, lineHeight: 34 },
  heroP: { color: COLORS.heroMuted, fontSize: 14, marginTop: 8 },
  h2: { color: "#0b2330", fontSize: 22, fontWeight: "800", letterSpacing: -0.2, marginBottom: 4 },

  text: { color: COLORS.ksaText, fontSize: 14 },
  muted: { color: COLORS.ksaMuted },

  // Bullets
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 8 },
  bulletIcon: {
    width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center",
    backgroundColor: "#e9f7ef", marginRight: 10,
  },
  bulletIconText: { fontWeight: "900", color: "#0a7f45" },
  bulletText: { color: "#eaf2f9", flex: 1 },

  // Grid-like wrap
  wrapRow: { flexDirection: "row", flexWrap: "wrap", marginHorizontal: -8, marginTop: 12 },
  wrapItem: { paddingHorizontal: 8, paddingVertical: 8 },

  // Feature
  feature: {
    backgroundColor: COLORS.ksaCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.ksaBorder,
    shadowColor: COLORS.ksaBg,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  miniIcon: { width: 20, height: 20, borderRadius: 6, alignItems: "center", justifyContent: "center", marginRight: 12 },
  miniIconOrange: { backgroundColor: "#E8F4FE" },
  miniIconText: { fontWeight: "900", color: "#1978B5", fontSize: 12 },
  featureTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4, color: COLORS.ksaText },
  featureDesc: { color: COLORS.ksaMuted, fontSize: 14 },

  // Steps
  step: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.ksaBorder,
    shadowColor: COLORS.ksaBg,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  stepStrong: { fontWeight: "800", marginBottom: 6, color: COLORS.ksaText },
  stepRest: { color: COLORS.ksaText },

  // Plans
  plan: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#f0f2f4",
    shadowColor: COLORS.ksaBg,
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 2,
  },
  planFeatured: {
    borderWidth: 2,
    borderColor: COLORS.ksaAccent,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 4,
    transform: [{ scale: 1.01 }],
  },
  planBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: "#DFF1FF", marginBottom: 6 },
  planBadgeText: { fontSize: 12, fontWeight: "800", color: "#1C4E6D" },
  planTitle: { fontSize: 20, fontWeight: "800", color: COLORS.ksaText },
  planMuted: { color: COLORS.ksaMuted, marginTop: 2 },
  pointRow: { flexDirection: "row", alignItems: "flex-start", marginTop: 6 },
  pointText: { color: COLORS.ksaText, fontSize: 14, flex: 1 },

  dealBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.ksaAccent,
    shadowColor: COLORS.ksaAccent,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 3,
  },
  dealBadgeText: { fontWeight: "900", fontSize: 12, color: "#0D2230" },

  priceNow: { fontWeight: "900", fontSize: 18, color: COLORS.ksaText },
  normalPriceBox: {
    marginTop: 8, paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: COLORS.gray200,
    borderTopWidth: 1, borderColor: COLORS.gray300, borderRadius: 8,
  },
  normalPriceText: { color: "#5E7283", fontWeight: "600", fontSize: 13 },
  strike: { textDecorationLine: "line-through", color: COLORS.strike },
  fineText: { fontSize: 12, color: COLORS.ksaMuted },

  // Buttons
  btn: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 1,
    borderColor: COLORS.accentLine,
    shadowColor: COLORS.ksaAccent,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 2,
  },
  btnText: { fontWeight: "800", color: "#0B4C7A", letterSpacing: 0.2 },
  btnPrimary: {
    backgroundColor: COLORS.ksaAccent,
    borderColor: "#9FD6F4",
  },
  btnTextPrimary: { color: "#0D2230", fontWeight: "900" },

  // Slab
  slab: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.ksaBorder,
    borderRadius: 16,
    padding: 18,
    shadowColor: COLORS.ksaBg,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },

  // IG
  igTile: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.ksaBorder,
    backgroundColor: "#fff",
    padding: 12,
  },
  igThumb: { width: "100%", aspectRatio: 9 / 16, borderRadius: 10, backgroundColor: "#F0F4F8", marginBottom: 8 },
  igLink: { color: "#1978B5", fontWeight: "700" },
  igCaption: { color: "#8CA3B6" },

  // End CTA
  endCta: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.ksaBorder,
    borderRadius: 16,
    padding: 18,
    shadowColor: COLORS.ksaBg,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  endCtaTitle: { fontWeight: "800", fontSize: 18, marginBottom: 10, color: COLORS.ksaText },
  ctaRow: { flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" },

  // Tag
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#E9F5FF",
    borderWidth: 1,
    borderColor: "#CFE8FF",
  },
  tagText: { fontSize: 12, fontWeight: "800", color: "#0B4C7A" },
  tagYellow: { backgroundColor: "#FFF7D6", borderColor: "#FFE7A3" },
  tagYellowText: { color: "#7A5400" },
});
