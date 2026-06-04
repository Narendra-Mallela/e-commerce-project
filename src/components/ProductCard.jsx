import React from "react";
import { Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  }

  function handleBuyNow(event) {
    event.preventDefault();
    event.stopPropagation();
    navigate("/checkout", {
      state: { items: [{ ...product, quantity: 1 }] },
    });
  }

  function handleWishlist(event) {
    event.preventDefault();
    event.stopPropagation();
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  }

  return (
    <Link
      className="product-card"
      to={`/product/${product.id}${location.search}`}
      state={{ from: `${location.pathname}${location.search}` }}
    >
      <div className="product-image-wrap">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <button
          className={`wish-btn${wishlisted ? " active" : ""}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="product-info">
        {product.category && (
          <span className="product-category-badge">{product.category}</span>
        )}
        <h2>{product.title}</h2>
        <div className="product-meta">
          <strong>${product.price}</strong>
          <span className="rating-pill">
            <Star size={12} fill="currentColor" />
            {Number(product.rating).toFixed(1)}
          </span>
        </div>
        <div className="card-action-row">
          <button className="add-to-cart-btn" onClick={handleAddToCart} aria-label="Add to cart">
            <ShoppingCart size={14} />
            <span className="action-label-full">Add to Cart</span>
            <span className="action-label-short">Cart</span>
          </button>
          <button className="buy-now-btn" onClick={handleBuyNow} aria-label="Buy now">
            <Zap size={14} />
            <span className="action-label-full">Buy Now</span>
            <span className="action-label-short">Buy</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
