import React, { useState } from "react";
import { Menu, Search, ShoppingCart, UserCircle } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CategoryDrawer from "./CategoryDrawer.jsx";
import { useCart } from "../context/CartContext.jsx";
import { CATEGORY_GROUPS, setSearchValue } from "../utils/filters.js";

export default function Header({ onCartOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalQuantity } = useCart();
  const query = searchParams.get("q") ?? "";

  function handleSearchChange(event) {
    const next = setSearchValue(searchParams, "q", event.target.value);

    if (location.pathname !== "/") {
      navigate(`/?${next.toString()}`);
      return;
    }

    setSearchParams(next);
  }

  function goHome() {
    navigate("/");
    setMenuOpen(false);
  }

  function goCategory(categoryId) {
    navigate(`/?category=${categoryId}&page=1`);
  }

  return (
    <>
      <header className="topbar">
        <button className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu size={23} />
        </button>
        <button className="topbar-brand" onClick={goHome} aria-label="Go to home page">
          <span className="topbar-brand-dot" />
          ShopX
        </button>
        <label className="search-field">
          <Search size={17} />
          <input
            value={query}
            type="search"
            onChange={handleSearchChange}
            placeholder="Search products..."
          />
        </label>
        <div className="topbar-actions">
          <button className="icon-button cart-icon-button" onClick={onCartOpen} aria-label="Open cart">
            <ShoppingCart size={21} />
            {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
          </button>
          <button className="icon-button" aria-label="Account" onClick={() => navigate("/profile")}>
            <UserCircle size={22} />
          </button>
        </div>
      </header>
      <nav className="home-nav" aria-label="Primary categories">
        <button onClick={goHome}>All</button>
        {CATEGORY_GROUPS.map((category) => (
          <button key={category.id} onClick={() => goCategory(category.id)}>
            {category.name}
          </button>
        ))}
      </nav>
      <CategoryDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
