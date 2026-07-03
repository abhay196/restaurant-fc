import React, { useState, useEffect } from "react";
import "../../css/Admin.css";
import { useNavigate } from "react-router-dom";

export default function Categories() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setMenus(data.categories || []);
      } else {
        throw new Error("Failed to categories");
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

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="restaurant-list-container"><p className="error-message">Error: {error}</p></div>;

  return (
    // CLASS NAME CHANGE
    <div className="restaurant-list-container"> 
      <div className="list-header">
        <h2 className="list-heading">Categories List</h2>
        <button
          // CLASS NAME CHANGE
          className="add-restaurant-btn" 
          onClick={() => navigate("/admin/categories/create")}
        >
          ➕ Add new item
        </button>

      </div>
        {menus.length > 0 ? (
          <table className="user-table"> 
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Restaurant name</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu, index) => (
                <tr key={menu.id}>
                  <td>{index + 1}</td>
                  <td>{menu.name}</td>
                  <td>{menu.restaurant.name}</td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
          <p className="no-restaurants-message">No categories found.</p>
        )}
    </div>
  );
}
