import React, { useEffect, useState } from "react";
import "../../css/Admin.css"; // Fixed path
import api from "../../api/api"; // Use centralized API
import { useNavigate } from "react-router-dom";

function Orders() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/orders");
        setUsers(response.data.data || response.data.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="loader-container"><div className="loader"></div></div>;
  if (error) return <div className="user-list-container"><p className="error-message">Error: {error}</p></div>;

  return (
    <div className="user-list-container">
      <h2>Order List</h2>
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              const getStatusClass = (status) => {
                switch (status?.toLowerCase()) {
                  case "completed":
                  case "delivered":
                    return "status-available";
                  case "pending":
                    return "both";
                  case "returned":
                  default:
                    return "status-unavailable";
                }
              };

              return (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td className="restaurant-name-cell">{user.user ? user.user.name : "Unknown User"}</td>
                  <td>{user.user ? user.user.email : "N/A"}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => navigate(`/admin/order/${user.id}`)}
                        title="Edit Order"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                  <td>{user.updated_at ? new Date(user.updated_at).toLocaleString() : "N/A"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}

export default Orders;