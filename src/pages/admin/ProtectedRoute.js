// src/pages/ProtectedRoute.js (or wherever you saved it)
import React, { useContext } from 'react'; // <-- Import useContext
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // <-- Import your context

const ProtectedRoute = () => {
  // Get the token from the CONTEXT, not localStorage
  const { token } = useContext(AuthContext); 

  // Check if token exists
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;