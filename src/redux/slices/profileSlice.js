import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "profile",
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        handleNameChange: (state, action) => {
            state.user.name = action.payload;
        }
    }
});

export const { setUser, handleNameChange } = profileSlice.actions;
export default profileSlice.reducer;