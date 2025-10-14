// src/navigation/BusinessStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import  BusinessDashboard from '../screens/business/BusinessDashboard';
import  CreateServiceScreen from '../screens/business/CreateServiceScreen';
import  MyServicesScreen  from '../screens/business/MyServicesScreen';
import { EditServiceScreen } from '../screens/business/EditServiceScreen';

const Stack = createStackNavigator();

export default function BusinessStack() {
  return (
    <Stack.Navigator >
      <Stack.Screen name="BusinessDashboard" component={BusinessDashboard} options={{ title: 'Panel Proveedor' }}/>
      <Stack.Screen name="CreateService" component={CreateServiceScreen} options={{ title: 'Nuevo servicio' }}/>
      <Stack.Screen name="MyServices" component={MyServicesScreen} options={{ title: 'Mis servicios' }}/>
      <Stack.Screen name="EditService" component={EditServiceScreen} options={{ title: 'Editar servicio' }}/>
    </Stack.Navigator>
  );
}
