import React, { useState, useEffect } from "react";
import "../css/RestaurantList.css";
import { useNavigate } from "react-router-dom";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/restaurants`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch restaurants");

      const data = await response.json();
      setRestaurants(data.data || data.restaurants || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete restaurant
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/restaurants/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }

      // Remove deleted restaurant from state
      setRestaurants(restaurants.filter((r) => r.id !== id));
      alert("Restaurant deleted successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading)
  return (
    <div className="loader-container">
      <div className="loader"></div>
    </div>
  );
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="restaurant-list-container">
      <div className="list-header">
        <h2 className="list-heading">Restaurant List</h2>
        <button
          className="add-restaurant-btn" // CLASS NAME CHANGE for better styling
          onClick={() => navigate("/admin/restaurant/create")}
        >
          {/* Using an emoji/icon for visual appeal */}
          ➕ Add new restaurant
        </button>
      </div>

      {restaurants.length > 0 ? (
        <table className="restaurant-table"> {/* CLASS NAME CHANGE */}
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th> {/* Renaming headers for simplicity */}
              <th>Name</th>
              <th>Location</th> {/* Changed Address to Location */}
              <th>Details</th> {/* Changed Description to Details */}
              <th>Status</th> {/* Changed Available to Status */}
              <th>Cuisine</th> {/* Changed Type to Cuisine */}
              <th>Updated</th> {/* Changed Last Updated At to Updated */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant, index) => (
              <tr key={restaurant.id}>
                <td>{index + 1}</td>
                <td>
                  {/* Better Image handling with aspect ratio and fallback */}
                  {restaurant.image ? (
                    <img 
                      src={`${process.env.REACT_APP_API_URL}/storage/${restaurant.image}`} 
                      alt={restaurant.name} 
                      className="restaurant-image" // New class for image styling
                    />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </td>
                <td className="restaurant-name-cell">{restaurant.name}</td>
                <td>{restaurant.address}</td>
                <td className="description-cell">{restaurant.description}</td>
                <td>
                  <span className={`status-badge ${Number(restaurant.is_available) === 1 ? 'status-available' : 'status-unavailable'}`}>
                    {Number(restaurant.is_available) === 1 ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td>
                  <span className={`type-badge ${restaurant.type}`}>
                    {restaurant.type === "veg" ? "Veg" : restaurant.type === "non_veg" ? "Non-Veg" : "Both"}
                  </span>
                </td>
                <td>
                  {restaurant.updated_at
                    ? new Date(restaurant.updated_at).toLocaleDateString() // Use simpler date format
                    : "N/A"}
                </td>
                <td className="action-cell">
                  {/* Use a wrapper for grouping buttons */}
                  <div className="action-buttons-group">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => navigate(`/admin/restaurant/edit/${restaurant.id}`)}
                      title="Edit Restaurant"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(restaurant.id)}
                      title="Delete Restaurant"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-restaurants-message">No restaurants found.</p>
      )}
    </div>
  );
}
