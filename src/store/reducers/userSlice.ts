import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BillingInfo {
  razonSocial?: string | null;
  rut?: string | null;
  direccion?: string | null;
}

export interface UserState {
  displayName: string | null;
  email: string | null;
  uid: string | null;

  isBusiness: boolean;
  businessPlan: string | null; // 'monthly' | 'semiannual' | 'annual' | 'flexible' | null
  billing: BillingInfo | null;

  // (Opcionales) si luego quieres usarlos:
  featured?: boolean;
  businessSince?: any;
}

const initialState: UserState = {
  displayName: null,
  email: null,
  uid: null,
  isBusiness: false,
  businessPlan: null,
  billing: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Permite payloads parciales y mergea sobre el estado actual
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },

    clearUser: (state) => {
      state.displayName = null;
      state.email = null;
      state.uid = null;
      state.isBusiness = false;
      state.businessPlan = null;
      state.billing = null;
      state.featured = false;
      state.businessSince = null;
    },

    updateBusinessStatus: (
      state,
      action: PayloadAction<{ isBusiness: boolean; businessPlan?: string | null; billing?: BillingInfo | null }>
    ) => {
      state.isBusiness = action.payload.isBusiness;
      if (typeof action.payload.businessPlan !== 'undefined') {
        state.businessPlan = action.payload.businessPlan;
      }
      if (typeof action.payload.billing !== 'undefined') {
        state.billing = action.payload.billing;
      }
    },
  },
});

export const { setUser, clearUser, updateBusinessStatus } = userSlice.actions;
export default userSlice.reducer;
