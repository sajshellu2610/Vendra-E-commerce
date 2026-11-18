
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  registerUser,
  getUsers,
} from "../../services/userService";

const savedUser = localStorage.getItem("vendra_user");
const initialUser = savedUser ? JSON.parse(savedUser) : null;

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (form, thunkAPI) => {
    try {
      const existing = await getUsers();

      if (
        existing.some(
          (user) =>
            user.email.toLowerCase() === form.email.toLowerCase()
        )
      ) {
        return thunkAPI.rejectWithValue(
          "An account with this email already exists."
        );
      }

      return await registerUser({
        ...form,
        role: "user",
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const user = await loginUser(credentials);

      if (!user) {
        return thunkAPI.rejectWithValue(
          "Email or password is incorrect."
        );
      }

      const users = await getUsers();

      const latestUser = users.find(
        (item) => String(item.id) === String(user.id)
      );

      if (!latestUser) {
        return thunkAPI.rejectWithValue(
          "User account not found."
        );
      }

      if (latestUser.isBlocked === true) {
        return thunkAPI.rejectWithValue(
          "Your account has been blocked by admin."
        );
      }

      return latestUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// VALIDATE EXISTING SESSION
export const validateSession = createAsyncThunk(
  "auth/validateSession",
  async (_, thunkAPI) => {
    try {
      const currentUser = thunkAPI.getState().auth.user;

      if (!currentUser || currentUser.role === "admin") {
        return false;
      }

      const users = await getUsers();

      const latestUser = users.find(
        (user) => String(user.id) === String(currentUser.id)
      );

      return !latestUser || latestUser.isBlocked === true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: initialUser,
    loading: false,
    error: null,
  },

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
      // REGISTER
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          "vendra_user",
          JSON.stringify(action.payload)
        );
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem(
          "vendra_user",
          JSON.stringify(action.payload)
        );
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SESSION VALIDATION
      .addCase(validateSession.fulfilled, (state, action) => {
        if (action.payload === true) {
          state.user = null;
          localStorage.removeItem("vendra_user");
        }
      });
  },
});

export const {
  restoreSession,
  logout,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
