import React, { createContext, useState, useCallback } from "react";

export const CartContext = createContext();

const GUEST_CART_KEY = "guest_cart";

export const getGuestCart = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || []; }
  catch { return []; }
};
const saveGuestCart = (items) => localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
const clearGuestCart = () => localStorage.removeItem(GUEST_CART_KEY);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(
    () => getGuestCart().reduce((s, i) => s + (i.qty || 1), 0)
  );

  const fetchCartCount = useCallback(() => {
    const count = getGuestCart().reduce((s, i) => s + (i.qty || 1), 0);
    setCartCount(count);
  }, []);

  const addToCart = (itemId, price, itemData = {}) => {
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
  };
  const setGuestCart = (items) => {
    saveGuestCart(items);
    setCartCount(items.reduce((s, i) => s + (i.qty || 1), 0));
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      fetchCartCount,
      addToCart,
      setGuestCart,          // ← add this
      getGuestCart,
      mergeGuestCartToServer: () => {},
      clearGuestCart: () => { clearGuestCart(); setCartCount(0); },
    }}>
      {children}
    </CartContext.Provider>
  );
};