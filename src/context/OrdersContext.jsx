import React, { createContext, useContext, useMemo, useState } from "react";

const KEY = "shopx-orders";
const OrdersContext = createContext(null);

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(readOrders);

  function addOrder(order) {
    setOrders((current) => {
      const next = [order, ...current];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }

  const value = useMemo(() => ({ orders, addOrder }), [orders]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be inside OrdersProvider");
  return ctx;
}
