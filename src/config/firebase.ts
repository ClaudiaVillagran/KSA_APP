import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage"; // Importar Storage

import { FirebaseConstants } from "../constants/FirebaseConstants"; // Importar constantes

// Optionally import the services that you want to use
// import {...} from 'firebase/database';
// import {...} from 'firebase/functions';

// Initialize Firebase
const firebaseConfig = {
  apiKey: FirebaseConstants.API_KEY,
  authDomain: FirebaseConstants.AUTH_DOMAIN,
  projectId: FirebaseConstants.PROJECT_ID,
  storageBucket: FirebaseConstants.STORAGE_BUCKET,
  messagingSenderId: FirebaseConstants.MESSAGING_SENDER_ID,
  appId: FirebaseConstants.APP_ID,
};

const app = initializeApp(firebaseConfig);

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const auth = getAuth(app);
const db = getFirestore(app);

const storage = getStorage(app); // Para Firebase Storage

export { auth, db, storage };
