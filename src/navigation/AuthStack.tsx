// AuthStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../auth/SignInScreen";
import SignUpScreen from "../auth/SignUpScreen";
import AuthFlowScreen from "../auth/profileBusiness/AuthFlowScreen";
import BillingDetailsScreen from "../auth/profileBusiness/BillingDetailsScreen";
import CheckoutScreen from "../auth/profileBusiness/CheckoutScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />

      {/* Flow to new business user account */}
      <Stack.Screen name="AuthFlow" component={AuthFlowScreen} />
      <Stack.Screen name="BillingDetails" component={BillingDetailsScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}
