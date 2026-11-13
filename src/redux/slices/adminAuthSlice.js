
import { createSlice } from "@reduxjs/toolkit";

const savedAdmin = localStorage.getItem("vendra_admin");

const initialState = {
  admin: savedAdmin ? JSON.parse(savedAdmin) : null,
  isAuthenticated: !!savedAdmin,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,

  reducers: {
    adminLogin: (state, action) => {
      state.admin = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem(
        "vendra_admin",
        JSON.stringify(action.payload)
      );
    },

    adminLogout: (state) => {
      state.admin = null;
      state.isAuthenticated = false;

      localStorage.removeItem("vendra_admin");
    },
  },
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
