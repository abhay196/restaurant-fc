import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import api from "../api/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

// ─── helpers for guest localStorage cart ────────────────────────────────────
const GUEST_CART_KEY = "guest_cart";

export const getGuestCart = () => {
  try {
    return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};
// ────────────────────────────────────────────────────────────────────────────

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  // ── count helpers ──────────────────────────────────────────────────────────
  const countGuest = useCallback(() => {
    const items = getGuestCart();
    return items.reduce((sum, i) => sum + (i.qty || 1), 0);
  }, []);

  const fetchCartCount = useCallback(async () => {
    if (!token) {
      setCartCount(countGuest());
      return;
    }
    try {
      const res = await api.post("/cart/count");
      setCartCount(res.data.count || 0);
    } catch (err) {
      console.error("Error fetching cart count", err);
    }
  }, [token, countGuest]);

  // Re-sync count whenever auth state changes
  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  // ── merge guest cart into server cart after login ─────────────────────────
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

  // ── addToCart ─────────────────────────────────────────────────────────────
  const addToCart = async (itemId, price, itemData = {}) => {
    if (!token) {
      // Guest: store in localStorage
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

    // Logged-in: send to server
    try {
      const res = await api.post("/cart", { item_id: itemId, price, qty: 1 });
      if (res.data.success) {
        await fetchCartCount();
      }
    } catch (err) {
      throw err;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
        addToCart,
        mergeGuestCartToServer,
        getGuestCart,
        clearGuestCart: () => { clearGuestCart(); fetchCartCount(); },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
