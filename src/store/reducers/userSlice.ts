import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  displayName: string | null;
  email: string | null;
  uid: string | null;
}

const initialState: UserState = {
  displayName: null, // Cambiar a null en lugar de ''
  email: null,       // Cambiar a null en lugar de ''
  uid: null,         // Cambiar a null en lugar de ''
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      console.log("payloadfrom slice", action.payload);
      state.displayName = action.payload.displayName;
      state.email = action.payload.email;
      state.uid = action.payload.uid;
    },
    clearUser: (state) => {
      state.displayName = null; // Establecer a null en lugar de cadena vacía
      state.email = null;
      state.uid = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
