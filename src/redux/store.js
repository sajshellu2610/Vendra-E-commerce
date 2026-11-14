import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import adminAuthReducer from './slices/adminAuthSlice';
import adminDashboardReducer from "./slices/adminDashboardSlice";
import adminUsersReducer from "./slices/adminUsersSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: orderReducer,
    adminAuth: adminAuthReducer,
    adminDashboard: adminDashboardReducer,
    adminUsers: adminUsersReducer,
  }
});
