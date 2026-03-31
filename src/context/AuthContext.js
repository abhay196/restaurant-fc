import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const getInitialAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("login_time");
    const ONE_HOUR = 60 * 60 * 1000;

    // 1. Check if token exists and isn't the literal string "undefined"
    if (savedToken && savedToken !== "undefined" && loginTime) {
      const isExpired = Date.now() - parseInt(loginTime) > ONE_HOUR;
      
      if (!isExpired) {
        try {
          // 2. Only parse if savedUser exists and isn't "undefined"
          const userObj = (savedUser && savedUser !== "undefined") 
            ? JSON.parse(savedUser) 
            : null;

          return { 
            token: savedToken, 
            user: userObj 
          };
        } catch (e) {
          console.error("Error parsing user from localStorage", e);
          return { token: null, user: null };
        }
      }
      
      // Cleanup if expired
      localStorage.clear();
    }
    return { token: null, user: null };
  };

  const [authState, setAuthState] = useState(getInitialAuth());
  const [loading, setLoading] = useState(false);

  // Updated login to accept the user object from Laravel
  const login = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("login_time", Date.now().toString());
    
    setAuthState({ token: newToken, user: userData });
  };

  const logout = () => {
    localStorage.clear();
    setAuthState({ token: null, user: null });
    navigate("/login");
  };

  const value = {
    token: authState.token,
    user: authState.user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};