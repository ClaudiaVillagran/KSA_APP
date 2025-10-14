import { fetchFeaturedCompanies } from "../../data/firestoreData/CompaniesFromFirestore";
import { startLoading, setCompanies, setCompanyError } from "../reducers/companySlice";

export const loadFeaturedCompanies = (max = 10) => {
  return async (dispatch: any) => {
    try {
      dispatch(startLoading());
      const list = await fetchFeaturedCompanies(max);
      dispatch(setCompanies(list));
    } catch (e: any) {
      dispatch(setCompanyError(e?.message || "No se pudieron cargar las empresas destacadas"));
      console.warn("[loadFeaturedCompanies] error:", e);
    }
  };
};
