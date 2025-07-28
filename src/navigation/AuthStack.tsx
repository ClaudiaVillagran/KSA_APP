// AuthStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "../auth/SignInScreen";
import SignUpScreen from "../auth/SignUpScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignInScreen" component={SignInScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
