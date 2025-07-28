import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { vs } from "react-native-size-matters";
import HeroSection from "../Sections/HeroSection";
import AreaToResolve from "../Sections/AreaToResolve";
import { createStackNavigator } from "@react-navigation/stack";
import { ScrollView } from "react-native-gesture-handler";
import OurProducts from "../../screens/ourProducts/OurProducts";
import { getProductsData } from "../../config/dataServices";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { setProducts } from "../../store/reducers/productSlice";
export default function InicioComponent() {
  const { products } = useSelector((state: RootState) => state.productSlice);
  const user = useSelector((state: RootState) => state.userSlice); // Obtenemos el objeto user desde el store
  
  if (!user) {
    console.log("no hay usuario logeado");
  }

  const dispatch = useDispatch();
  const fetchData = async () => {
    const data = await getProductsData();
    dispatch(setProducts(data));
    // console.log("state products", products);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <ScrollView style={styles.containerInicio}>
      <HeroSection />
      <OurProducts />
      <AreaToResolve />
      <View
        style={{ justifyContent: "center", alignItems: "center", padding: 20 }}
      >
        <Text style={styles.title}>
          KSA, tu solución rápida y fácil para servicios en el hogar
        </Text>
        <Text style={styles.description}>
          En solo un clic, encuentra la solución perfecta para los servicios en
          tu hogar en minutos: explora, elige y contrata a los mejores
          profesionales, técnicos certificados y empresas cerca de ti. Con KSA,
          simplificamos los servicios en tu hogar para que tú solo te preocupes
          de disfrutarlo. Nosotros te lo ponemos al alcance de la mano.
        </Text>
        <Image
          style={styles.image}
          source={require("../../assets/img/instalacion.webp")}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerInicio: {
    minHeight: 700,
  },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
});
