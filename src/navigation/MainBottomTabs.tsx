import { StyleSheet, Text, View } from "react-native";
import React from "react";
import NavBar from "../components/NavBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import InicioComponent from "../components/pages/InicioComponent";
import BecomeSupplier from "../screens/becomeSupplier/BecomeSupplier";
import HowWork from "../screens/howWorks/HowWork";
import { useState } from "react";

import { useNavigation } from "@react-navigation/native";
const Tab = createBottomTabNavigator();
export default function MainBottomTabs() {
  const [text, setText] = useState("");

  const navigation = useNavigation();
  return (
    <>
      
      <Tab.Navigator>
        <Tab.Screen name="Home" component={InicioComponent} />
        <Tab.Screen name="HazteProveedor" component={BecomeSupplier} />
        <Tab.Screen name="ComoFunciona" component={HowWork} />
      </Tab.Navigator>
    </>
  );
}

const styles = StyleSheet.create({
 
});
