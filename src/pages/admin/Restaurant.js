import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function RestaurantAdd() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: "", address: "", phone: "", description: "", is_available: "", type: ""
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      api.get(`/restaurant/show/${id}`).then(res => {
        const r = res.data.data;
        setFormData({ ...r, is_available: r.is_available ? "1" : "0" });
      });
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (image) data.append("image", image);

    try {
      const url = isEditMode ? `/restaurant/edit/${id}` : "/restaurant/create";
      await api.post(url, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate("/admin/restaurant");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="restaurant-add-container">
      <h2>{isEditMode ? "Edit" : "Add"} Restaurant</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        {/* ... Other Inputs ... */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}