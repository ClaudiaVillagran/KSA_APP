// CheckoutScreen.tsx (mínimo)
import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userSlice";

export default function CheckoutScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const auth = getAuth();
  const db = getFirestore();
  const dispatch = useDispatch();
  const {
    supplierForm,
    billing,
    selectedPlan = "business",
  } = route.params || {};

  const pay = async () => {
    // Aquí iría tu integración real de pago
    // Si el pago es OK:
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        Alert.alert("Ups", "Sesión expirada. Inicia sesión de nuevo.");
        navigation.replace("AuthFlow", {
          redirectTo: "Checkout",
          redirectParams: route.params,
        });
        return;
      }

      // Marca la cuenta como "business" o show the plan selected
      await setDoc(
        doc(db, "users", uid),
        {
          isBusiness: true,
          businessPlan: selectedPlan,
          businessSince: serverTimestamp(),
          billing: billing || null,
        },
        { merge: true }
      );

      // ... después de setDoc(isBusiness: true, businessPlan: selectedPlan, billing, etc.)
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        const data = snap.data() as any;
        dispatch(
          setUser({
            uid,
            email: auth.currentUser!.email,
            displayName: data.displayName || "Usuario",
            isBusiness: !!data.isBusiness,
            businessPlan: data.businessPlan ?? null,
            billing: data.billing ?? null,
          })
        );
      }

      Alert.alert(
        "¡Listo!",
        "Tu suscripción fue procesada. Tu cuenta ahora es Business."
      );
      navigation.replace("PrincipalTabs"); // o "BusinessHome" si la tienes  o navigation.navigate("Profile")
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        Confirmar compra
      </Text>
      <Text style={{ marginBottom: 12 }}>Plan: {selectedPlan}</Text>
      <TouchableOpacity
        onPress={pay}
        style={{ backgroundColor: "#28a745", padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>
          Pagar ahora
        </Text>
      </TouchableOpacity>
    </View>
  );
}
