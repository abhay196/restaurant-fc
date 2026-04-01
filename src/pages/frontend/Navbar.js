// src/pages/frontend/Navbar.js
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Navbar.css";
import { AuthContext } from "../../context/AuthContext";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get token (and logout if available) from AuthContext
  const { token, logout } = useContext(AuthContext || {});

  // Local state for cart count + loading
  const [count, setCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);

  // fetch cart count (memoized)
  const fetchCount = useCallback(async () => {
    // if no token, reset count and skip request
    if (!token) {
      setCount(0);
      setLoadingCount(false);
      return;
    }

    setLoadingCount(true);
    try {
      const res = await axios.post("{process.env.REACT_APP_API_URL}/api/cart/count", 
        {},
        {   
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // safe read (in case backend returns different shape)
      const newCount = res?.data?.count ?? 0;
      // console.log(res)
      setCount(newCount);
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
      // keep previous count on error (or setCount(0) if you'd prefer)
    } finally {
      setLoadingCount(false);
    }
  }, [token]);

  // run on mount and whenever token changes
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Optional: refresh count when route changes (uncomment if you want)
  // useEffect(() => { fetchCount(); }, [location.pathname, fetchCount]);

  // Handler for logout (if logout exists on context) otherwise navigate to login
  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      // fallback: clear token mechanism depends on your app; navigate to login
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">FoodHub</Link>
      </div>

      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/about" ? "active" : ""}>
          <Link to="/about">About</Link>
        </li>
        <li className={location.pathname === "/contact" ? "active" : ""}>
          <Link to="/contact">Contact</Link>
        </li>

        {/* {token && (
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/admin">Dashboard</Link>
          </li>
        )} */}
      </ul>

      <div className="nav-buttons">
        {!token ? (
          <>
            <Link to="/login" className="btn">Login</Link>
            <Link to="/register" className="btn btn-secondary">Register</Link>
          </>
        ) : (
          <>
            <button
              className="carticon"
              onClick={() => {
                // navigate to cart page
                navigate("/cart");
              }}
              aria-label="Go to cart"
              title="Cart"
            >
              <FaShoppingCart className="cartbtn" />
              <span className="cart-badge">
                {loadingCount ? "…" : count}
              </span>
            </button>

            <Link to="/profile" className="btn">Profile</Link>

            {/* Logout button */}
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
