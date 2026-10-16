import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchAdminOrders = createAsyncThunk(
    "adminOrders/fetchOrders",
    async() => {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
    }
);

const adminOrderSlice = createSlice({
    name:"adminOrdera",
    initialState:{
        orders:[],
        loading: false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(fetchAdminOrders.pending,(state, action)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAdminOrders.fulfilled, (state, action)=>{
            state.loading = false;
            state.orders = action.payload;
        })
        .addCase(fetchAdminOrders.rejected, (state, action)=> {
            state.loading = false;
            state.error = action.error.message
        });
    },
});

export default adminOrderSlice.reducer;