import React, { createContext, useContext, useMemo, useState } from "react";

const USERS_KEY = "shopx-users";
const SESSION_KEY = "shopx-session";
const AuthContext = createContext(null);

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) ?? null;
  } catch {
    return null;
  }
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  function signup(name, email, password) {
    const users = readUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: "An account with this email already exists." };
    }
    const newUser = { name, email: email.toLowerCase(), password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const session = { name, email: email.toLowerCase() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }

  function login(email, password) {
    const users = readUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) {
      return { error: "Invalid email or password." };
    }
    const session = { name: found.name, email: found.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, signup, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
