
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch dashboard data from JSON Server
export const fetchDashboardData = createAsyncThunk(
  "adminDashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        api.get("/products"),
        api.get("/users"),
        api.get("/orders"),
      ]);

      return {
        products: productsRes.data,
        users: usersRes.data,
        orders: ordersRes.data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboard",

  initialState: {
    products: [],
    users: [],
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.users = action.payload.users;
        state.orders = action.payload.orders;
      })

      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminDashboardSlice.reducer;
