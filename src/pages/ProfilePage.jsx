import React, { useState } from "react";
import {
  CheckCircle,
  Edit3,
  Heart,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const TABS = ["Profile", "Orders", "Settings"];

export default function ProfilePage() {
  const { profile, saveProfile, resetProfile } = useProfile();
  const { items: cartItems } = useCart();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("Profile");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(profile);

  const displayName = user?.name || profile.name;
  const displayEmail = user?.email || profile.email;

  const initials = displayName
    ? displayName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSave(e) {
    e.preventDefault();
    saveProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleEdit() {
    setForm(profile);
    setEditing(true);
    setSaved(false);
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="profile-page">
      {/* ── Header card ── */}
      <div className="profile-header-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-header-info">
          <h1>{displayName || "Your Name"}</h1>
          <p>{displayEmail || "No email set"}</p>
        </div>
        {!editing && (
          <button className="profile-edit-btn" onClick={handleEdit}>
            <Edit3 size={15} />
            Edit
          </button>
        )}
      </div>

      {/* ── Stats row ── */}
      <div className="profile-stats">
        <div className="profile-stat">
          <ShoppingBag size={20} />
          <span>{cartItems.length}</span>
          <p>In Cart</p>
        </div>
        <div className="profile-stat">
          <Package size={20} />
          <span>{orders.length}</span>
          <p>Orders</p>
        </div>
        <div className="profile-stat profile-stat-link" onClick={() => navigate("/wishlist")}>
          <Heart size={20} />
          <span>{wishlistItems.length}</span>
          <p>Wishlist</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`profile-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === "Profile" && (
        <div className="profile-card">
          {saved && (
            <div className="profile-saved-banner">
              <CheckCircle size={16} />
              Profile saved successfully!
            </div>
          )}

          {editing ? (
            <form className="profile-form" onSubmit={handleSave}>
              <div className="profile-form-row">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>
              <div className="profile-form-row">
                <div className="profile-field">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                </div>
                <div className="profile-field">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="New York" />
                </div>
              </div>
              <div className="profile-form-row">
                <div className="profile-field">
                  <label>Address</label>
                  <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                </div>
                <div className="profile-field">
                  <label>Country</label>
                  <input name="country" value={form.country} onChange={handleChange} placeholder="United States" />
                </div>
              </div>
              <div className="profile-form-actions">
                <button type="submit" className="profile-save-btn">Save Changes</button>
                <button type="button" className="profile-cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <dl className="profile-details">
              <ProfileDetail icon={<User size={16} />} label="Full Name" value={displayName} />
              <ProfileDetail label="Email" value={displayEmail} />
              <ProfileDetail icon={<Phone size={16} />} label="Phone" value={profile.phone} />
              <ProfileDetail icon={<MapPin size={16} />} label="Address" value={profile.address} />
              <ProfileDetail label="City" value={profile.city} />
              <ProfileDetail label="Country" value={profile.country} />
            </dl>
          )}
        </div>
      )}

      {/* ── Orders tab ── */}
      {tab === "Orders" && (
        <div className="profile-card">
          {orders.length === 0 ? (
            <div className="profile-empty">
              <Package size={40} />
              <h2>No orders yet</h2>
              <p>Your completed purchases will appear here.</p>
              <Link to="/" className="profile-shop-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-card-meta">
                      <span className="order-id">Order #{order.id}</span>
                      <span className="order-date">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="order-card-right">
                      <span className={`order-status order-status-${order.status.toLowerCase().replace(" ", "-")}`}>
                        {order.status}
                      </span>
                      <strong className="order-total">${order.total.toFixed(2)}</strong>
                    </div>
                  </div>
                  <div className="order-items-list">
                    {order.items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        className="order-item"
                      >
                        <img src={item.thumbnail} alt={item.title} />
                        <div className="order-item-info">
                          <span>{item.title}</span>
                          <small>Qty: {item.quantity}</small>
                        </div>
                        <span className="order-item-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Settings tab ── */}
      {tab === "Settings" && (
        <div className="profile-card">
          <div className="profile-settings-list">
            <div className="profile-settings-item">
              <div>
                <h3>Notifications</h3>
                <p>Email me about deals and offers</p>
              </div>
              <label className="profile-toggle">
                <input type="checkbox" defaultChecked />
                <span />
              </label>
            </div>
            <div className="profile-settings-item">
              <div>
                <h3>Dark Mode</h3>
                <p>Switch to dark theme</p>
              </div>
              <label className="profile-toggle">
                <input type="checkbox" />
                <span />
              </label>
            </div>
            {user && (
              <div className="profile-settings-item danger">
                <div>
                  <h3>Sign Out</h3>
                  <p>Log out of your account</p>
                </div>
                <button className="profile-danger-btn" onClick={handleLogout}>
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            )}
            <div className="profile-settings-item danger">
              <div>
                <h3>Reset Profile</h3>
                <p>Clear all saved profile data</p>
              </div>
              <button className="profile-danger-btn" onClick={resetProfile}>
                <LogOut size={15} />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileDetail({ icon, label, value }) {
  return (
    <div className="profile-detail-row">
      <dt>
        {icon}
        {label}
      </dt>
      <dd>{value || <span className="muted-text">Not set</span>}</dd>
    </div>
  );
}
