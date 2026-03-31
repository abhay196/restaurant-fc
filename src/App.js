import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Notification Helpers
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Frontend Pages
import Home from "./pages/frontend/Home";
import Menus from "./pages/frontend/Menus";
import Cart from "./pages/frontend/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin Layout
import Admin from "./pages/admin/Admin";

// Configure Echo
window.Pusher = Pusher;
const echo = new Echo({
    broadcaster: 'pusher',
    key: '6e14d9902c201aeafe8d',
    cluster: 'ap2',
    forceTLS: true
});

function App() {
  useEffect(() => {
    // Listen for the event you created in Laravel
    const channel = echo.channel('restaurant-orders');
    
    channel.listen('.OrderUpdated', (data) => {
      // This will trigger on any page!
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    return () => {
      echo.leave('restaurant-orders');
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          {/* The ToastContainer must be here to be visible globally */}
          <ToastContainer />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/menus/:id" element={<Menus />} />
            <Route path="/cart" element={<Cart />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;