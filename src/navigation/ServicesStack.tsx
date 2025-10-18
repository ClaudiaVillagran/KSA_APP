// src/navigation/ServicesStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Construction from "../screens/areasToResolve/Construction";
import Installation from "../screens/areasToResolve/Installation";
import Maintenance from "../screens/areasToResolve/Maintenance";
import Service from "../screens/areasToResolve/GeneralService";
import Advice from "../screens/areasToResolve/Advice";
import CartScreen from "../screens/cart/CartScreen";
// import ConstructionServicesScreen from "../screens/servicesForCategorie/ConstructionServicesScreen";
// import AdviceServicesScreen from "../screens/servicesForCategorie/AdviceServicesScreen";
// import InstallationServicesScreen from "../screens/servicesForCategorie/InstallationServicesScreen";
// import MaintenanceServicesScreen from "../screens/servicesForCategorie/MaintenanceServicesScreen";
import ServiceFromServicesScreen from "../screens/servicesForCategorie/ServiceFromServicesScreen";
import CategorieScreen from "../screens/servicesForCategorie/categorieScreen";

const Stack = createStackNavigator();

export default function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConstructionScreen" component={Construction} />
      <Stack.Screen name="InstallationScreen" component={Installation} />
      <Stack.Screen name="MaintenanceScreen" component={Maintenance} />
      <Stack.Screen name="ServiceScreen" component={Service} />
      <Stack.Screen name="AdviceScreen" component={Advice} />
      
      <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen
        name="CategorieScreen"
        component={CategorieScreen}
      />

             <Stack.Screen
        name="ServiceFromServicesScreen"
        component={ServiceFromServicesScreen}
      />
    </Stack.Navigator>
  );
}
