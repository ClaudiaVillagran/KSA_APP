import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import LogoKsa from "../assets/svg/LogoKsa";
import { useNavigation } from "@react-navigation/native";
import ControllerTextInput from "../components/inputs/ControllerTextInput";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { auth, db } from "../config/firebase"; // Asegúrate de importar `db` para Firestore
import { Ionicons } from "@expo/vector-icons"; // Importar íconos
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../store/reducers/userSlice";
import { setDoc, doc } from "firebase/firestore"; // Importar para interactuar con Firestore

const schema = yup
  .object({
    username: yup
      .string()
      .required("El nombre es obligatorio")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    email: yup
      .string()
      .required("El correo electrónico es obligatorio")
      .email("Correo invalido"),
    password: yup
      .string()
      .required("La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
  })
  .required();

export default function SignUpScreen() {
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const saveUser = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Guardar detalles del usuario en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        displayName: data.username, // Nombre completo del usuario
        email: data.email, // Correo del usuario
      });

      // Otros datos que quieras almacenar

      Alert.alert("Usuario creado", "Tu cuenta ha sido creada exitosamente.");

      // Guardar en Redux solo los datos necesarios
      dispatch(
        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: data.username, // El nombre completo
        })
      );

      navigation.navigate("PrincipalTabs");
    } catch (error) {
      let errorMessage = "";
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo ya está en uso.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Correo inválido.";
      } else {
        errorMessage = "Ocurrió un error al realizar el registro.";
      }

      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
        <LogoKsa width={180} height={90} />
      </View>
      <ControllerTextInput
        control={control}
        name="username"
        placeholder="Nombre completo *"
        rules={{
          required: "Este campo es obligatorio",
        }}
      />
      <ControllerTextInput
        control={control}
        name="email"
        placeholder="Correo electrónico *"
        keyboardType="email-address"
        rules={{
          required: "Este campo es obligatorio",
        }}
      />
      <View style={styles.passwordContainer}>
        <ControllerTextInput
          control={control}
          name="password"
          placeholder="Contraseña *"
          secureTextEntry={!showPassword}
          rules={{
            required: "Este campo es obligatorio",
          }}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeIconContainer}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"} // Cambiar ícono
            size={24}
            color="#2563EB"
          />
        </Pressable>
      </View>
      <Text style={styles.motivationalText}>
        Tu hogar merece lo mejor. Estamos aquí para ayudarte a hacerlo realidad.
      </Text>
      <Pressable style={styles.registerButton} onPress={handleSubmit(saveUser)}>
        <Text style={styles.registerButtonText}>Registrarse</Text>
      </Pressable>

      <Pressable
        style={styles.loginRedirect}
        onPress={() => navigation.navigate("SignInScreen")}
      >
        <Text style={styles.loginRedirectText}>
          ¿Ya tienes cuenta? Inicia sesión
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#2563EB", // verde moderno
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginRedirect: {
    marginTop: 20,
  },
  loginRedirectText: {
    color: "#2563EB",
    fontSize: 15,
    textDecorationLine: "underline",
  },
  motivationalText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  eyeIconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
