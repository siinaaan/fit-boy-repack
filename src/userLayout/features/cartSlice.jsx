import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    setCart: (state, action) => {
      state.items = action.payload;
    },

    addToCart: (state, action) => {
      const cartItem = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.gameId) === String(cartItem.gameId),
      );

      if (existingItem) {
        existingItem.quantity = cartItem.quantity + 1;
      } else {
        state.items.push(cartItem);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCartQuantity: (state, action) => {
      const updatedItem = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(updatedItem.id),
      );

      if (existingItem) {
        existingItem.quantity = updatedItem.quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
