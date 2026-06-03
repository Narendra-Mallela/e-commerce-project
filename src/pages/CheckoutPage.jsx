import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext.jsx";

function generateOrderId() {
  return "SX" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, saveProfile } = useProfile();

  const items = location.state?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [delivery, setDelivery] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    country: profile.country || "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const [step, setStep] = useState("checkout"); // "checkout" | "success"
  const [orderId] = useState(generateOrderId);
  const [saveAddress, setSaveAddress] = useState(false);

  function handleDelivery(e) {
    setDelivery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePayment(e) {
    const { name, value } = e.target;
    let formatted = value.replace(/\D/g, "");

    if (name === "cardNumber") formatted = formatted.slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (name === "expiry") {
      formatted = value.replace(/\D/g, "").slice(0, 4);
      if (formatted.length > 2) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
    }
    if (name === "cvv") formatted = value.replace(/\D/g, "").slice(0, 3);

    setPayment((prev) => ({ ...prev, [name]: name === "nameOnCard" ? value : formatted }));
  }

  function handlePlaceOrder(e) {
    e.preventDefault();
    if (saveAddress) saveProfile(delivery);
    setStep("success");
  }

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <ShoppingBag size={48} />
        <h2>Nothing to checkout</h2>
        <p>Go back and use "Buy Now" on a product.</p>
        <button className="checkout-back-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={15} /> Browse Products
        </button>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="checkout-success">
        <div className="checkout-success-icon">
          <CheckCircle size={52} />
        </div>
        <h1>Order Placed!</h1>
        <p className="checkout-success-sub">Thank you for your purchase.</p>
        <div className="checkout-success-order">
          Order ID: <strong>{orderId}</strong>
        </div>
        <div className="checkout-success-items">
          {items.map((item) => (
            <div key={item.id} className="checkout-success-item">
              <img src={item.thumbnail} alt={item.title} />
              <span>{item.title}</span>
              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </div>
        <div className="checkout-success-total">
          <Truck size={16} /> Estimated delivery: 3–5 business days
        </div>
        <button className="checkout-back-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-heading">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>
        <h1>Checkout</h1>
      </div>

      <form className="checkout-layout" onSubmit={handlePlaceOrder}>
        {/* ── Left column ── */}
        <div className="checkout-left">
          {/* Delivery */}
          <section className="checkout-section">
            <h2>
              <MapPin size={17} /> Delivery Details
            </h2>
            <div className="checkout-form-grid">
              <div className="checkout-field">
                <label>Full Name</label>
                <input name="name" value={delivery.name} onChange={handleDelivery} placeholder="John Doe" required />
              </div>
              <div className="checkout-field">
                <label>Email</label>
                <input name="email" type="email" value={delivery.email} onChange={handleDelivery} placeholder="john@example.com" required />
              </div>
              <div className="checkout-field">
                <label>Phone</label>
                <input name="phone" value={delivery.phone} onChange={handleDelivery} placeholder="+1 234 567 8900" required />
              </div>
              <div className="checkout-field">
                <label>City</label>
                <input name="city" value={delivery.city} onChange={handleDelivery} placeholder="New York" required />
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Address</label>
                <input name="address" value={delivery.address} onChange={handleDelivery} placeholder="123 Main St, Apt 4B" required />
              </div>
              <div className="checkout-field">
                <label>Country</label>
                <input name="country" value={delivery.country} onChange={handleDelivery} placeholder="United States" required />
              </div>
            </div>
            <label className="checkout-save-row">
              <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} />
              Save address to my profile
            </label>
          </section>

          {/* Payment */}
          <section className="checkout-section">
            <h2>
              <CreditCard size={17} /> Payment
            </h2>
            <div className="checkout-form-grid">
              <div className="checkout-field checkout-field-full">
                <label>Card Number</label>
                <input
                  name="cardNumber"
                  value={payment.cardNumber}
                  onChange={handlePayment}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Expiry</label>
                <input name="expiry" value={payment.expiry} onChange={handlePayment} placeholder="MM/YY" maxLength={5} required />
              </div>
              <div className="checkout-field">
                <label>CVV</label>
                <input name="cvv" value={payment.cvv} onChange={handlePayment} placeholder="123" maxLength={3} required />
              </div>
              <div className="checkout-field checkout-field-full">
                <label>Name on Card</label>
                <input name="nameOnCard" value={payment.nameOnCard} onChange={handlePayment} placeholder="John Doe" required />
              </div>
            </div>
            <div className="checkout-secure-note">
              <Lock size={13} /> Secured with 256-bit SSL encryption
            </div>
          </section>
        </div>

        {/* ── Right column — order summary ── */}
        <aside className="checkout-summary">
          <h2>
            <Package size={17} /> Order Summary
          </h2>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <img src={item.thumbnail} alt={item.title} />
                <div>
                  <p>{item.title}</p>
                  <span>Qty: {item.quantity}</span>
                </div>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-summary-totals">
            <div>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div>
              <span>Shipping</span>
              <span className="checkout-free">FREE</span>
            </div>
            <div className="checkout-grand-total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
          <button type="submit" className="checkout-place-btn">
            <Lock size={15} /> Place Order · ${total.toFixed(2)}
          </button>
        </aside>
      </form>
    </div>
  );
}
