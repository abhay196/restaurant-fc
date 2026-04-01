import React, { useState , useEffect} from "react";
import CartItem from "../../component/CartItem";
import CartSummary from "../../component/CartSummary";
import "../css/Cart.css";
import { useNavigate } from "react-router-dom"; // <== Add this import

export default function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const [items] = useState([
  //   {
  //     id: 1,
  //     name: "Trendy Skirt Set for Women",
  //     color: "Blue",
  //     size: "S",
  //     price: 39.5,
  //     qty: 1,
  //     img: "https://via.placeholder.com/120x150",
  //   },
  //   {
  //     id: 2,
  //     name: "Trendy Men's Sneakers",
  //     color: "White",
  //     size: "L",
  //     price: 99.5,
  //     qty: 1,
  //     img: "https://via.placeholder.com/120x150",
  //   },
  // ]);

  useEffect(() => {
      fetchCart();
    }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("{process.env.REACT_APP_API_URL}/api/cart", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch restaurants");

      const data = await response.json();
      // console.log(data);
      // console.log("API returned:", data);
      setItems(Array.isArray(data) ? data : (data.data || data.items || data.cart_items || []));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + Number(item.price), 0);

  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  return (
    <div className="cart-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Shopping cart</h2>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          total={total}
        />
      </div>
    </div>
  );
}
