import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";
import "../../css/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { getGuestCart, fetchCartCount } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCart(); }, [token]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      // if (!token) {
        setItems(getGuestCart());
      // } else {
      //   const res = await api.get("/cart");
      //   const data = res.data;
      //   setItems(Array.isArray(data) ? data : data.data || data.cart_items || []);
      // }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* {!token && (
          <div className="cart-guest-banner">
            🛒 Browsing as guest — cart saved locally.{" "}
            <Link to="/login">Login</Link> to save your order.
          </div>
        )} */}

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
              {items.map((item) => (
                <div className="cart-line-item" key={item.id || item.item_id}>
                  {item.image ? (
                    <img
                      src={`${item.image}`}
                      alt={item.item_name}
                      className="cart-line-img"
                    />
                  ) : (
                    <div className="cart-line-emoji">🍽️</div>
                  )}
                  <div className="cart-line-info">
                    <div className="cart-line-name">{item.item_name}</div>
                    {item.item_description && (
                      <div className="cart-line-desc">{item.item_description}</div>
                    )}
                    <div className="cart-line-price">₹{item.price} × {item.qty || 1}</div>
                  </div>
                  <div className="cart-line-subtotal">
                    ₹{(Number(item.price) * (item.qty || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
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
