import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  companies: [],   // array de empresas destacadas
  loading: false,
  error: null as string | null,
};

const companySlice = createSlice({
  name: "companySlice",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCompanies: (state, action) => {
      state.loading = false;
      state.companies = action.payload || [];
    },
    setCompanyError: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Error al cargar empresas destacadas";
    },
    clearCompanies: (state) => {
      state.companies = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const { startLoading, setCompanies, setCompanyError, clearCompanies } =
  companySlice.actions;

export default companySlice.reducer;
