// App.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor, AppDispatch } from "./src/store/store";

import { attachAuthProfileListener } from "./src/tools/loadUserProfile";

// Si usas un Root Navigator, reemplaza MainScreen por tu raíz de navegación
import MainScreen from "./src/screens/MainScreen";

function Bootstrapper() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const detach = attachAuthProfileListener(dispatch);
    return () => { detach && detach(); };
  }, [dispatch]);

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <MainScreen />
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Bootstrapper />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
