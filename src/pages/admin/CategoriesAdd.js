import React, { useState, useEffect } from "react"; // Added useEffect to imports
import "../../css/RestaurantAdd.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function MenuAdd() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [restaurantId, setRestaurantId] = useState(""); // Standardized naming
  const [restaurants, setRestaurants] = useState([]); // 1. Added state for list
  const navigate = useNavigate();

  console.log('--------------');
  console.log(restaurantId);
  const fetchRestaurants = async () => {
    try {
      // 2. Capture the data from the response
      const response = await api.get("/restaurants"); // Changed /cart to /restaurants assuming that's your endpoint
      setRestaurants(response.data.data || response.data); 
    } catch (err) {
      console.error("Load error", err);
      setError("Failed to load restaurants.");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("restaurant_id", restaurantId); // 3. Added ID to form data

      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/category/create`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        navigate("/admin/categories");
      } else {
        setError(data.message || "Failed to save category.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="restaurant-add-container">
      <h2 className="form-title">Add Category</h2>
      
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="restaurant-form">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* 4. Fixed the select logic */}
        <select
            value={restaurantId} // This ties the component to the state
            onChange={(e) => {
              console.log("Selected ID:", e.target.value); // Debugging log
              setRestaurantId(e.target.value);
            }}
            required
          >
            <option value="">Select restaurant</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>

        <button type="submit" className="submit-btn">
          Add new category
        </button>
      </form>
    </div>
  );
}