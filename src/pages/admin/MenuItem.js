import React, { useState, useEffect } from "react";
import "../../css/RestaurantAdd.css";
import { useNavigate } from "react-router-dom";

export default function MenuList() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all menu items
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/menu_items`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMenus(data.data || []);
      } else {
        throw new Error("Failed to fetch menu items");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchMenus();
  }, []);

  // ✅ Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this menu item?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`{process.env.REACT_APP_API_URL}/api/menu_items/delete/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Menu item deleted successfully!");
        // ✅ Refresh list automatically
        fetchMenus();
      } else {
        throw new Error(data.message || "Failed to delete menu item.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading menu items...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    // CLASS NAME CHANGE
    <div className="restaurant-list-container"> 
      <div className="list-header">
        <h2 className="list-heading">Menu Item List</h2>
        <button
          // CLASS NAME CHANGE
          className="add-restaurant-btn" 
          onClick={() => navigate("/admin/menuitems/create")}
        >
          ➕ Add new item
        </button>
      </div>

      {menus.length > 0 ? (
        // CLASS NAME CHANGE
        <table className="restaurant-table"> 
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Restaurant</th>
              <th>Item Name</th>
              <th>Details</th>
              <th>Price</th>
              <th>Status</th>
              <th>Type</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((menu, index) => (
              <tr key={menu.id}>
                <td>{index + 1}</td>
                <td>
                  {menu.image ? (
                    <img 
                      src={`${process.env.REACT_APP_API_URL}/storage/${menu.image}`} 
                      alt={menu.item_name} 
                      className="restaurant-image" // New class for image styling
                    />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </td>
                <td className="restaurant-name-cell">{menu.restaurant_name || menu.restaurant?.name || "N/A"}</td>
                <td>{menu.item_name}</td>
                <td className="description-cell">{menu.item_description}</td>
                <td>₹{menu.price}</td>
                <td>
                  {/* Badge for Availability Status */}
                  <span className={`status-badge ${Number(menu.is_available) === 1 ? 'status-available' : 'status-unavailable'}`}>
                    {Number(menu.is_available) === 1 ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td>
                  {/* Badge for Type (Veg/Non-Veg) */}
                  <span className={`type-badge ${menu.type}`}>
                    {menu.type === "veg"
                      ? "Veg"
                      : menu.type === "non_veg"
                      ? "Non-Veg"
                      : "Both"}
                  </span>
                </td>
                <td>
                  {menu.updated_at
                    ? new Date(menu.updated_at).toLocaleDateString() // Use simpler date format
                    : "N/A"}
                </td>
                <td className="action-cell">
                  {/* Action Buttons Group (for circular styling) */}
                  <div className="action-buttons-group">
                    <button
                      // New Action Button Class
                      className="action-btn edit-btn" 
                      onClick={() => navigate(`/admin/menuitems/edit/${menu.id}`)}
                      title="Edit Item"
                    >
                      ✏️
                    </button>
                    <button
                      // New Action Button Class
                      className="action-btn delete-btn" 
                      onClick={() => handleDelete(menu.id)}
                      title="Delete Item"
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
        <p className="no-restaurants-message">No menu items found.</p>
      )}
    </div>
  );
}
