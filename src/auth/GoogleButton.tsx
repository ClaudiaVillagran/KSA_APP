// src/auth/GoogleButton.tsx
import React, { useEffect } from "react";
import { Platform, Pressable, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import { auth, googleProvider } from "../config/firebase";
import {
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";

// IMPORTANTE para cerrar el tab del navegador en iOS
WebBrowser.maybeCompleteAuthSession();

export default function GoogleButton() {
  // Usa tus client IDs de Google (OAuth 2.0) creados en Google Cloud / Firebase
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Para desarrollo con Expo Go:
    expoClientId: "<TU_WEB_CLIENT_ID>.apps.googleusercontent.com",

    // Para builds:
    iosClientId: "<TU_IOS_CLIENT_ID>.apps.googleusercontent.com",
    androidClientId: "<TU_ANDROID_CLIENT_ID>.apps.googleusercontent.com",

    // Desarrollo: usa proxy (no necesitas scheme)
    redirectUri: makeRedirectUri({ useProxy: true }),

    // Producción: usa tu scheme y NO proxy
    // redirectUri: makeRedirectUri({ scheme: "ksapp" }),
  });

  useEffect(() => {
    const run = async () => {
      if (response?.type === "success") {
        const idToken = response.authentication?.idToken;
        if (!idToken) return;

        // Intercambia el idToken por credencial de Firebase
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
        // Aquí ya estás logueada en Firebase con Google ✅
      }
    };
    run();
  }, [response]);

  const handlePress = async () => {
    if (Platform.OS === "web") {
      // WEB → popup nativo de Firebase
      await signInWithPopup(auth, googleProvider);
    } else {
      // MOBILE → abre flujo OAuth con AuthSession
      await promptAsync({ useProxy: true }); // en producción usa { useProxy: false }
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ padding: 12, backgroundColor: "#4285F4", borderRadius: 8 }}
      disabled={!request}
    >
      <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>
        Continuar con Google
      </Text>
    </Pressable>
  );
}
