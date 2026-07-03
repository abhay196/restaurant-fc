import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../css/Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext); 

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "❮" : "❯"}
      </button>
      <div className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        
        {user && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="profile-info">
              <span className="profile-name">{user.name}</span>
              <span className="profile-role">{user.role?.replace('_', ' ')}</span>
            </div>
          </div>
        )}

        <ul>
          <li className={location.pathname === "/admin" ? "active" : ""}>
            <Link to="/admin">🏠 <span>Dashboard</span></Link>
          </li>

          {/* 🛡️ Only Super Admin can see Restaurants and User List */}
          {user?.role === "super_admin" && (
            <>
              <li className={location.pathname.includes("/admin/restaurant") ? "active" : ""}>
                <Link to="/admin/restaurant">🍴 <span>Restaurants</span></Link>
              </li>
              <li className={location.pathname === "/admin/users" ? "active" : ""}>
                <Link to="/admin/users">👤 <span>Users</span></Link>
              </li>
              <li className={location.pathname === "/admin/members" ? "active" : ""}>
                <Link to="/admin/members">👥 <span>Members</span></Link>
              </li>
            </>
          )}

          {/* 🚪 Managers and Super Admin can manage Menu Items */}
          {(user?.role === "super_admin" || user?.role === "manager") && (
            <>
              <li className={location.pathname.includes("/admin/categories") ? "active" : ""}>
                <Link to="/admin/categories">🥘 <span>Categories</span></Link>
              </li>
              <li className={location.pathname.includes("/admin/menuitems") ? "active" : ""}>
                <Link to="/admin/menuitems">🥘 <span>Menu Items</span></Link>
              </li>
            </>
          )}

          {/* 📦 Everyone (Admin, Manager, Chef) sees Orders */}
          <li className={location.pathname === "/admin/orders" ? "active" : ""}>
            <Link to="/admin/orders">📦 <span>Orders</span></Link>
          </li>

          <li>
            <button onClick={logout} className="logout-link">
              🚪 <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}