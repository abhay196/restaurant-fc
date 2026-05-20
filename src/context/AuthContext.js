import React, { createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const mergeRef = useRef(null);

  const getInitialAuth = () => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser  = localStorage.getItem("user");

      // Token must exist and not be the literal string "undefined"
      if (!savedToken || savedToken === "undefined") {
        return { token: null, user: null };
      }

      const userObj =
        savedUser && savedUser !== "undefined"
          ? JSON.parse(savedUser)
          : null;

      return { token: savedToken, user: userObj };
    } catch {
      return { token: null, user: null };
    }
  };

  const [authState, setAuthState] = useState(getInitialAuth);
  const [loading] = useState(false);

  const login = async (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setAuthState({ token: newToken, user: userData });

    // Merge any guest-cart items into the server cart
    if (typeof mergeRef.current === "function") {
      await mergeRef.current();
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthState({ token: null, user: null });
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token: authState.token, user: authState.user, login, logout, loading, mergeRef }}
    >
      {children}
    </AuthContext.Provider>
  );
};