import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { CartContext } from "../../context/CartContext";
import Navbar from "./Navbar";
import "../../css/Menus.css";

export default function Menus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGuestCart, addToCart, setGuestCart } = useContext(CartContext);

  const [menus, setMenus] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingItemId, setAddingItemId] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionRefs = useRef({});
  const [cartItems, setItems] = useState([]);

  // ── toast state ──────────────────────────────────────────
  const [toast, setToast] = useState({ msg: "", show: false });
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  };
  // ─────────────────────────────────────────────────────────

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

  // ── sync guest cart only on mount / when restaurant changes ──
  useEffect(() => {
    setItems(getGuestCart());
  }, [id]);

  const updateQty = (itemId, delta) => {
    setItems(prev => {
      const updated = prev
        .map(i => (i.id || i.item_id) === itemId ? { ...i, qty: Math.max(0, (i.qty || 1) + delta) } : i)
        .filter(i => (i.qty || 1) > 0);
      setGuestCart(updated); // persist to localStorage / context
      return updated;
    });
  };

  const groupedMenus = menus.reduce((acc, item) => {
    const categoryName = item.category ? item.category.name : "Other Items";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedMenus).sort((a, b) => {
    if (a === "Other Items") return 1;
    if (b === "Other Items") return -1;
    return a.localeCompare(b);
  });

  useEffect(() => {
    if (sortedCategories.length > 0 && !activeCategory) {
      setActiveCategory(sortedCategories[0]);
    }
  }, [sortedCategories.length]);

  const handleAddToCart = async (item) => {
    setAddingItemId(item.id);
    try {
      await addToCart(item.id, item.price, item);
      setItems(getGuestCart()); // sync local cart state immediately
      showToast(`${item.item_name} added!`);
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      alert("Could not add item. Please try again.");
    } finally {
      setAddingItemId(null);
    }
  };

  const scrollToSection = (cat) => {
    setActiveCategory(cat);
    const el = sectionRefs.current[cat];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const allItems = menus;
  const minPrice = allItems.length ? Math.min(...allItems.map((i) => i.price)) : 0;
  const maxPrice = allItems.length ? Math.max(...allItems.map((i) => i.price)) : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="food-loader-container">
          <div className="bouncing-food">
            <span>🍔</span><span>🍟</span><span>🍕</span>
          </div>
          <p>Cooking up the menu...</p>
        </div>
      </>
    );
  }

  const isOpen = restaurant ? Number(restaurant.is_available) === 1 : false;

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── TOAST ── */}
      <div className={`cart-notif${toast.show ? " show" : ""}`}>
        ✓ {toast.msg}
      </div>

      {/* ── HERO BANNER ── */}
      <div className="restaurant-banner">
        {restaurant?.image ? (
          <>
            <img src={restaurant.image} alt={restaurant.name} className="banner-img" />
            <div className="banner-overlay">
              <h1>{restaurant?.name}</h1>
              {restaurant?.description && <p>{restaurant.description}</p>}
            </div>
          </>
        ) : (
          <span className="banner-emoji">
            {restaurant?.type === "veg" ? "🥗" : restaurant?.type === "non_veg" ? "🍗" : "🍽️"}
          </span>
        )}
      </div>

      {/* ── DETAIL INFO ── */}
      {restaurant && (
        <div className="detail-info-section">
          <div className="detail-name">{restaurant.name}</div>
          <div className="detail-tags">
            <span className={`badge badge-${isOpen ? "open" : "closed"}`}>
              {isOpen ? "Open" : "Closed"}
            </span>
            <span className={`badge badge-${restaurant.type === "veg" ? "veg" : "nonveg"}`}>
              {restaurant.type === "veg" ? "🥬 Veg" : restaurant.type === "non_veg" ? "🍗 Non-Veg" : "🍽️ Both"}
            </span>
            {restaurant.address && (
              <span className="badge badge-cuisine">📍 {restaurant.address}</span>
            )}
          </div>
          {restaurant.description && (
            <p style={{ color: "#7A6E62", fontSize: "0.92rem", maxWidth: 560, lineHeight: 1.65 }}>
              {restaurant.description}
            </p>
          )}
        </div>
      )}

      {/* ── INFO BAR ── */}
      <div className="detail-info-bar">
        <div className="info-bar-tile">
          <div className="info-bar-icon">📋</div>
          <div>
            <div className="info-bar-label">Menu Items</div>
            <div className="info-bar-val">{allItems.length} items</div>
          </div>
        </div>
        <div className="info-bar-tile">
          <div className="info-bar-icon">🏷️</div>
          <div>
            <div className="info-bar-label">Price Range</div>
            <div className="info-bar-val">{allItems.length ? `₹${minPrice} – ₹${maxPrice}` : "–"}</div>
          </div>
        </div>
        <div className="info-bar-tile">
          <div className="info-bar-icon">🍽️</div>
          <div>
            <div className="info-bar-label">Categories</div>
            <div className="info-bar-val">{sortedCategories.length} categories</div>
          </div>
        </div>
        <div className="info-bar-tile">
          <div className="info-bar-icon">{isOpen ? "✅" : "⏸️"}</div>
          <div>
            <div className="info-bar-label">Status</div>
            <div className="info-bar-val">{isOpen ? "Accepting Orders" : "Unavailable"}</div>
          </div>
        </div>
      </div>

      {/* ── MENU LAYOUT ── */}
      <div className="menu-content-container">
        <aside className="menu-sidebar">
          <h3>Menu</h3>
          {sortedCategories.map((cat) => (
            <button
              key={cat}
              className={`menu-cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => scrollToSection(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <div className="menu-main">
          <div className="menu-header-row">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back to Restaurants
            </button>
          </div>

          {sortedCategories.map((categoryName) => (
            <div
              key={categoryName}
              className="menu-section"
              ref={(el) => (sectionRefs.current[categoryName] = el)}
              id={`section-${categoryName.replace(/\s/g, "_")}`}
            >
              <div className="menu-section-title">{categoryName}</div>
              <div className="menu-items">
                {groupedMenus[categoryName].map((item) => {
                  const cartItem = cartItems.find((ci) => (ci.id || ci.item_id) === item.id);
                  return (
                    <div className="menu-card" key={item.id}>
                      <div className="menu-item-image-wrapper">
                        {item.image ? (
                          <img src={item.image} alt={item.item_name} />
                        ) : (
                          <div className="item-image-placeholder">
                            {item.item_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="card-body">
                        <div className="card-title-row">
                          <h3>{item.item_name}</h3>
                          <span className="price">₹{item.price} x {(cartItem && cartItem.qty > 0) ? cartItem.qty : 1}</span>
                        </div>
                        <p className="description">
                          {item.item_description || "Freshly prepared and delicious."}
                        </p>
                        {cartItem && cartItem.qty > 0 ? (
                          <div className="cart-qty-controls">
                            <button
                              className="qty-btn"
                              onClick={() => updateQty(item.id, +1)}
                              aria-label="Increase quantity"
                            >+</button>
                            <span className="qty-value">{cartItem.qty}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQty(item.id, -1)}
                              aria-label="Decrease quantity"
                            >−</button>
                          </div>
                        ) : (
                          <button
                            className={`add-to-cart-btn ${addingItemId === item.id ? "adding" : ""}`}
                            onClick={() => handleAddToCart(item)}
                            disabled={addingItemId === item.id}
                          >
                            {addingItemId === item.id ? "Adding..." : "+ Add to Cart"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {sortedCategories.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#7A6E62" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🍽️</div>
              <p>No menu items available yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}