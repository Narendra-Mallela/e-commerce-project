import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { OrdersProvider } from "./context/OrdersContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import ProductListingPage from "./pages/ProductListingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import WishlistPage from "./pages/WishlistPage.jsx";
import store from "./store/index.js";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <CartProvider>
          <ProfileProvider>
            <WishlistProvider>
              <OrdersProvider>
                <BrowserRouter>
                  <Routes>
                    <Route element={<App />}>
                      <Route path="/" element={<ProductListingPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/wishlist" element={<WishlistPage />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </OrdersProvider>
            </WishlistProvider>
          </ProfileProvider>
        </CartProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
