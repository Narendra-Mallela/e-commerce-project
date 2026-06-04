import React from "react";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="wishlist-empty">
        <Heart size={52} />
        <h2>Your wishlist is empty</h2>
        <p>Save products you love by tapping the heart icon.</p>
        <button className="checkout-back-btn" onClick={() => navigate("/")}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page-header">
        <h1>
          <Heart size={22} fill="currentColor" />
          Wishlist
        </h1>
        <span className="wishlist-count">{items.length} {items.length === 1 ? "item" : "items"}</span>
      </div>

      <div className="wishlist-grid">
        {items.map((product) => (
          <div key={product.id} className="wishlist-card">
            <Link to={`/product/${product.id}`} className="wishlist-card-image-link">
              <img src={product.thumbnail} alt={product.title} loading="lazy" />
            </Link>

            <div className="wishlist-card-body">
              {product.category && (
                <span className="product-category-badge">{product.category}</span>
              )}
              <Link to={`/product/${product.id}`} className="wishlist-card-title">
                {product.title}
              </Link>
              <div className="wishlist-card-meta">
                <strong className="wishlist-card-price">${product.price}</strong>
                {product.rating && (
                  <span className="rating-pill">
                    <Star size={12} fill="currentColor" />
                    {Number(product.rating).toFixed(1)}
                  </span>
                )}
              </div>
              <div className="wishlist-card-actions">
                <button
                  className="wishlist-add-cart-btn"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={15} />
                  Add to Cart
                </button>
                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label="Remove from wishlist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
