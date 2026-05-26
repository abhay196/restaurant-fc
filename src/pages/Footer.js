import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
    {/* ── FOOTER ── */}
      <footer className="home-footer">
        <div className="footer-content">
          <h2>
            Food<span>Court</span>
          </h2>
          <p>Order delicious food from your favorite restaurants.</p>
          <div className="footer-bottom">
            © {new Date().getFullYear()} FoodCourt. All rights reserved.
          </div>
        </div>
      </footer>
      </>
  );
}

export default Footer;
