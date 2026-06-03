import React, { createContext, useContext, useMemo, useState } from "react";

const KEY = "shopx-profile";
const ProfileContext = createContext(null);

function readProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? defaultProfile();
  } catch {
    return defaultProfile();
  }
}

function defaultProfile() {
  return {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  };
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(readProfile);

  function saveProfile(updates) {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function resetProfile() {
    const blank = defaultProfile();
    localStorage.setItem(KEY, JSON.stringify(blank));
    setProfile(blank);
  }

  const value = useMemo(
    () => ({ profile, saveProfile, resetProfile }),
    [profile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be inside ProfileProvider");
  return ctx;
}
