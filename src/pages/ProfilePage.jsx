import React, { useState } from "react";
import {
  CheckCircle,
  Edit3,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";

const TABS = ["Profile", "Orders", "Settings"];

export default function ProfilePage() {
  const { profile, saveProfile, resetProfile } = useProfile();
  const { items, totalPrice } = useCart();
  const [tab, setTab] = useState("Profile");
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState(profile);

  const initials = profile.name
    ? profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
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

  return (
    <div className="profile-page">
      {/* ── Header card ── */}
      <div className="profile-header-card">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-header-info">
          <h1>{profile.name || "Your Name"}</h1>
          <p>{profile.email || "No email set"}</p>
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
          <span>{items.length}</span>
          <p>Items in Cart</p>
        </div>
        <div className="profile-stat">
          <Package size={20} />
          <span>0</span>
          <p>Orders Placed</p>
        </div>
        <div className="profile-stat">
          <MapPin size={20} />
          <span>{profile.city || "—"}</span>
          <p>City</p>
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
              <ProfileDetail icon={<User size={16} />} label="Full Name" value={profile.name} />
              <ProfileDetail label="Email" value={profile.email} />
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
          {items.length === 0 ? (
            <div className="profile-empty">
              <Package size={40} />
              <h2>No orders yet</h2>
              <p>Items you add to cart will appear here.</p>
              <Link to="/" className="profile-shop-btn">Start Shopping</Link>
            </div>
          ) : (
            <div className="profile-orders">
              <div className="profile-orders-header">
                <span>Current Cart ({items.length} items)</span>
                <strong>${totalPrice.toFixed(2)}</strong>
              </div>
              {items.map((item) => (
                <Link
                  to={`/product/${item.id}`}
                  className="profile-order-item"
                  key={item.id}
                >
                  <img src={item.thumbnail} alt={item.title} />
                  <div className="profile-order-info">
                    <h3>{item.title}</h3>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </Link>
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
