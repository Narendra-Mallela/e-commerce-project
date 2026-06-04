import React, { createContext, useContext, useMemo, useState } from "react";

const KEY = "shopx-wishlist";
const WishlistContext = createContext(null);

function readWishlist() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(readWishlist);

  function updateWishlist(updater) {
    setItems((current) => {
      const next = updater(current);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  function addToWishlist(product) {
    updateWishlist((current) => {
      if (current.find((i) => i.id === product.id)) return current;
      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          category: product.category,
          rating: product.rating,
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    updateWishlist((current) => current.filter((i) => i.id !== productId));
  }

  const value = useMemo(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      isWishlisted: (id) => items.some((i) => i.id === id),
    }),
    [items],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
