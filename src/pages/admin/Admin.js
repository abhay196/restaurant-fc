import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import RestaurantList from "../RestaurantList";
import UserList from "../frontend/UserList";
import Orders from "../frontend/Orders";
import OrdersEdit from "../frontend/OrdersEdit";
import RestaurantAdd from "../RestaurantAdd";
import MenuItem from "./MenuItem";
import MenuAdd from "./MenuAdd";
import Categories from "./Categories";
import CategoriesAdd from "./CategoriesAdd";
import MemberList from "./MemberList";
import ProtectedRoute from "./ProtectedRoute";
import "../../css/Admin.css";


export default function Admin() {
  const { user } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--bg-main)",
        color: "var(--text-primary)"
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, overflowY: "auto" }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* Dashboard Welcome */}
            <Route index element={
              <div className="restaurant-list-container">
                <div className="list-header">
                  <h2 className="list-heading">Dashboard Overview</h2>
                </div>
                
                <div className="restaurant-add-container" style={{ margin: "20px 0", maxWidth: "100%" }}>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "22px", margin: "0 0 8px 0" }}>
                    Welcome, {user?.name || "Admin"}!
                  </h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "0 0 20px 0" }}>
                    Role: <span className="badge manager" style={{ marginLeft: "5px", textTransform: "uppercase" }}>{user?.role}</span>
                  </p>
                  {user?.restaurant_id && (
                    <div style={{ 
                      padding: "12px 16px", 
                      backgroundColor: "var(--bg-main)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px",
                      display: "inline-block",
                      fontSize: "14px"
                    }}>
                      <strong>Assigned Shop ID:</strong> {user.restaurant_id}
                    </div>
                  )}
                </div>
              </div>
            } />

            {/* --- SUPER ADMIN ONLY ROUTES --- */}
            {user?.role === 'super_admin' && (
              <>
                <Route path="restaurant" element={<RestaurantList />} />
                <Route path="restaurant/create" element={<RestaurantAdd />} />
                <Route path="restaurant/edit/:id" element={<RestaurantAdd />} />
                <Route path="users" element={<UserList />} />
                <Route path="members" element={<MemberList />} />
              </>
            )}

            {/* --- MANAGER & ADMIN ROUTES --- */}
            {(user?.role === 'super_admin' || user?.role === 'manager') && (
              <>
                <Route path="menuitems" element={<MenuItem />} />
                <Route path="menuitems/create" element={<MenuAdd />} />
                <Route path="menuitems/edit/:id" element={<MenuAdd />} />
                <Route path="categories" element={<Categories />} />
                <Route path="categories/create" element={<CategoriesAdd />} />
                <Route path="categories/edit/:id" element={<CategoriesAdd />} />
              </>
            )}

            {/* --- SHARED ROUTES (Admin, Manager, Chef) --- */}
            <Route path="orders" element={<Orders />} />
            <Route path="order/:id" element={<OrdersEdit />} />
            
            {/* Redirects */}
            <Route
              path="home"
              element={<Navigate to={user?.role === 'super_admin' ? "../restaurant" : "../orders"} replace />}
            />

            {/* Fallback for unauthorized sub-routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}