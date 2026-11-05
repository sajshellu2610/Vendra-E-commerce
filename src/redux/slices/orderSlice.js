import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createOrder, getOrdersByUser } from '../../services/orderService';

export const fetchOrders = createAsyncThunk('orders/fetch', async (userId, thunkAPI) => {
  try { return await getOrdersByUser(userId); }
  catch (error) { return thunkAPI.rejectWithValue(error.message); }
});

export const placeOrder = createAsyncThunk('orders/create', async (order, thunkAPI) => {
  try { return await createOrder(order); }
  catch (error) { return thunkAPI.rejectWithValue(error.response?.data?.message || error.message); }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrder.fulfilled, (state, action) => { state.loading = false; state.items.unshift(action.payload); })
      .addCase(placeOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default orderSlice.reducer;
