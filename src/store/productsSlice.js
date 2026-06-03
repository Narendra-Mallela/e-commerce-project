import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllProducts, fetchCategories, fetchProductsByCategory } from "../api/products.js";

export const loadCategories = createAsyncThunk("products/loadCategories", async () => {
  return fetchCategories();
});

export const loadProducts = createAsyncThunk("products/loadProducts", async (category) => {
  if (category) {
    return fetchProductsByCategory(category);
  }
  return fetchAllProducts();
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    categories: [],
    loading: false,
    error: "",
    loadedCategory: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(loadProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.loadedCategory = action.meta.arg ?? null;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load products.";
      });
  },
});

export default productsSlice.reducer;
