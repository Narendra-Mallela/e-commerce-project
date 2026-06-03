import React from "react";
import { Home, Search, ShoppingCart, UserCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function BottomNav({ onCartOpen, onSearchFocus }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalQuantity } = useCart();
  const isHome = location.pathname === "/" && !location.search.includes("category");
  const isProfile = location.pathname === "/profile";

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <button
        className={`bottom-nav-btn ${isHome ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <Home size={22} />
        <span>Home</span>
      </button>

      <button className="bottom-nav-btn" onClick={onSearchFocus}>
        <Search size={22} />
        <span>Search</span>
      </button>

      <button className="bottom-nav-btn cart-nav-btn" onClick={onCartOpen}>
        <span className="bottom-nav-icon-wrap">
          <ShoppingCart size={22} />
          {totalQuantity > 0 && (
            <span className="bottom-nav-badge">{totalQuantity}</span>
          )}
        </span>
        <span>Cart</span>
      </button>

      <button
        className={`bottom-nav-btn ${isProfile ? "active" : ""}`}
        onClick={() => navigate("/profile")}
      >
        <UserCircle size={22} />
        <span>Account</span>
      </button>
    </nav>
  );
}
