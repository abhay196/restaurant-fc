import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";
import "../../css/Menus.css";

// Base URL for your menu images specifically
const CLOUDINARY_MENU_BASE = "https://res.cloudinary.com/dkwsaccn9/image/upload/v1776707111/";

export default function Menus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Logic to group menus by category name
  const groupedMenus = menus.reduce((acc, item) => {
    const categoryName = item.category ? item.category.name : "Other Items";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  const handleAddToCart = async (itemId, price) => {
    setAddingItemId(itemId);
    try {
      await addToCart(itemId, price);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      alert("Could not add item. Please try again.");
    } finally {
      setAddingItemId(null);
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
              src={restaurant.image} /* Already a full URL from your DB */
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

        {/* Iterate over Categories */}
        {/* Extract category names, sort them, and ensure "Other Items" is last */}
        {Object.keys(groupedMenus)
          .sort((a, b) => {
            if (a === "Other Items") return 1;  // Move 'Other Items' to the end
            if (b === "Other Items") return -1; // Keep 'Other Items' at the end
            return a.localeCompare(b);         // Sort remaining categories alphabetically
          })
          .map((categoryName) => (
            <div key={categoryName} className="category-section">
              <h2 className="category-title-display">{categoryName}</h2>
              
              <div className="menu-items-grid">
                {groupedMenus[categoryName].map((item) => (
                  <div className="menu-card" key={item.id}>
                    <div className="menu-item-image-wrapper">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.item_name} 
                          className="restaurant-image"
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
                      <p className="description">
                        {item.item_description || "Delicious and prepared fresh to order."}
                      </p>
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
        ))}
      </div>
    </div>
  );
}