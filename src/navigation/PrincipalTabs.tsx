// PrincipalTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InicioComponent from "../components/pages/InicioComponent";
import BecomeSupplier from "../screens/becomeSupplier/BecomeSupplier";
import HowWork from "../screens/howWorks/HowWork";
import NavBar from "../components/NavBar";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const Tab = createBottomTabNavigator();

export default function PrincipalTabs() {
  return (
    <>
      <NavBar />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0074D9",
          tabBarInactiveTintColor: "#555",
          tabBarLabelStyle: {
            marginTop: 4,
            fontSize: 13,
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={InicioComponent}
          options={{
            tabBarIcon: ({ color }) => (
              <Entypo name="home" size={24} color={color} />
            ),
            title: "Inicio",
          }}
        />
        <Tab.Screen
          name="ComoFunciona"
          component={HowWork}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="question" size={24} color={color} />
            ),
            title: "Como funciona",
          }}
        />
        <Tab.Screen
          name="HazteProveedor"
          component={BecomeSupplier}
          options={{
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="handshake-simple" size={24} color={color} />
            ),
            title: "Hazte proveedor",
          }}
        />


        
      </Tab.Navigator>
    </>
  );
}
