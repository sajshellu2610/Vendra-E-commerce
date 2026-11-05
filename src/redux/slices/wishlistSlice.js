
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getWishlist,
  saveWishlist,
} from '../../services/wishlistService';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId) => {
    const wishlist = await getWishlist(userId);
    return wishlist || { id: null, userId, items: [] };
  }
);

export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggleWishlist',
  async ({ userId, product }, { getState }) => {
    const items = [...getState().wishlist.items];

    const exists = items.some(
      (item) => String(item.id) === String(product.id)
    );

    const updatedItems = exists
      ? items.filter(
          (item) => String(item.id) !== String(product.id)
        )
      : [...items, product];

    return await saveWishlist(userId, updatedItems);
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',

  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },

  reducers: {
    resetWishlist: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.status = 'succeeded';
      })
      .addCase(toggleWishlistAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('wishlist/') &&
          action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.error.message;
        }
      );
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
