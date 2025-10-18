import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";

import AuthStack from "../navigation/AuthStack";
import PrincipalTabs from "../navigation/PrincipalTabs";
import { createStackNavigator } from "@react-navigation/stack";
import ServicesStack from "../navigation/ServicesStack";
import CheckOutScreen from "./cart/checkOut/CheckOutScreen";
import ProfileScreen from "../auth/profile/ProfileScreen";
import { useDispatch, useSelector } from "react-redux";
import { setAreas } from "../store/reducers/areaSlice";
import { fetchArea } from "../data/firestoreData/AreasFromFirestore";
import WelcomeScreen from "./welcomeScreen/WelcomeScreen";
import { RootState } from "../store/store";
import BusinessStack from "../navigation/BusinessStack";
import CompanyProfileScreen from "./featured/CompanyProfileScreen";
import ServiceDetailScreen from "./services/ServiceDetailScreen";
import SearchResultsScreen from "../components/Sections/SearchResultsScreen";

const Stack = createStackNavigator();
export default function MainScreen() {
  const user = useSelector((s: RootState) => s.userSlice);
  const dispatch = useDispatch();
  const areaIds = [
    "C8Lm2wiMVMP2H0KxKhqi", // ID de área 1
    "ChKkfQnvlCDkSPOyoK6a", // ID de área 2
    "DYGpnQra6Lbj4QsdDnlG", // ID de área 3
    "EfUbAYF0Hcp1SplhR0ds", // ID de área 4
    "Ho291N27EAvqG97Pxb31",
  ];
  // Función para cargar las áreas
  const loadAreas = async (areaId) => {
    const allAreas = [];

    for (const areaId of areaIds) {
      const area = await fetchArea(areaId);

      if (area) {
        allAreas.push(area);
      }
    }
    dispatch(setAreas(allAreas));
  };

  useEffect(() => {
    const areaId = "ChKkfQnvlCDkSPOyoK6a";
    loadAreas(areaId);
  }, [dispatch]);

  return (
    <View style={styles.containerMain}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerBackTitle: "Atrás" }}
        initialRouteName="Welcome"
      >
        <Stack.Screen
          name="PrincipalTabs"
          component={PrincipalTabs}
          options={{ title: "Atras" }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ title: "Atras" }}
        />
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ title: "Atras" }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{ title: "Atras" }}
        />
        {/* Muestra BusinessStack solo a business */}
        {user?.isBusiness && (
          <Stack.Screen
            name="BusinessStack"
            component={BusinessStack}
            options={{ title: "Atras" }}
          />
        )}
        <Stack.Screen
          name="CompanyProfile"
          component={CompanyProfileScreen}
          options={{ title: "Perfil de la tienda" }}
        />
        <Stack.Screen
          options={{ title: "Atras" }}
          name="ServicesStack"
          component={ServicesStack}
        />
        <Stack.Screen
          options={{ headerShown: true, title: "Confirmar Pedido" }}
          name="CheckOutStack"
          component={CheckOutScreen}
        />
        <Stack.Screen
          name="CompanyProfileScreen"
          component={CompanyProfileScreen}
          options={{ title: "Proveedor" }}
        />
        <Stack.Screen
          name="ServiceDetailScreen"
          component={ServiceDetailScreen}
          options={{ title: "Detalle" }}
        />
        <Stack.Screen name="SearchResults" component={SearchResultsScreen} />

      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    paddingTop: 50,
  },
});
