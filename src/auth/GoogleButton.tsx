// src/screens/TestGoogle.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Button, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../config/firebase";

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID =
  "649382354226-nmisuqua1frkcdbim4ucav8aohgm8bpr.apps.googleusercontent.com";
const REDIRECT_URI = "https://auth.expo.io/@mystickali/KSAPP";

export default function TestGoogle() {
  const [msg, setMsg] = useState("Listo para probar");
  const nonceRef = useRef(Math.random().toString(36).slice(2));

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => { WebBrowser.coolDownAsync(); };
  }, []);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      clientId: WEB_CLIENT_ID,
      expoClientId: WEB_CLIENT_ID,
      responseType: "id_token",
      scopes: ["openid", "profile", "email"],
      redirectUri: REDIRECT_URI,
      extraParams: { nonce: nonceRef.current },
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenEndpoint: "https://oauth2.googleapis.com/token",
    }
  );

  useEffect(() => {
    if (!response) return;
    setMsg(`AuthSession response.type = ${response.type}`);
    if (response.type !== "success") return;

    const idToken =
      (response as any)?.authentication?.idToken ||
      (response as any)?.params?.id_token;

    if (!idToken) {
      setMsg("No llegó id_token");
      return;
    }

    signInWithCredential(auth, GoogleAuthProvider.credential(idToken))
      .then(() => setMsg("✅ Sesión iniciada (o usuario creado)"))
      .catch((e) => setMsg(`Error al autenticar: ${String(e)}`));
  }, [response]);

  const onPress = async () => {
    setMsg("Abriendo Google…");
    const res = await promptAsync({
      useProxy: true,
      windowName: "google",
      preferEphemeralSession: true,
    });
    setMsg(`promptAsync.type = ${res.type}${res.error ? " | error="+res.error : ""}`);
  };

  return (
    <View style={{ flex: 1, alignItems:"center", justifyContent:"center", gap: 16 }}>
      <Button title="Probar Google" onPress={onPress} disabled={!request} />
      <Text>{msg}</Text>
    </View>
  );
}
