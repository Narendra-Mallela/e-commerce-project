import React, { createContext, useContext, useMemo, useState } from "react";

const CART_STORAGE_KEY = "shopx-cart";
const CartContext = createContext(null);

function readInitialCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readInitialCart);

  function updateCart(updater) {
    setItems((currentItems) => {
      const nextItems = updater(currentItems);
      saveCart(nextItems);
      return nextItems;
    });
  }

  function addToCart(product) {
    updateCart((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ];
    });
  }

  function changeQuantity(productId, quantity) {
    updateCart((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== productId);
      }

      return currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
    });
  }

  function removeFromCart(productId) {
    updateCart((currentItems) => currentItems.filter((item) => item.id !== productId));
  }

  function clearCart() {
    updateCart(() => []);
  }

  const value = useMemo(() => {
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );

    return {
      items,
      totalQuantity,
      totalPrice,
      addToCart,
      changeQuantity,
      removeFromCart,
      clearCart,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
