import { createSlice } from "@reduxjs/toolkit";
const savedUser = localStorage.getItem("user");

const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state,action) => {
            state.user = action.payload;
            state.isAuthenticated = true;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("user");
        },
    },
});

export const { setUser, logout } = authSlice.actions
export default authSlice.reducer;