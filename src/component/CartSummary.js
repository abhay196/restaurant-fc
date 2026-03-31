import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { CartContext } from "../context/CartContext";

export default function CartSummary({ subtotal, shipping, discount, total, refreshCart }) {
  const navigate = useNavigate();
  const { fetchCartCount } = useContext(CartContext); // To update navbar badge after checkout

  const handleCheckout = async () => {
    try {
      const response = await api.post("/checkout"); // Uses centralized API

      if (response.data.success) {
        alert("Order placed successfully");
        await fetchCartCount(); // Reset the global cart count badge
        navigate('/');
      } else {
        throw new Error(response.data.message || "Checkout failed");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="cart-summary">
      <h3>Total cart</h3>
      {/* <div className="coupon-box">
        <input type="text" placeholder="Coupon code" />
        <button>Submit</button>
      </div> */}

      <div className="summary-list">
        <p>Subtotal <span>₹{subtotal.toFixed(2)}</span></p>
        <p>Shipping <span>₹{shipping.toFixed(2)}</span></p>
        <p>Discount <span>- ₹{discount.toFixed(2)}</span></p>
      </div>
      {/* <hr /> */}
      <div className="summary-total">
        <p>Total <span>₹{total.toFixed(2)}</span></p>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        Checkout
      </button>
    </div>
  );
}