import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  areas: [], // Aquí se guardarán las áreas con sus categorías
};

const areaSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    // Acción para establecer las áreas, incluyendo sus categorías
    setAreas: (state, action) => {
      //   console.log("prueba");
      //   console.log(state);
      //   console.log("actionFrompayload",action.payload);
      // console.log(action.payload[0].id);
      state.areas = action.payload;
    },
    addArea: (state, action) => {
      state.areas.push(action.payload);
    },
  },
});

export const { setAreas, addArea} = areaSlice.actions;

// Reducer
export default areaSlice.reducer;
