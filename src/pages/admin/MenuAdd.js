import React, { useState, useEffect } from "react";
import "../../css/Admin.css";
import { useNavigate, useParams } from "react-router-dom";

export default function MenuAdd() {
  const [item_name, setItemName] = useState("");
  const [item_description, setItemDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [restaurantId, setRestaurantId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [menus, setMenus] = useState([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // =========================
  // Fetch Categories
  // =========================
  const fetchMenus = async (restaurant_id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/category/${restaurant_id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setMenus(data.categories || []);
      } else {
        setMenus([]);
      }
    } catch (err) {
      console.error(err);
      setMenus([]);
    }
  };

  // =========================
  // Fetch Restaurants
  // =========================
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/restaurants`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setRestaurants(data.data || []);
        } else {
          setError("Failed to fetch restaurants.");
        }
      } catch (err) {
        setError("Error fetching restaurants.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // =========================
  // Fetch Categories on Restaurant Change
  // =========================
  useEffect(() => {
    if (restaurantId && restaurants.length > 0) {

      fetchMenus(restaurantId);

      const selected = restaurants.find(
        (r) => Number(r.id) === Number(restaurantId)
      );

      if (selected) {
        setType(selected.type || "");
      }
    }
  }, [restaurantId, restaurants]);

  // =========================
  // Fetch Menu Item for Edit
  // =========================
  useEffect(() => {
    if (isEditMode) {
      const fetchMenuItem = async () => {
        try {
          setLoading(true);

          const token = localStorage.getItem("token");

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/api/menu_items/show/${id}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            const r = data.data;

            setItemName(r.item_name || "");
            setItemDescription(r.item_description || "");
            setPrice(r.price || "");
            setRestaurantId(r.restaurant_id || "");
            setCategoryId(r.category_id || "");
            setIsAvailable(r.is_available ? "1" : "0");
          } else {
            setError("Failed to fetch menu item.");
          }
        } catch (err) {
          setError("Error fetching menu item.");
        } finally {
          setLoading(false);
        }
      };

      fetchMenuItem();
    }
  }, [id, isEditMode]);

  // =========================
  // Submit Form
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("item_name", item_name);
      formData.append("item_description", item_description);
      formData.append("price", price);
      formData.append("restaurant_id", restaurantId);
      formData.append("category_id", categoryId);
      formData.append("is_available", isAvailable);
      formData.append("type", type);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      const url = isEditMode
        ? `${process.env.REACT_APP_API_URL}/api/menu_items/edit/${id}`
        : `${process.env.REACT_APP_API_URL}/api/menu_items/create`;

      const response = await fetch(url, {
        method: "POST",
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
        const messages = Object.values(data.errors)
          .flat()
          .join(" ");

        setError(messages);
      } else {
        setError(data.message || "Failed to save menu item.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader-container"><div className="loader"></div></div>;
  }

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
        {/* Restaurant */}

        <select
          value={restaurantId}
          onChange={(e) => {
            setRestaurantId(e.target.value);
            setCategoryId("");
          }}
          required
        >
          <option value="">Select Restaurant</option>

          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        {/* Item Name */}

        <input
          type="text"
          placeholder="Menu Item Name"
          value={item_name}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        {/* Price */}

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        {/* Description */}

        <textarea
          placeholder="Menu Description"
          value={item_description}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />

        {/* Category */}

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">
            {menus.length > 0
              ? "Select Category"
              : "Please select restaurant first"}
          </option>

          {menus.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div className="form-inline-group">
          {/* Availability */}

          <select
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value)}
            required
          >
            <option value="">Select Availability</option>

            <option value="1">Available</option>

            <option value="0">Not Available</option>
          </select>

          {/* Type */}

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

          {/* Image */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <button type="submit" className="submit-btn">
          {isEditMode ? "Update Menu Item" : "Add Menu Item"}
        </button>
      </form>
    </div>
  );
}