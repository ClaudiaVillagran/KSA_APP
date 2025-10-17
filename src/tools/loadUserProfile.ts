import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../config/firebase";
import { AppDispatch } from "../store/store";
import { setUser, clearUser } from "../store/reducers/userSlice";

type BillingInfo = {
  razonSocial?: string | null;
  rut?: string | null;
  direccion?: string | null;
};

export type FireUser = {
  displayName?: string | null;
  email?: string | null;
  isBusiness?: boolean;
  businessPlan?: string | null;
  billing?: BillingInfo | null;
  featured?: boolean;
  businessSince?: any; // Firestore Timestamp
};

/**
 * Listener global que:
 *  - Escucha cambios de sesión (Auth)
 *  - Se suscribe al documento /users/{uid}
 *  - Fusiona Auth + Firestore en Redux (userSlice)
 */
export function attachAuthProfileListener(dispatch: AppDispatch) {
  let unsubProfile: (() => void) | null = null;

  return onAuthStateChanged(auth, async (authUser: User | null) => {
    // Limpia listener anterior si existe
    if (unsubProfile) { unsubProfile(); unsubProfile = null; }

    if (!authUser) {
      dispatch(clearUser());
      return;
    }

    const uid = authUser.uid;
    const ref = doc(db, "users", uid);

    unsubProfile = onSnapshot(
      ref,
      (snap) => {
        const data = (snap.exists() ? (snap.data() as FireUser) : {}) || {};

        dispatch(setUser({
          uid,
          email: authUser.email ?? data.email ?? null,
          displayName: authUser.displayName ?? data.displayName ?? null,

          isBusiness: data.isBusiness ?? false,
          businessPlan: data.businessPlan ?? null,
          billing: data.billing ?? null,
          featured: data.featured ?? false,
          businessSince: data.businessSince ?? null,
        }));
      },
      (err) => {
        console.error("onSnapshot(users/{uid}) error:", err);
        // Fallback mínimo con datos de Auth
        dispatch(setUser({
          uid,
          email: authUser.email ?? null,
          displayName: authUser.displayName ?? null,
          isBusiness: false,
          businessPlan: null,
          billing: null,
          featured: false,
          businessSince: null,
        }));
      }
    );
  });
}
