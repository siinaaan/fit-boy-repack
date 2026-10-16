import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchAdminUsers = createAsyncThunk(
    "adminUsers/fetchUsers",
    async()=>{
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    }
);

const adminUserSlice = createSlice({
    name: "adminUsers",
    initialState:{
        users: [],
        loading: false,
        error: null,
    },
    reducers:{},

    extraReducers:(builder) => {
        builder
        .addCase(fetchAdminUsers.pending, (state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdminUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
        })
        .addCase(fetchAdminUsers.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export default adminUserSlice.reducer;