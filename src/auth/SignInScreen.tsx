import { Pressable, StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import LogoKsa from "../assets/svg/LogoKsa";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ControllerTextInput from "../components/inputs/ControllerTextInput";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/userSlice";
import { getDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";

type FormValues = { email: string; password: string };

type BillingInfo = {
  razonSocial?: string | null;
  rut?: string | null;
  direccion?: string | null;
};

type FireUser = {
  displayName?: string | null;
  email?: string | null;
  isBusiness?: boolean;
  businessPlan?: string | null;
  billing?: BillingInfo | null;
  featured?: boolean;
  businessSince?: any; // Firestore Timestamp
};

const schema = yup
  .object({
    email: yup.string().required("El correo electrónico es obligatorio").email("Correo invalido"),
    password: yup.string().required("La contraseña es obligatoria"),
  })
  .required();

export default function SignInScreen() {
  const navigation = useNavigation<any>();
  const { control, handleSubmit } = useForm<FormValues>({ resolver: yupResolver(schema) });
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const getUserDetailsFromFirestore = async (uid: string): Promise<FireUser | null> => {
    try {
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        return snap.data() as FireUser;
      } else {
        // Si no existe el doc, lo creamos mínimo con datos base
        const authUser = auth.currentUser;
        const seed: FireUser = {
          displayName: authUser?.displayName ?? null,
          email: authUser?.email ?? null,
          isBusiness: false,
          businessPlan: null,
          billing: null,
          featured: false,
          businessSince: serverTimestamp(),
        };
        await setDoc(ref, seed, { merge: true });
        return seed;
      }
    } catch (error) {
      console.error("Error al obtener detalles del usuario:", error);
      return null;
    }
  };

  const saveLog = async (data: FormValues) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, data.email, data.password);
      const uid = cred.user.uid;

      const userDetails = await getUserDetailsFromFirestore(uid);

      // Mergeamos Auth + Firestore y guardamos en Redux
      dispatch(setUser({
        uid,
        email: cred.user.email ?? userDetails?.email ?? null,
        displayName: userDetails?.displayName ?? cred.user.displayName ?? "Usuario",
        isBusiness: userDetails?.isBusiness ?? false,
        businessPlan: userDetails?.businessPlan ?? null,
        billing: userDetails?.billing ?? null,
        featured: userDetails?.featured ?? false,
        businessSince: userDetails?.businessSince ?? null,
      }));

      navigation.navigate("PrincipalTabs");
    } catch (error: any) {
      let errorMessage = "Ocurrió un error al iniciar sesión";
      if (error?.code === "auth/user-not-found") errorMessage = "Usuario no encontrado";
      else if (error?.code === "auth/invalid-credential") errorMessage = "Correo o contraseña incorrecta";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <LogoKsa width={180} height={90} />
      </View>
      <Text style={styles.motivationalText}>
        Inicia sesión y accede a más de 300 servicios para tu hogar, en un solo lugar.
      </Text>

      <ControllerTextInput
        control={control}
        name="email"
        placeholder="Correo electrónico *"
        keyboardType="email-address"
        rules={{ required: "Este campo es obligatorio" }}
      />

      <View style={styles.passwordContainer}>
        <ControllerTextInput
          control={control}
          name="password"
          placeholder="Contraseña *"
          secureTextEntry={!showPassword}
          rules={{ required: "Este campo es obligatorio" }}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#2563EB" />
        </Pressable>
      </View>

      <Pressable style={styles.loginButton} onPress={handleSubmit(saveLog)}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </Pressable>

      <Pressable style={styles.registerButton} onPress={() => navigation.navigate("SignUpScreen")}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </Pressable>

      <Pressable style={styles.skipButton} onPress={() => navigation.navigate("PrincipalTabs")}>
        <Text style={styles.skipButtonText}>Continuar sin iniciar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", paddingHorizontal: 30 },
  loginButton: { backgroundColor: "#2563EB", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, width: "100%", alignItems: "center", marginTop: 10 },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  registerButton: { marginTop: 20, width: "100%", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 10, borderWidth: 1, borderColor: "#2563EB", backgroundColor: "transparent", alignItems: "center" },
  registerButtonText: { color: "#2563EB", fontSize: 15 },
  skipButton: { marginTop: 15 },
  skipButtonText: { color: "#2563EB", fontSize: 15, textDecorationLine: "underline", textAlign: "center" },
  motivationalText: { fontSize: 14, color: "#555", textAlign: "center", marginVertical: 10, paddingHorizontal: 10, marginBottom: 50 },
  passwordContainer: { flexDirection: "row", alignItems: "center", width: "100%" },
  eyeIconContainer: { position: "absolute", right: 10, top: 10 },
});
