import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const GUEST_CART_KEY = "guest_cart";

export const getGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []; }
  catch { return []; }
};
const saveGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
const clearGuestCart = () => localStorage.removeItem(GUEST_CART_KEY);

// Read token directly from localStorage — never from React state
// This avoids the race where context token is null on first mount
const getToken = () => {
  const t = localStorage.getItem("token");
  return t && t !== "undefined" ? t : null;
};

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext); // used only to react to login/logout changes
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    const tok = getToken(); // always read fresh from localStorage
    if (!tok) {
      const items = getGuestCart();
      setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
      return;
    }
    try {
      const res = await api.post("/cart/count");
      setCartCount(res.data.count || 0);
    } catch (err) {
      // Silently fail — don't log 401 spam on every page load
      if (err?.response?.status !== 401) {
        console.error("Error fetching cart count", err);
      }
    }
  }, []); // no dependencies — always reads fresh from localStorage

  // Re-sync whenever token state changes (login / logout)
  useEffect(() => {
    fetchCartCount();
  }, [token, fetchCartCount]);

  const mergeGuestCartToServer = useCallback(async () => {
    const guestItems = getGuestCart();
    if (!guestItems.length) return;
    for (const item of guestItems) {
      try {
        await api.post("/cart", {
          item_id: item.item_id,
          price: item.price,
          qty: item.qty,
          note: item.note || "",
        });
      } catch (err) {
        console.error("Failed to merge guest item", item, err);
      }
    }
    clearGuestCart();
    await fetchCartCount();
  }, [fetchCartCount]);

  const addToCart = async (itemId, price, itemData = {}) => {
    const tok = getToken();
    if (!tok) {
      const cart = getGuestCart();
      const existing = cart.find((i) => i.item_id === itemId);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          item_id: itemId,
          id: itemId,
          item_name: itemData.item_name || "Item",
          item_description: itemData.item_description || "",
          image: itemData.image || "",
          price: Number(price),
          qty: 1,
          note: "",
        });
      }
      saveGuestCart(cart);
      setCartCount(cart.reduce((s, i) => s + i.qty, 0));
      return;
    }
    const res = await api.post("/cart", { item_id: itemId, price, qty: 1 });
    if (res.data.success) await fetchCartCount();
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      fetchCartCount,
      addToCart,
      mergeGuestCartToServer,
      getGuestCart,
      clearGuestCart: () => { clearGuestCart(); fetchCartCount(); },
    }}>
      {children}
    </CartContext.Provider>
  );
};