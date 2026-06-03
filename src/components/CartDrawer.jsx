import React from "react";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer({ open, onClose }) {
  const { items, totalPrice, changeQuantity, removeFromCart, clearCart } = useCart();

  return (
    <>
      <div className={`cart-backdrop ${open ? "open" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <header className="cart-drawer-header">
          <span>
            <ShoppingCart size={21} />
            Cart
          </span>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={38} />
            <h2>Your cart is empty</h2>
            <p>Add products from the listing or detail page.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <Link to={`/product/${item.id}`} onClick={onClose}>
                    <img src={item.thumbnail} alt={item.title} />
                  </Link>
                  <div className="cart-item-info">
                    <h2>{item.title}</h2>
                    <strong>${item.price}</strong>
                    <div className="cart-quantity-row">
                      <button
                        onClick={() => changeQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.title}`}
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.title}`}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        className="cart-remove-button"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <footer className="cart-footer">
              <div>
                <span>Total</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              <button className="cart-clear-button" onClick={clearCart}>
                Clear Cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}
