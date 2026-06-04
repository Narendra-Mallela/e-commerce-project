import React, { useState } from "react";
import { Heart, Menu, Search, ShoppingCart, UserCircle } from "lucide-react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";
import CategoryDrawer from "./CategoryDrawer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { CATEGORY_GROUPS, setSearchValue } from "../utils/filters.js";

export default function Header({ onCartOpen }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { totalQuantity } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
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

  function handleUserClick() {
    if (user) {
      navigate("/profile");
    } else {
      setAuthOpen(true);
    }
  }

  const initials = user
    ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : null;

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
          <button
            className="icon-button cart-icon-button"
            onClick={() => navigate("/wishlist")}
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="cart-count">{wishlistItems.length}</span>
            )}
          </button>
          <button className="icon-button cart-icon-button" onClick={onCartOpen} aria-label="Open cart">
            <ShoppingCart size={21} />
            {totalQuantity > 0 && <span className="cart-count">{totalQuantity}</span>}
          </button>
          {user ? (
            <div className="auth-user-menu">
              <button className="auth-user-chip" onClick={handleUserClick} title={user.email}>
                {initials}
              </button>
              <button className="auth-logout-btn" onClick={logout} aria-label="Sign out">
                Sign out
              </button>
            </div>
          ) : (
            <button className="icon-button" aria-label="Sign in" onClick={handleUserClick}>
              <UserCircle size={22} />
            </button>
          )}
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
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
