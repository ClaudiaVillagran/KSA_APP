import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    // Add items to cart
    addItemToCart: (state, action) => {
      const isItemExists = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (isItemExists) {
        (isItemExists.qty += 1), (isItemExists.sum += action.payload.price);
      } else {
        state.items.push({
          ...action.payload,
          qty: 1,
          sum: action.payload.price,
        });
      }
    },
    // removeItemFromCart
    removeItemFromCart: (state, action) => {
      const isItemExists = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (isItemExists) {
        if (isItemExists.qty > 1) {
          // Decrease quantity and sum if qty is greater than 1
          isItemExists.qty -= 1;
          isItemExists.sum -= action.payload.price;
        } else {
          // If qty is 1, remove the product from the cart
          state.items = state.items.filter(
            (item) => item.id !== action.payload.id
          );
        }
      }
    },

    //removeProductFromCart
    removeProductFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },

    // clearCart
    clearCart: (state, action) => {
      state.items = [];
    },
    // etc.
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  removeProductFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
