import React, { useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, ShoppingCart, Star, Zap } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import StatusMessage from "../components/StatusMessage.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { clearProduct, loadProductById } from "../store/productDetailSlice.js";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();

  const { product, loading, error } = useSelector((state) => state.productDetail);
  const wishlisted = product ? isWishlisted(product.id) : false;

  useEffect(() => {
    dispatch(loadProductById(id));
    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  function goBack() {
    navigate(location.state?.from ?? `/${location.search}`);
  }

  function goToProduct(productId) {
    navigate(`/product/${productId}${location.search}`, {
      state: { from: location.state?.from ?? `/${location.search}` },
    });
  }

  function handleWishlist() {
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  }

  if (loading) {
    return <StatusMessage title="Loading product" message="Fetching product details." />;
  }

  if (error || !product) {
    return <StatusMessage title="Unable to load product" message={error || "Product not found."} />;
  }

  return (
    <section className="detail-page">
      <div className="detail-layout">
        <div className="detail-media-column">
          <button className="back-button" onClick={goBack}>
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="detail-image-wrap">
            <img src={product.thumbnail} alt={product.title} />
            <button
              className={`detail-wish-btn${wishlisted ? " active" : ""}`}
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={20} fill={wishlisted ? "currentColor" : "none"} />
              {wishlisted ? "Wishlisted" : "Add to Wishlist"}
            </button>
          </div>

          <nav className="detail-mini-pagination" aria-label="Product detail pagination">
            <button
              className="page-button"
              disabled={Number(id) <= 1}
              onClick={() => goToProduct(Number(id) - 1)}
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            {[1, 2, 3, 4, 5].map((pageId) => (
              <button
                key={pageId}
                className={`page-number ${Number(id) === pageId ? "active" : ""}`}
                onClick={() => goToProduct(pageId)}
              >
                {pageId}
              </button>
            ))}
            <button className="page-button" onClick={() => goToProduct(Number(id) + 1)}>
              Next
              <ChevronRight size={14} />
            </button>
          </nav>
        </div>

        <article className="detail-content">
          <h1>{product.title}</h1>
          <div className="detail-price-row">
            <strong>${product.price}</strong>
            <span className="rating-pill large">
              <Star size={16} fill="currentColor" />
              {Number(product.rating).toFixed(1)}
            </span>
          </div>

          <div className="detail-action-row">
            <button className="detail-cart-button" onClick={() => addToCart(product)}>
              <ShoppingCart size={17} />
              Add to Cart
            </button>
            <button
              className="detail-buynow-button"
              onClick={() =>
                navigate("/checkout", {
                  state: { items: [{ ...product, quantity: 1 }] },
                })
              }
            >
              <Zap size={17} />
              Buy Now
            </button>
          </div>

          <dl className="product-facts">
            <div>
              <dt>Brand</dt>
              <dd>{product.brand || "Not listed"}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{product.category}</dd>
            </div>
          </dl>

          <section className="detail-section">
            <h2>Description</h2>
            <p>{product.description}</p>
          </section>

          <section className="detail-section">
            <h2>Reviews</h2>
            {(product.reviews ?? []).length === 0 ? (
              <p className="muted-text">No reviews available.</p>
            ) : (
              <div className="reviews-list">
                {product.reviews.slice(0, 3).map((review, index) => (
                  <article className="review-item" key={`${review.reviewerName}-${index}`}>
                    <div>
                      <strong>{review.reviewerName}</strong>
                      <span className="rating-pill">
                        <Star size={13} fill="currentColor" />
                        {Number(review.rating).toFixed(1)}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        </article>
      </div>
    </section>
  );
}
