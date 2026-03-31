import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";
import "../../css/Menus.css";

const IMAGE_BASE_URL = "http://localhost:8000/storage/";

export default function Menus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  // Track which specific item is being added
  const [addingItemId, setAddingItemId] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await api.get(`/restaurants/menus/${id}`);
        setMenus(res.data.data.menus || []);
        setRestaurant(res.data.data.restaurant || null);
      } catch (err) {
        console.error("Error fetching menu data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, [id]);

  const handleAddToCart = async (itemId, price) => {
    setAddingItemId(itemId); // Start loading for this specific item
    try {
      await addToCart(itemId, price);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      alert("Could not add item. Please try again.");
    } finally {
      setAddingItemId(null); // Reset after the process is done
    }
  };

  if (loading) {
    return (
      <div className="food-loader-container">
        <div className="bouncing-food">
          <span>🍔</span><span>🍟</span><span>🍕</span>
        </div>
        <p>Cooking up the menu...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      {restaurant && (
        <div className="restaurant-banner">
          {restaurant.image && (
            <img 
              src={`${IMAGE_BASE_URL}${restaurant.image}`} 
              alt={restaurant.name} 
              className="banner-img"
            />
          )}
          <div className="banner-overlay">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.description}</p>
          </div>
        </div>
      )}

      <div className="menu-content-container">
        <div className="menu-header-row">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back to Restaurants
          </button>
        </div>

        <div className="menu-items-grid">
          {menus.map((item) => (
            <div className="menu-card" key={item.id}>
              <div className="menu-item-image-wrapper">
                {item.image ? (
                  <img 
                    src={`${IMAGE_BASE_URL}${item.image}`} 
                    alt={item.item_name} 
                  />
                ) : (
                  <div className="item-image-placeholder">
                    <span>{item.item_name.charAt(0)}</span>
                  </div>
                )}
              </div>
              
              <div className="card-body">
                <div className="card-title-row">
                  <h3>{item.item_name}</h3>
                  <span className="price">₹{item.price}</span>
                </div>
                <p className="description">{item.description || "Delicious and prepared fresh to order."}</p>
                <button
                  className={`add-to-cart-btn ${addingItemId === item.id ? "adding" : ""}`}
                  onClick={() => handleAddToCart(item.id, item.price)}
                  disabled={addingItemId === item.id}
                >
                  {addingItemId === item.id ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}