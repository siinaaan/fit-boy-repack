import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },

    addToWishlist: (state, action) => {
      const wishlistItem = action.payload;

      const existingItem = state.items.find(
        (item) =>
          String(item.gameId) ===
          String(wishlistItem.gameId)
      );

      if (!existingItem) {
        state.items.push(wishlistItem);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          String(item.id) !==
          String(action.payload)
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;