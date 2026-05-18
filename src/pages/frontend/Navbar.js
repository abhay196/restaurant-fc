import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../css/Navbar.css";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, user } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setDrawerOpen(false);
    if (typeof logout === "function") logout();
    else navigate("/login");
  };

  const navLinks = [
    { to: "/",        label: "Home"    },
    { to: "/about",   label: "About"   },
    { to: "/contact", label: "Contact" },
    ...(token && user?.role !== "customer"
      ? [{ to: "/admin", label: "Dashboard" }]
      : []),
  ];

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/">Food<span>Court</span></Link>
        </div>

        {/* Desktop links */}
        <ul className="nav-links">
          {navLinks.map(l => (
            <li key={l.to} className={location.pathname === l.to ? "active" : ""}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="nav-buttons">
          {/* Cart — always visible */}
          <button className="carticon" onClick={() => navigate("/cart")} aria-label="Cart">
            <FaShoppingCart className="cartbtn" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Desktop: login / profile+logout */}
          <div className="nav-auth-desktop">
            {!token ? (
              <Link to="/login" className="btn btn-secondary">Login</Link>
            ) : (
              <>
                <Link to="/profile" className="btn btn-secondary">Profile</Link>
                <button className="btn-logout" onClick={handleLogout}>Logout</button>
              </>
            )}
          </div>

          {/* Mobile: hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="nav-drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? " open" : ""}`}>
        <div className="nav-drawer-header">
          <div className="nav-logo">
            <Link to="/" onClick={() => setDrawerOpen(false)}>
              Food<span>Court</span>
            </Link>
          </div>
          <button className="nav-drawer-close" onClick={() => setDrawerOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <ul className="nav-drawer-links">
          {navLinks.map(l => (
            <li key={l.to}>
              <Link
                to={l.to}
                className={location.pathname === l.to ? "active" : ""}
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-drawer-footer">
          {!token ? (
            <Link to="/login" className="btn" style={{ width: "100%", justifyContent: "center" }}
              onClick={() => setDrawerOpen(false)}>
              Login
            </Link>
          ) : (
            <>
              <Link to="/profile" className="btn btn-secondary"
                style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem" }}
                onClick={() => setDrawerOpen(false)}>
                Profile
              </Link>
              <button className="btn-logout" style={{ width: "100%" }} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}