// src/config/firebase.ts
import { Platform } from "react-native";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseConstants } from "../constants/FirebaseConstants";

// Config
const firebaseConfig = {
  apiKey: FirebaseConstants.API_KEY,
  authDomain: FirebaseConstants.AUTH_DOMAIN,
  projectId: FirebaseConstants.PROJECT_ID,
  storageBucket: FirebaseConstants.STORAGE_BUCKET,
  messagingSenderId: FirebaseConstants.MESSAGING_SENDER_ID,
  appId: FirebaseConstants.APP_ID,
};

// Asegura singleton del app
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia correcta por plataforma
let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
  // En web, usa localStorage
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} else {
  // En iOS/Android (Expo), usa AsyncStorage
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Si ya fue inicializado en otro punto, reutiliza
    auth = getAuth(app);
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
