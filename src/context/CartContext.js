import React, { createContext, useState, useContext, useCallback } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.post("/cart/count");
      setCartCount(res.data.count || 0);
    } catch (err) {
      console.error("Error fetching cart count", err);
    }
  }, [token]);

  const addToCart = async (itemId, price) => {
    try {
      const res = await api.post("/cart", { item_id: itemId, price, qty: 1 });
      if (res.data.success) {
        await fetchCartCount(); // Update badge immediately
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};