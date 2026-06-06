import React, { useEffect, useState } from "react";
import "../../css/RestaurantCards.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import SkeletonCard from "../../component/Skeleton";

const typeEmoji = (type) => {
  if (type === "veg") return "🥗";
  if (type === "non_veg") return "🍗";
  return "🍽️";
};

export default function RestaurantCard({ searchTerm = "", activeFilter = "All" }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurants");
      const data = response.data;
      setRestaurants(data.data || data.restaurants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (r.name || "").toLowerCase();
    const address = (r.address || "").toLowerCase();
    const matchesSearch = name.includes(searchLower) || address.includes(searchLower);

    let matchesFilter = true;
    if (activeFilter === "Veg") {
      // Veg-only: strict veg restaurants (not "both")
      matchesFilter = r.type === "veg";
    } else if (activeFilter === "Non-Veg") {
      // Non-veg: show non_veg AND both (since they serve non-veg too)
      matchesFilter = r.type === "non_veg" || r.type === "both";
    } else if (activeFilter === "Open Now") {
      matchesFilter = Number(r.is_available) === 1;
    }

    return matchesSearch && matchesFilter;
  });

  const handleCardClick = (id) => {
    navigate(`/restaurant/menus/${id}`);
  };

  if (loading) {
    return (
      <div className="restaurant-cards">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <SkeletonCard key={n} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-results">
        <span>⚠️</span>
        Could not load restaurants. Please try again.
      </div>
    );
  }

  return (
    <div className="restaurant-grid">
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => {
          const isOpen = Number(restaurant.is_available) === 1;

          return (
            <div
              key={restaurant.id}
              className="restaurant-card"
              onClick={() => handleCardClick(restaurant.id)}
            >
              {/* Image / Emoji area */}
              <div className="restaurant-image-wrapper">
                {restaurant.image ? (
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="restaurant-image"
                  />
                ) : (
                  <div className="image-placeholder">
                    {typeEmoji(restaurant.type)}
                  </div>
                )}

                <span className={`avail-badge ${isOpen ? "open" : "closed"}`}>
                  {isOpen ? "Open" : "Closed"}
                </span>

                <span className="type-badge">
                  {restaurant.type === "veg"
                    ? "🥬 Veg"
                    : restaurant.type === "non_veg"
                    ? "🍗 Non-Veg"
                    : "🍽️ Both"}
                </span>
              </div>

              {/* Info */}
              <div className="restaurant-info">
                <h3>{restaurant.name}</h3>
                <p className="address">{restaurant.address}</p>

                <div className="restaurant-bottom">
                  <span className="type">
                    {restaurant.type === "veg"
                      ? "🥬 Veg"
                      : restaurant.type === "non_veg"
                      ? "🍗 Non-Veg"
                      : "🍽️ Both"}
                  </span>
                  <span className={`availability ${!isOpen ? "closed-text" : ""}`}>
                    {isOpen ? "● Open Now" : "● Closed"}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="no-results">
          <span>🔍</span>
          No restaurants found
          {searchTerm ? ` matching "${searchTerm}"` : ""}.
        </div>
      )}
    </div>
  );
}