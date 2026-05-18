import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

export default function CartSummary({ subtotal, shipping, discount, total, refreshCart }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { fetchCartCount } = useContext(CartContext);

  const handleCheckout = async () => {
    // Guest: redirect to login
    if (!token) {
      alert("Please login to place your order. Your cart items will be kept!");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post("/checkout");
      if (response.data.success) {
        alert("Order placed successfully!");
        await fetchCartCount();
        navigate("/");
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

      <div className="summary-list">
        <p>Subtotal <span>₹{subtotal.toFixed(2)}</span></p>
        <p>Shipping <span>₹{shipping.toFixed(2)}</span></p>
        <p>Discount <span>- ₹{discount.toFixed(2)}</span></p>
      </div>

      <div className="summary-total">
        <p>Total <span>₹{total.toFixed(2)}</span></p>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        {token ? "Checkout" : "Login to Checkout"}
      </button>
    </div>
  );
}
