import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../userLayout/features/authSlice";
import cartReducer from "../userLayout/features/cartSlice";
import wishlistReducer from "../userLayout/features/wishlistSlice";

import adminProductReducer from "../adminLayout/features/adminProductSlice";
import adminUserReducer from "../adminLayout/features/adminUserSlice";
import adminOrderReducer from "../adminLayout/features/adminOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    adminProducts: adminProductReducer,
    adminUsers: adminUserReducer,
    adminOrders: adminOrderReducer,
  },
});