import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";
import "../../css/Cart.css";
import SafeImage from "../../component/SafeImage";

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { getGuestCart, setGuestCart, fetchCartCount } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCart(); }, [token]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      setItems(getGuestCart());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = (itemId, delta) => {
    setItems(prev => {
      const updated = prev
        .map(i => (i.id || i.item_id) === itemId ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) } : i)
        .filter(i => (i.qty || 1) > 0);
      setGuestCart(updated);   // persist to localStorage / context
      fetchCartCount();
      return updated;
    });
  };

  // const removeItem = (itemId) => {
  //   setItems(prev => {
  //     const updated = prev.filter(i => (i.id || i.item_id) !== itemId);
  //     setGuestCart(updated);
  //     fetchCartCount();
  //     return updated;
  //   });
  // };

  const subtotal = items.reduce((s, i) => s + Number(i.price) * (i.qty || 1), 0);
  const delivery = items.length ? 29 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  if (loading) return <><Navbar /><div className="loader"></div></>;

  return (
    <>
      <Navbar />
      <div className="cart-page-wrap">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2 className="cart-page-title">Your Order 🛒</h2>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some items from our restaurants.</p>
            <button className="btn" onClick={() => navigate("/")}>Browse Restaurants</button>
          </div>
        ) : (
          <div className="cart-page-layout">
            {/* ── LEFT: items ── */}
            <div className="cart-items-col">
              {items.map((item) => {
                const itemId = item.id || item.item_id;
                return (
                  <div className="cart-line-item" key={itemId}>
                    <SafeImage src={item.image} alt={item.item_name} className="cart-line-img" />

                    <div className="cart-line-info">
                      <div className="cart-line-name">{item.item_name}</div>
                      {item.item_description && (
                        <div className="cart-line-desc">{item.item_description}</div>
                      )}
                      <div className="cart-line-price">₹{item.price} × {item.qty || 1}</div>
                    </div>

                    {/* ── Qty Controls ── */}
                    <div className="cart-qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(itemId, -1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="qty-value">{item.qty || 1}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(itemId, +1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>

                    <div className="cart-line-subtotal">
                      ₹{(Number(item.price) * (item.qty || 1)).toFixed(2)}
                    </div>

                    {/* <button
                      className="cart-remove-btn"
                      onClick={() => removeItem(itemId)}
                      aria-label="Remove item"
                    >🗑</button> */}
                  </div>
                );
              })}
            </div>

            {/* ── RIGHT: bill summary ── */}
            <div className="cart-summary-col">
              <div className="cart-bill-card">
                <h3>Bill Summary</h3>
                <div className="bill-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="bill-row"><span>Delivery</span><span>₹{delivery.toFixed(2)}</span></div>
                <div className="bill-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                <div className="bill-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>

                <button
                  className="proceed-btn"
                  onClick={() => navigate("/checkout", { state: { items, subtotal, delivery, tax, total } })}
                >
                  Proceed to Checkout →
                </button>
                <p className="secure-note">🔒 Secure checkout · No hidden charges</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}