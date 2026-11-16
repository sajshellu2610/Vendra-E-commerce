
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all orders
export const fetchAdminOrders = createAsyncThunk(
  "adminOrders/fetchOrders",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await api.patch(`/orders/${id}`, {
        status,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",

  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;

        const index = state.orders.findIndex(
          (order) =>
            String(order.id) === String(updatedOrder.id)
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default adminOrdersSlice.reducer;
