import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ControllerTextInput from "../../components/inputs/ControllerTextInput";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";
import { Ionicons } from "@expo/vector-icons";
import LogoKsa from "../../assets/svg/LogoKsa";

// Validaciones
const loginSchema = yup.object({
  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Correo inválido"),
  password: yup.string().required("La contraseña es obligatoria"),
});

const registerSchema = yup.object({
  username: yup
    .string()
    .required("El nombre es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Correo inválido"),
  password: yup
    .string()
    .required("La contraseña es obligatoria")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export default function AuthFlowScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { redirectTo, redirectParams } = route.params || {};
  const auth = getAuth();
  const db = getFirestore();
  const dispatch = useDispatch();

  // UI state
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Forms
  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
  } = useForm({
    resolver: yupResolver(loginSchema),
    shouldUnregister: true, // desmonta limpio al cambiar de modo
  });

  const {
    control: registerControl,
    handleSubmit: handleRegisterSubmit,
  } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
    shouldUnregister: true, // desmonta limpio al cambiar de modo
  });

  // Navegación después de auth
  const goNext = () => {
    if (redirectTo) navigation.replace(redirectTo, redirectParams || {});
    else navigation.replace("PrincipalTabs");
  };

  // Cargar usuario a Redux
  const saveUserInRedux = async (
    uid: string,
    email: string | null | undefined
  ) => {
    const safeEmail = email || "";
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.exists() ? (snap.data() as any) : {};
      dispatch(
        setUser({
          uid,
          email: safeEmail,
          displayName: data.displayName || "Usuario",
          isBusiness: !!data.isBusiness,
          businessPlan: data.businessPlan ?? null,
          billing: data.billing ?? null,
        })
      );
    } catch {
      dispatch(
        setUser({
          uid,
          email: safeEmail,
          displayName: "Usuario",
          isBusiness: false,
          businessPlan: null,
          billing: null,
        })
      );
    }
  };

  // Handlers
  const onLogin = async (data: any) => {
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await saveUserInRedux(cred.user.uid, cred.user.email);
      goNext();
    } catch (e: any) {
      const map: Record<string, string> = {
        "auth/user-not-found": "Usuario no encontrado",
        "auth/invalid-credential": "Correo o contraseña incorrecta",
        "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
      };
      Alert.alert("Error", map[e.code] || "No se pudo iniciar sesión");
    }
  };

  const onRegister = async (data: any) => {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(cred.user, { displayName: data.username });

      await setDoc(
        doc(db, "users", cred.user.uid),
        {
          displayName: data.username,
          email: data.email,
          createdAt: Date.now(),
          isBusiness: false,
        },
        { merge: true }
      );

      await saveUserInRedux(cred.user.uid, cred.user.email);
      goNext();
    } catch (e: any) {
      const map: Record<string, string> = {
        "auth/email-already-in-use": "Este correo ya está en uso.",
        "auth/weak-password": "La contraseña es muy débil",
      };
      Alert.alert("Error", map[e.code] || "No se pudo registrar");
    }
  };

  // Render
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled" // evita que el teclado bloquee toques
    >
      {/* Logo + texto intro */}
      <View style={styles.logoWrap}>
        <LogoKsa width={180} height={90} />
      </View>
      <Text style={styles.motivationalText}>
        Para suscribirte a un plan KSA, inicia sesión o crea tu cuenta.
      </Text>

      {/* Formulario */}
      {mode === "login" ? (
        <View key="login" style={styles.form}>
          <ControllerTextInput
            control={loginControl}
            name="email"
            placeholder="Correo electrónico *"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.passwordContainer}>
            <ControllerTextInput
              control={loginControl}
              name="password"
              placeholder="Contraseña *"
              secureTextEntry={!showLoginPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowLoginPassword((p) => !p)}
              style={styles.eyeIconContainer}
            >
              <Ionicons
                name={showLoginPassword ? "eye-off" : "eye"}
                size={24}
                color="#2563EB"
              />
            </Pressable>
          </View>
        </View>
      ) : (
        <View key="register" style={styles.form}>
          <ControllerTextInput
            control={registerControl}
            name="username"
            placeholder="Nombre completo *"
            autoCapitalize="words"
            autoCorrect={false}
          />
          <ControllerTextInput
            control={registerControl}
            name="email"
            placeholder="Correo electrónico *"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.passwordContainer}>
            <ControllerTextInput
              control={registerControl}
              name="password"
              placeholder="Contraseña *"
              secureTextEntry={!showRegisterPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable
              onPress={() => setShowRegisterPassword((p) => !p)}
              style={styles.eyeIconContainer}
            >
              <Ionicons
                name={showRegisterPassword ? "eye-off" : "eye"}
                size={24}
                color="#2563EB"
              />
            </Pressable>
          </View>
        </View>
      )}

      {/* Botones abajo */}
      <View style={styles.buttonsWrap}>
        {mode === "login" ? (
          <>
            <Pressable
              style={styles.loginButton}
              onPress={handleLoginSubmit(onLogin)}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </Pressable>

            <Pressable
              style={styles.registerButton}
              onPress={() => setMode("register")}
            >
              <Text style={styles.registerButtonText}>Registrarse</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.loginButton}
              onPress={handleRegisterSubmit(onRegister)}
            >
              <Text style={styles.loginButtonText}>Registrarse</Text>
            </Pressable>

            <Pressable
              style={styles.registerButton}
              onPress={() => setMode("login")}
            >
              <Text style={styles.registerButtonText}>Iniciar sesión</Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 24,
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  motivationalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  form: {
    gap: 12,
    marginTop: 8,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    zIndex: 0, // evita estar por encima de otros inputs
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  buttonsWrap: {
    marginTop: "auto",
    gap: 10,
  },
  loginButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  registerButton: {
    marginTop: 10,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2563EB",
    backgroundColor: "transparent",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#2563EB",
    fontSize: 15,
  },
});
