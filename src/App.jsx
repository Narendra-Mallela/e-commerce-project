import React, { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import Header from "./components/Header.jsx";

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const searchRef = useRef(null);

  function focusSearch() {
    const input = document.querySelector(".topbar .search-field input");
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="app-shell">
      <Header onCartOpen={() => setCartOpen(true)} />
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNav onCartOpen={() => setCartOpen(true)} onSearchFocus={focusSearch} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
