import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchAdminProducts = createAsyncThunk(
    "adminProducts/fetchProducts",
    async(_,{rejectWithValue}) => {
        try{
        const response = await axios.get(`${API_URL}/games`);
        return response.data;
    }catch(error){
        return rejectWithValue(
            error.response?.data || error.message
        );
        }
    }
);

export const addAdminProduct = createAsyncThunk(
    "adminProducts/addProduct",
    async(product,{rejectWithValue}) =>{
        try{
            const response = await axios.get(
                `${API_URL}/getGames`,product
            );
            return response.data;
        }catch(error){
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/games/${id}`,
        productData
      );

      return response.data;
    } catch (error) {
      console.error(
        "API update error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const deleteAdminProduct = createAsyncThunk(
    "adminProducts/deleteProduct",
    async(id,{rejectWithValue}) => {
        try{
            await axios.delete(`${API_URL}/games/${id}`);
            return id;
        }catch (error){
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);



const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },

    reducers: {},
    extraReducers:(builder)=>{
        builder
    .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchAdminProducts.fulfilled, (state, action)=>{
        state.loading = false;
        state.products = action.payload;
    })
    .addCase(fetchAdminProducts.rejected, (state,action)=>{
        state.loading = false;
        state.error = action.error.message
    })



    .addCase(addAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(addAdminProduct.fulfilled,(state,action) => {
        state.loading = false;
        state.products.push(action.payload);
    })
    .addCase(addAdminProduct.rejected,(state,action)=> {
        state.loading = false;
        state.error = action.payload || action.error.message;
    })



    .addCase(updateAdminProduct.pending,(state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(updateAdminProduct.fulfilled,(state,action)=>{
        state.loading = false;

        const index = state.products.findIndex(
            (product) => String(product.id) === String(action.payload.id)
        );

        if(index !== -1){
            state.products[index] = action.payload;
        }
    })
    .addCase(updateAdminProduct.rejected,(state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
    })


    .addCase(deleteAdminProduct.pending,(state)=>{
        state.loading = true;
        state.error = null;
    })
    .addCase(deleteAdminProduct.fulfilled, (state,action)=>{
        state.loading = false;

        state.products = state.products.filter(
            (product) => String(product.id) !== String(action.payload)
        );
    })
    .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
    });
    },
});

export default adminProductSlice.reducer