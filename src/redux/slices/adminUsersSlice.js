
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "adminUsers/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/users");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Block or unblock a user
export const updateUserStatus = createAsyncThunk(
  "adminUsers/updateUserStatus",
  async ({ id, isBlocked }, thunkAPI) => {
    try {
      const response = await api.patch(`/users/${id}`, {
        isBlocked,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const adminUsersSlice = createSlice({
  name: "adminUsers",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        const index = state.users.findIndex(
          (user) => String(user.id) === String(updatedUser.id)
        );

        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      });
  },
});

export default adminUsersSlice.reducer;
