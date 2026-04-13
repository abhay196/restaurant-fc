import React, { useState, useEffect } from "react";
import "../../css/RestaurantAdd.css";
import { useNavigate, useParams } from "react-router-dom";

export default function MenuAdd() {
  const [item_name, setItemName] = useState("");
  const [item_description, setItemDescription] = useState("");
  const [price, setPrice] = useState("");
//   const [address, setAddress] = useState("");
  // const [phone, setPhone] = useState("");
  // const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Get id from URL

  const isEditMode = Boolean(id); // ✅ Determine mode

  // ✅ Fetch restaurant data if editing
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/restaurants`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setRestaurants(data.data || []);
        } else {
          setError("Failed to fetch restaurant list.");
        }
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {
    if (restaurantId && restaurants.length > 0) {
      const selected = restaurants.find((r) => r.id === parseInt(restaurantId));
      if (selected) {
        setType(selected.type || "");
      }
    }
  }, [restaurantId, restaurants]);

  useEffect(() => {
      if (isEditMode) {
        const fetchRestaurant = async () => {
          try {
            setLoading(true);
            const token = localStorage.getItem("token");
  
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/menu_items/show/${id}`, {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            });
  
            const data = await response.json();
  
            if (response.ok && data.success) {
              const r = data.data;
              setItemName(r.item_name || "");
              setItemDescription(r.item_description || "");
              setPrice(r.price || "");
              setRestaurantId(r.restaurant_id || "");
              setIsAvailable(r.is_available ? "1" : "0");
            } else {
              setError("Failed to fetch restaurant details.");
            }
          } catch (err) {
            setError("An error occurred while fetching data.");
          } finally {
            setLoading(false);
          }
        };
  
        fetchRestaurant();
      }
    }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("item_description", item_description);
      formData.append("item_name", item_name);
      formData.append("price", price);
      formData.append("restaurant_id", restaurantId);
      formData.append("is_available", isAvailable);

    //   formData.append("address", address);
    //   formData.append("phone", phone);
    //   formData.append("description", description);
    //   formData.append("is_available", isAvailable);
      formData.append("type", type);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");

      const url = isEditMode
        ? `${process.env.REACT_APP_API_URL}/api/menu_items/edit/${id}`
        : `${process.env.REACT_APP_API_URL}/api/menu_items/create`;

      const method = isEditMode ? "POST" : "POST"; // If your backend uses PUT/PATCH, update accordingly

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate("/admin/menuitems");
      } else if (response.status === 422 && data.errors) {
        const messages = Object.values(data.errors).flat().join(" ");
        setError(messages);
      } else {
        setError(data.message || "Failed to save restaurant. Try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="restaurant-add-container">
      <h2 className="form-title">
        {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
      </h2>

      {error && <p className="error-message">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="restaurant-form"
        encType="multipart/form-data"
      >

        <select
          value={restaurantId}
          onChange={(e) => setRestaurantId(e.target.value)}
          required
        >
          <option value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Menu Item Name"
          value={item_name}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <textarea
          placeholder="Menu Description"
          value={item_description}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />

        <div className="form-inline-group">
          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value)}
            required
          >
            <option value="">Select Availability</option>
            <option value="1">Available</option>
            <option value="0">Not Available</option>
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="veg">Veg</option>
            <option value="non_veg">Non-Veg</option>
            <option value="both">Both</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-btn">
          {isEditMode ? "Update Menu item" : "Add Menu item"}
        </button>
      </form>
    </div>
  );
}