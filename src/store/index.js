import { configureStore } from "@reduxjs/toolkit";
import productDetailReducer from "./productDetailSlice.js";
import productsReducer from "./productsSlice.js";

const store = configureStore({
  reducer: {
    products: productsReducer,
    productDetail: productDetailReducer,
  },
});

export default store;
