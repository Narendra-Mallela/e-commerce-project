import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProductListingPage from "./pages/ProductListingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import store from "./store/index.js";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>
        <ProfileProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<App />}>
                <Route path="/" element={<ProductListingPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ProfileProvider>
      </CartProvider>
    </Provider>
  </React.StrictMode>,
);
