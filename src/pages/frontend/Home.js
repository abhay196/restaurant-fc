import React, { useState } from "react"; // Added useState
import "../../css/Home.css";
import Navbar from "./Navbar"; 
import RestaurantCard from "./RestaurantCard"; 

export default function Home() {
  // 1. Create a state variable to hold the search text
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <Navbar />

      <div className="home-container">
        <header className="home-header">
          <h1 className="site-title">Welcome to FoodHub 🍴</h1>
          <p className="site-subtitle">
            Order from your favorite restaurants near you!
          </p>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for restaurants, dishes, or keywords..."
              // 2. Link the input to our state
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Search</button>
          </div>
        </header>

        <section className="home-section">
          <div className="section-wrapper">
            <h2>Popular Restaurants</h2>
            <p>Explore top-rated restaurants in your city.</p>

            <RestaurantCard searchTerm={searchTerm} />
          </div>
        </section>

        <footer className="home-footer">
          <p>© {new Date().getFullYear()} FoodHub. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}