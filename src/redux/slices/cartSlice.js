
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, saveCart } from "../../services/cartService";

// FETCH CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId) => {
    const cart = await getCart(userId);
    return cart || { id: null, userId, items: [] };
  }
);

// ADD TO CART
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, product }, { getState }) => {
    const items = [...getState().cart.items];

    const existing = items.find(
      (item) => String(item.id) === String(product.id)
    );

    const stock = Number(product.stock);
    const requestedQuantity = Math.max(
      1,
      Number(product.quantity) || 1
    );

    if (!Number.isFinite(stock) || stock <= 0) {
      throw new Error("This product is out of stock.");
    }

    if (existing) {
      existing.quantity = Math.min(
        existing.quantity + requestedQuantity,
        stock
      );
    } else {
      items.push({
        ...product,
        quantity: Math.min(requestedQuantity, stock),
      });
    }

    return await saveCart(userId, items);
  }
);

// UPDATE QUANTITY
export const updateCartQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, id, quantity }, { getState }) => {
    const items = getState().cart.items.map((item) => {
      if (String(item.id) !== String(id)) return item;

      const stock = Number(item.stock);

      return {
        ...item,
        quantity: Math.max(
          1,
          Math.min(Number(quantity), stock)
        ),
      };
    });

    return await saveCart(userId, items);
  }
);

// REMOVE FROM CART
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, id }, { getState }) => {
    const items = getState().cart.items.filter(
      (item) => String(item.id) !== String(id)
    );

    return await saveCart(userId, items);
  }
);

// CLEAR CART
export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (userId) => {
    return await saveCart(userId, []);
  }
);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    status: "idle",
    error: null,
  },

  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.status = "succeeded";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // ADD
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      // UPDATE
      .addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      // REMOVE
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      // CLEAR
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
      })

      // OTHER API ERRORS
      .addMatcher(
        (action) =>
          action.type.startsWith("cart/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error.message;
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;

export default cartSlice.reducer;
