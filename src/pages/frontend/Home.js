import React, { useState } from "react";
import "../../css/Home.css";
import Navbar from "./Navbar";
import RestaurantCard from "./RestaurantCard";

const FILTERS = ["All", "Veg", "Non-Veg", "Open Now", "Top Rated"];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow">
            🍽️ Premium Food Court Experience
          </div>

          <h1>
            Order from <em>Multiple</em> Restaurants. One Cart.
          </h1>

          <p>
            Skip the queue. Choose from 12+ restaurant partners in your food
            court and get everything delivered together.
          </p>

          <div className="hero-search">
            <input
              type="text"
              placeholder="Search restaurants, cuisines, dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="num">12+</div>
              <div className="lbl">Restaurants</div>
            </div>
            <div className="hero-stat">
              <div className="num">300+</div>
              <div className="lbl">Menu Items</div>
            </div>
            <div className="hero-stat">
              <div className="num">4.8★</div>
              <div className="lbl">Avg Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="filter-bar">
        <span className="filter-label">Filter by:</span>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`filter-chip ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── RESTAURANTS ── */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-subtitle">
              Explore top-rated restaurants in your food court.
            </p>
          </div>
          <button className="view-all-btn">View All →</button>
        </div>

        <RestaurantCard searchTerm={searchTerm} activeFilter={activeFilter} />
      </section>

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
