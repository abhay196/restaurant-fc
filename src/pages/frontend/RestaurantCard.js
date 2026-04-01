import React, { useEffect, useState } from "react";
import "../../css/RestaurantCards.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api"; 
import SkeletonCard from "../../component/Skeleton";

export default function RestaurantCard({ searchTerm = "" }) { // Default to empty string
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

  // The logic to filter the list based on the prop from Home.js
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (restaurant.name || "").toLowerCase();
    const address = (restaurant.address || "").toLowerCase();

    return name.includes(searchLower) || address.includes(searchLower);
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
  
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="restaurant-cards">
      {filteredRestaurants.length > 0 ? (
        filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="restaurant-card"
            onClick={() => handleCardClick(restaurant.id)}
          >
            {restaurant.image ? (
              <img 
                src={`{process.env.REACT_APP_API_URL}/storage/${restaurant.image}`} 
                alt={restaurant.name} 
                className="restaurant-image"
              />
            ) : (
              <div className="image-placeholder">No Image</div>
            )}

            <div className="restaurant-info">
              <h3>{restaurant.name}</h3>
              <p className="address">{restaurant.address}</p>

              <span className="type">
                {restaurant.type === "veg" ? "Veg" :
                restaurant.type === "non_veg" ? "Non Veg" : "Both"}
              </span>

              <p className="availability">
                {Number(restaurant.is_available) === 1
                  ? "Available ✅"
                  : "Currently Closed ❌"}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="no-results">No restaurants found matching "{searchTerm}"</p>
      )}
    </div>
  );
}