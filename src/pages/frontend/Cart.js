import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; // Updated path
import CartItem from "../../component/CartItem"; // Updated path
import CartSummary from "../../component/CartSummary"; // Updated path
import "../../css/Cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get("/cart"); // Uses centralized API utility
      const data = response.data;
      setItems(Array.isArray(data) ? data : (data.data || data.cart_items || []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * (item.qty || 1)), 0);
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (loading) return <div className="loader"></div>;

  return (
    <div className="cart-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Shopping cart</h2>

      <div className="cart-content">
        <div className="cart-items">
          {items.length > 0 ? (
            items.map((item) => <CartItem key={item.id} item={item} />)
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
          refreshCart={fetchCart} // Pass refresh function to summary
        />
      </div>
    </div>
  );
}