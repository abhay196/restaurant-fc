import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold">🍴 Restaurant App</h1>

      <div className="flex space-x-6">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <Link to="/users" className="hover:text-yellow-400">Users</Link>
        <Link to="/restaurants" className="hover:text-yellow-400">Restaurants</Link>
        <Link to="/menu" className="hover:text-yellow-400">Menu</Link>
      </div>
    </nav>
  );
}

export default Navbar;
