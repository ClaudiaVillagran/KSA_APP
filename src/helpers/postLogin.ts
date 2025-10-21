// helpers/postLogin.ts
import { auth, db } from "../config/firebase";
import { getDoc, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { setUser } from "../store/reducers/userSlice";

type BillingInfo = { razonSocial?: string | null; rut?: string | null; direccion?: string | null; };
type FireUser = {
  displayName?: string | null;
  email?: string | null;
  isBusiness?: boolean;
  businessPlan?: string | null;
  billing?: BillingInfo | null;
  featured?: boolean;
  businessSince?: any; // Firestore Timestamp
};

export const ensureUserDocAndDispatch = async (uid: string, dispatch: any) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  let data: FireUser;
  if (snap.exists()) {
    data = snap.data() as FireUser;
  } else {
    const authUser = auth.currentUser;
    data = {
      displayName: authUser?.displayName ?? null,
      email: authUser?.email ?? null,
      isBusiness: false,
      businessPlan: null,
      billing: null,
      featured: false,
      businessSince: serverTimestamp(),
    };
    await setDoc(ref, data, { merge: true });
  }

  const u = auth.currentUser!;
  dispatch(setUser({
    uid: u.uid,
    email: u.email ?? data.email ?? null,
    displayName: data.displayName ?? u.displayName ?? "Usuario",
    isBusiness: data.isBusiness ?? false,
    businessPlan: data.businessPlan ?? null,
    billing: data.billing ?? null,
    featured: data.featured ?? false,
    businessSince: data.businessSince ?? null,
  }));
};
