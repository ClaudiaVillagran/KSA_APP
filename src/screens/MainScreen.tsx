import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";

import AuthStack from "../navigation/AuthStack";
import PrincipalTabs from "../navigation/PrincipalTabs";
import { createStackNavigator } from "@react-navigation/stack";
import ServicesStack from "../navigation/ServicesStack";
import CheckOutScreen from "./cart/checkOut/CheckOutScreen";
import ProfileScreen from "../auth/profile/ProfileScreen";
import { useDispatch } from "react-redux";
import { setAreas } from "../store/reducers/areaSlice";
import { fetchArea } from "../data/firestoreData/AreasFromFirestore";

const Stack = createStackNavigator();
export default function MainScreen() {
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
      const area = await fetchArea(areaId); // Obtener área por ID

      if (area) {
        allAreas.push(area); // Acumular todas las áreas en el array
      }
    }
    // console.log(allAreas[0].id);
    // Almacenar todas las áreas en Redux de una sola vez
    dispatch(setAreas(allAreas)); // Enviar todas las áreas juntas
  };

  useEffect(() => {
    const areaId = "ChKkfQnvlCDkSPOyoK6a"; // Sustituye con el ID del área que deseas cargar
    loadAreas(areaId);
  }, [dispatch]);

  return (
    <View style={styles.containerMain}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PrincipalTabs" component={PrincipalTabs} />
        <Stack.Screen name="AuthStack" component={AuthStack} />

        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
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
