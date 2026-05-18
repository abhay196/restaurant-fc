import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { fetchCartCount, clearGuestCart } = useContext(CartContext);

  const { items = [], subtotal = 0, delivery = 0, tax = 0, total = 0 } = state || {};

  const [name, setName]       = useState("");
  const [phone, setPhone]     = useState("");
  const [email, setEmail]     = useState("");
  const [table, setTable]     = useState("");
  const [note, setNote]       = useState("");
  const [payment, setPayment] = useState("cash");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if (!state || items.length === 0) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
          <p style={{ fontSize: "1.1rem", color: "#7A6E62" }}>No items to checkout.</p>
          <button className="btn" onClick={() => navigate("/")}>Browse Restaurants</button>
        </div>
      </>
    );
  }

  const handlePlaceOrder = async () => {
    if (!name.trim()) { alert("Please enter your name."); return; }
    setPlacing(true);
    try {
      const res = await api.post("/checkout", {
        name, phone, email,
        table_number: table,
        note,
        payment_method: payment,
        items: items.map(i => ({ item_id: i.item_id, qty: i.qty, price: i.price })),
      });
      console.log(res);
      if (res.data.success) {
        setOrderId(res.data.order_id || "FC" + Date.now().toString().slice(-6));
        clearGuestCart();
        await fetchCartCount();
      } else {
        throw new Error(res.data.message || "Checkout failed");
      }
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  if (orderId) {
    return (
      <>
        <Navbar />
        <div className="ck-success">
          <div className="ck-success-icon">✅</div>
          <h2>Order Placed!</h2>
          <div className="ck-order-id"># {orderId}</div>
          <p>Your food is being prepared. Expected wait time is <strong>20–30 minutes</strong>.</p>
          <button className="ck-track-btn" onClick={() => navigate("/")}>← Order More</button>
        </div>
      </>
    );
  }

  // ── FORM ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <button className="back-btn" onClick={() => navigate("/cart")}>← Continue Shopping</button>

      <div className="ck-layout">

        {/* LEFT */}
        <div className="ck-left">
          <div className="ck-card">
            <h3>📍 Delivery Details</h3>
            <div className="ck-form-row">
              <label className="ck-label">Full Name *</label>
              <input className="ck-input" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)} />
            </div>
            <div className="ck-form-grid">
              <div className="ck-form-row">
                <label className="ck-label">Phone</label>
                <input className="ck-input" placeholder="+91 98765 43210" value={phone}
                  onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="ck-form-row">
                <label className="ck-label">Email</label>
                <input className="ck-input" type="email" placeholder="you@email.com" value={email}
                  onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="ck-form-row">
              <label className="ck-label">Table / Seat Number</label>
              <input className="ck-input" placeholder="e.g. Table 12, Seat A" value={table}
                onChange={e => setTable(e.target.value)} />
            </div>
            <div className="ck-form-row">
              <label className="ck-label">Special Instructions</label>
              <textarea className="ck-input" rows={3}
                placeholder="Any allergies or special requests..." value={note}
                onChange={e => setNote(e.target.value)} />
            </div>
          </div>

          <div className="ck-card">
            <h3>💳 Payment Method</h3>
            <div className="ck-pay-group">
              {[
                { val: "upi",  label: "UPI",  sub: "GPay, PhonePe, Paytm" },
                { val: "card", label: "Card", sub: "Debit / Credit" },
                { val: "cash", label: "Cash", sub: "Pay at counter" },
              ].map(opt => (
                <label
                  key={opt.val}
                  className={`ck-pay-option${payment === opt.val ? " selected" : ""}`}
                  onClick={() => setPayment(opt.val)}
                >
                  <input type="radio" name="pay" value={opt.val}
                    checked={payment === opt.val} onChange={() => setPayment(opt.val)} />
                  <div>
                    <div className="ck-pay-label">{opt.label}</div>
                    <div className="ck-pay-sub">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ck-right">
          <div className="ck-summary-card">
            <h3>Order Summary</h3>
            <div className="ck-summary-items">
              {items.map(item => (
                <div className="ck-summary-item" key={item.id || item.item_id}>
                  <span className="ck-item-label">{item.item_name} × {item.qty || 1}</span>
                  <span className="ck-item-val">₹{(Number(item.price) * (item.qty || 1)).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="ck-bill-rows">
              <div className="ck-bill-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="ck-bill-row"><span>Delivery</span><span>₹{delivery.toFixed(2)}</span></div>
              <div className="ck-bill-row"><span>GST (5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="ck-bill-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
            <button className="ck-place-btn" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? "Placing Order..." : "Place Order →"}
            </button>
            <p className="ck-secure">🔒 Secured payment · No extra charges</p>
          </div>
        </div>

      </div>
    </>
  );
}
