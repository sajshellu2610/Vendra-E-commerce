import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/userService";

const savedUser = localStorage.getItem("vendra_user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

export const register = createAsyncThunk(
  "auth/register",
  async (form, thunkAPI) => {
    try {
      const existing = await (
        await import("../../services/userService")
      ).getUsers();
      if (
        existing.some(
          (user) => user.email.toLowerCase() === form.email.toLowerCase(),
        )
      ) {
        return thunkAPI.rejectWithValue(
          "An account with this email already exists.",
        );
      }
      return await registerUser({
        ...form,
        role: "user",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const user = await loginUser(credentials);
      if (!user)
        return thunkAPI.rejectWithValue("Email or password is incorrect.");
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message,
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: { user: initialUser, loading: false, error: null },
  reducers: {
    restoreSession: (state) => {
      const raw = localStorage.getItem("vendra_user");
      state.user = raw ? JSON.parse(raw) : null;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("vendra_user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("vendra_user", JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("vendra_user", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { restoreSession, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
