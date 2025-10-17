
import {
  collection,
  query,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { startLoading, setCompanies, setCompanyError } from "../reducers/companySlice";

export const subscribeFeaturedCompanies = (max = 10) => {
  return (dispatch: any) => {
    dispatch(startLoading());
    try {
      const q = query(
        collection(db, "featured_companies"),
        limit(max)
      );
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          // console.log("[subscribeFeaturedCompanies] size:", snap.size);
          const list = snap.docs.map((d) => {
            const data = d.data();
            // console.log("doc:", d.id, data?.name || data); // depura qué llega
            return { id: d.id, ...data };
          });
          dispatch(setCompanies(list));
        },
        (err) => {
          console.warn("[subscribeFeaturedCompanies] error:", err);
          dispatch(setCompanyError(err?.message || "Error escuchando cambios"));
        }
      );

      return unsubscribe;
    } catch (e: any) {
      console.warn("[subscribeFeaturedCompanies] try/catch error:", e);
      dispatch(setCompanyError(e?.message || "No se pudieron escuchar cambios"));
      return () => {};
    }
  };
};

// se carga la empresa destacada al Firestore, con la data de ../../data/firestoreData/CompaniesFromFirestore";
// export const loadFeaturedCompanies = (max = 10) => {
//   return async (dispatch: any) => {
//     try {
//       dispatch(startLoading());
//       const list = await fetchFeaturedCompanies(max);
//       dispatch(setCompanies(list));
//     } catch (e: any) {
//       dispatch(setCompanyError(e?.message || "No se pudieron cargar las empresas destacadas"));
//       console.warn("[loadFeaturedCompanies] error:", e);
//     }
//   };
// };