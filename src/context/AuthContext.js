import React, { createContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  // mergeRef lets Login.js inject the merge function without circular imports
  const mergeRef = useRef(null);

  const getInitialAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    const loginTime = localStorage.getItem("login_time");
    const ONE_HOUR = 60 * 60 * 1000;

    if (savedToken && savedToken !== "undefined" && loginTime) {
      const isExpired = Date.now() - parseInt(loginTime) > ONE_HOUR;
      if (!isExpired) {
        try {
          const userObj =
            savedUser && savedUser !== "undefined"
              ? JSON.parse(savedUser)
              : null;
          return { token: savedToken, user: userObj };
        } catch (e) {
          return { token: null, user: null };
        }
      }
      localStorage.clear();
    }
    return { token: null, user: null };
  };

  const [authState, setAuthState] = useState(getInitialAuth);
  const [loading] = useState(false);

  const login = async (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("login_time", Date.now().toString());
    setAuthState({ token: newToken, user: userData });

    // Merge any guest-cart items into the server cart
    if (typeof mergeRef.current === "function") {
      await mergeRef.current();
    }
  };

  const logout = () => {
    localStorage.clear();
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
