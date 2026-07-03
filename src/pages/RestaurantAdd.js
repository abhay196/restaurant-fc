import React, { useState, useEffect } from "react";
import "../css/Admin.css";
import { useNavigate, useParams } from "react-router-dom";

export default function RestaurantAdd() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // ✅ Get id from URL

  const isEditMode = Boolean(id); // ✅ Determine mode

  // ✅ Fetch restaurant data if editing
  useEffect(() => {
    if (isEditMode) {
      const fetchRestaurant = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("token");

          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/restaurant/show/${id}`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const data = await response.json();

          if (response.ok && data.success) {
            const r = data.data;
            setName(r.name || "");
            setAddress(r.address || "");
            setPhone(r.phone || "");
            setDescription(r.description || "");
            setIsAvailable(r.is_available ? "1" : "0");
            setType(r.type || "");
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
      formData.append("name", name);
      formData.append("address", address);
      formData.append("phone", phone);
      formData.append("description", description);
      formData.append("is_available", isAvailable);
      formData.append("type", type);
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");
      if (isEditMode) {
          formData.append("_method", "PUT"); 
      }

      const url = isEditMode
        ? `${process.env.REACT_APP_API_URL}/api/restaurant/edit/${id}`
        : `${process.env.REACT_APP_API_URL}/api/restaurant/create`;

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
        navigate("/admin/restaurant");
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

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;

  return (
    <div className="restaurant-add-container">
      <h2 className="form-title">
        {isEditMode ? "Edit Restaurant" : "Add Restaurant"}
      </h2>

      {error && <p className="error-message">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="restaurant-form"
        encType="multipart/form-data"
      >
        <input
          type="text"
          placeholder="Restaurant Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          {isEditMode ? "Update Restaurant" : "Add Restaurant"}
        </button>
      </form>
    </div>
  );
}
