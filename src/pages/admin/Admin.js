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


export default function Admin() {
  const { user } = useContext(AuthContext);

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#0f172a", // Matches your dark theme from screenshots
        color: "white"
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            {/* Dashboard Welcome */}
            <Route index element={
              <div style={{ padding: "20px" }}>
                <h2>Welcome, {user?.name || "Admin"}</h2>
                <p style={{ color: "#94a3b8" }}>
                  Role: <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{user?.role?.toUpperCase()}</span>
                  {user?.restaurant_id && ` | Assigned Shop ID: ${user.restaurant_id}`}
                </p>
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