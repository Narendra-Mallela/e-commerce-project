import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchProductById } from "../api/products.js";

export const loadProductById = createAsyncThunk("productDetail/load", async (id) => {
  return fetchProductById(id);
});

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState: {
    product: null,
    loading: false,
    error: "",
  },
  reducers: {
    clearProduct(state) {
      state.product = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProductById.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.product = null;
      })
      .addCase(loadProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(loadProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load product.";
      });
  },
});

export const { clearProduct } = productDetailSlice.actions;
export default productDetailSlice.reducer;
