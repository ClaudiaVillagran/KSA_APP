import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

type Props = {
  onPlanSelect: (k: "monthly" | "semiannual" | "annual") => void;
};

export default function OurPlans({ onPlanSelect }: Props) {
  const images = {
    basico: require("../../assets/img/planBasico.webp"),
    pro: require("../../assets/img/planPro.webp"),
    premium: require("../../assets/img/planPremium.webp"),
  };

  const Feature = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.row}>
      <Icon name="check-circle" size={16} color="#007BFF" style={{ marginRight: 8 }} />
      <Text style={styles.feature}>{children}</Text>
    </View>
  );

  return (
    <View style={{ paddingHorizontal:16 }}>
      <Text style={styles.title}>Planes para proveedores</Text>

      {/* Básico */}
      <View style={styles.card}>
        <Image source={images.basico} style={styles.img} />
        <View style={styles.badgeLeft}><Text style={styles.badge}>Plan Básico</Text></View>
        <View style={styles.body}>
          <Text style={styles.name}>Básico</Text>
          <Text style={styles.desc}>Ideal para comenzar y probar la plataforma sin costo.</Text>
          <Feature>Publicación gratuita de tus servicios.</Feature>
          <Feature>Acceso a clientes reales.</Feature>
          <Feature>Soporte esencial y control de tus servicios.</Feature>
          <Feature>Solo 5% de comisión por venta.</Feature>

          <View style={styles.priceBox}>
            <Text style={styles.priceMain}>GRATIS</Text>
            <Text style={styles.note}>Solo pagas 5% de comisión por venta.</Text>
          </View>

          <Pressable style={styles.btn} onPress={() => onPlanSelect("monthly")}>
            <Text style={styles.btnText}>Comenzar ahora</Text>
          </Pressable>
        </View>
      </View>

      {/* Pro */}
      <View style={styles.card}>
        <Image source={images.pro} style={styles.img} />
        <View style={styles.badgeRight}><Text style={styles.badgeDiscount}>-27%</Text></View>
        <View style={styles.badgeLeft}><Text style={styles.badge}>Plan Pro</Text></View>
        <View style={styles.body}>
          <Text style={styles.name}>Pro</Text>
          <Text style={styles.desc}>Para empresas que buscan mayor visibilidad y escalabilidad.</Text>

          <Feature>Alcance y visibilidad elevados.</Feature>
          <Feature>Perfil destacado en tu categoría y comuna.</Feature>
          <Feature>Soporte prioritario.</Feature>
          <Feature>Generación de leads ilimitados.</Feature>
          <Feature>Publicidad dirigida y analítica avanzada.</Feature>
          <Feature>Acceso CRM.</Feature>

          <View style={styles.priceBox}>
            <Text style={styles.priceMain}>$720.000 CLP + IVA / semestre</Text>
            <Text style={styles.note}>Precio normal $990.000 CLP + IVA</Text>
            <Text style={styles.cupos}>Solo 500 cupos</Text>
          </View>

          <Pressable style={styles.btn} onPress={() => onPlanSelect("semiannual")}>
            <Text style={styles.btnText}>Comenzar ahora</Text>
          </Pressable>
        </View>
      </View>

      {/* Premium */}
      <View style={[styles.card,{borderColor:"#ff8a3d"}]}>
        <Image source={images.premium} style={styles.img} />
        <View style={styles.badgeRight}><Text style={styles.badgeDiscount}>-40%</Text></View>
        <View style={styles.badgeRow}>
          <Text style={styles.badge}>Plan Premium</Text>
          <Text style={styles.badgeGold}>Más solicitado</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>Premium</Text>
          <Text style={styles.desc}>El paquete más completo para maximizar tu crecimiento.</Text>

          <Feature>Todo lo incluido en el Plan Pro.</Feature>
          <Feature>Red de networking y comunidad KSA.</Feature>
          <Feature>Apoyo en marketing y vitrinas destacadas.</Feature>
          <Feature>Mentorías y capacitaciones en ventas, cotización y RRSS.</Feature>
          <Feature>Showcase en ferias o presentaciones regionales según KPI.</Feature>
          <Feature>0% de comisión por venta.</Feature>

          <View style={styles.priceBox}>
            <Text style={styles.priceMain}>$1.500.000 CLP + IVA / año</Text>
            <Text style={styles.note}>Precio normal $2.500.000 CLP + IVA / año</Text>
            <Text style={styles.cupos}>Solo 4500 cupos</Text>
            <Text style={styles.note}>o $150.000 CLP + IVA / mes</Text>
          </View>

          <Pressable style={[styles.btn,{backgroundColor:"#ff8a3d"}]} onPress={() => onPlanSelect("annual")}>
            <Text style={styles.btnText}>Comenzar ahora</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{ fontSize:20, fontWeight:"800", textAlign:"center", color:"#222", marginVertical:10 },
  card:{ backgroundColor:"#fff", borderRadius:16, overflow:"hidden", borderWidth:1, borderColor:"#e5e7eb", marginBottom:14, elevation:2 },
  img:{ width:"100%", height:200, resizeMode:"contain", backgroundColor:"#fff" },
  body:{ padding:16 },
  name:{ fontSize:20, fontWeight:"800", color:"#1f2a34", marginBottom:6 },
  desc:{ color:"#4b5563", marginBottom:6 },
  row:{ flexDirection:"row", alignItems:"center", marginBottom:6 },
  feature:{ fontSize:14, color:"#444" },
  priceBox:{ marginTop:10, backgroundColor:"#f9fafb", borderRadius:12, padding:12, alignItems:"center", gap:3 },
  priceMain:{ fontSize:16, fontWeight:"800", color:"#111827" },
  note:{ fontSize:12, color:"#6b7280", textAlign:"center" },
  cupos:{ fontSize:12, color:"#2563eb" },
  btn:{ backgroundColor:"#007BFF", paddingVertical:12, borderRadius:10, alignItems:"center", marginTop:12 },
  btnText:{ color:"#fff", fontWeight:"800", textTransform:"uppercase" },
  badgeLeft:{ position:"absolute", top:12, left:12, backgroundColor:"#eef2ff", paddingHorizontal:10, paddingVertical:4, borderRadius:999 },
  badge:{ color:"#374151", fontSize:12, fontWeight:"700" },
  badgeRight:{ position:"absolute", top:12, right:12 },
  badgeDiscount:{ backgroundColor:"#ffe2db", color:"#b42318", paddingHorizontal:10, paddingVertical:4, borderRadius:999, fontWeight:"800", fontSize:12 },
  badgeRow:{ position:"absolute", top:12, left:12, flexDirection:"row", gap:8 },
  badgeGold:{ backgroundColor:"#ffe9c7", color:"#7a4b00", paddingHorizontal:10, paddingVertical:4, borderRadius:999, fontSize:12, fontWeight:"800" },
});
