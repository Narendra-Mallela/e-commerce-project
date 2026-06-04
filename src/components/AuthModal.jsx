import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ open, onClose }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setError("");
      setForm({ name: "", email: "", password: "" });
      setMode("login");
      setShowPass(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function switchMode(next) {
    setMode(next);
    setError("");
    setForm({ name: "", email: "", password: "" });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result =
      mode === "login"
        ? login(form.email.trim(), form.password)
        : signup(form.name.trim(), form.email.trim(), form.password);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  }

  return (
    <div className="auth-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-modal="true" aria-label={mode === "login" ? "Sign in" : "Create account"}>
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="auth-modal-brand">
          <span className="topbar-brand-dot" />
          ShopX
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab-btn${mode === "login" ? " active" : ""}`}
            onClick={() => switchMode("login")}
          >
            Sign In
          </button>
          <button
            className={`auth-tab-btn${mode === "signup" ? " active" : ""}`}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <div className="auth-input-wrap">
                <User size={16} />
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={16} />
              <input
                id="auth-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete={mode === "login" ? "username" : "email"}
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password">Password</label>
            <div className="auth-input-wrap">
              <Lock size={16} />
              <input
                id="auth-password"
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
                required
                minLength={mode === "signup" ? 6 : 1}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="auth-show-pass"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="auth-switch-link"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
