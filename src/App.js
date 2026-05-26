import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { AuthContext } from "./context/AuthContext";
import { CartContext } from "./context/CartContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import About from "./pages/frontend/About";
import Contact from "./pages/frontend/Contact";
import Home from "./pages/frontend/Home";
import Menus from "./pages/frontend/Menus";
import Cart from "./pages/frontend/Cart";
import Checkout from "./pages/frontend/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/admin/Admin";

window.Pusher = Pusher;
const echo = new Echo({
  broadcaster: "pusher",
  key: "6e14d9902c201aeafe8d",
  cluster: "ap2",
  forceTLS: true,
});

// Wires CartContext.mergeGuestCartToServer into AuthContext.mergeRef
function MergeWirer() {
  const { mergeRef } = useContext(AuthContext);
  const { mergeGuestCartToServer } = useContext(CartContext);
  useEffect(() => {
    mergeRef.current = mergeGuestCartToServer;
  }, [mergeRef, mergeGuestCartToServer]);
  return null;
}

function App() {
  useEffect(() => {
    const channel = echo.channel("restaurant-orders");
    channel.listen(".OrderUpdated", (data) => {
      toast.success(data.message, { position: "top-right", autoClose: 5000 });
    });
    return () => { echo.leave("restaurant-orders"); };
  }, []);

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <MergeWirer />
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/menus/:id" element={<Menus />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
