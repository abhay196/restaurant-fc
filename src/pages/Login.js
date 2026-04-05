import React, { useState, useContext } from "react";
import "../css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const { login, user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ FIX: Pass BOTH data.token AND data.user 
        // data.user contains the 'role' (super_admin) from Laravel
        if (data.token && data.user) {
          login(data.token, data.user); 
          
          if (data.user.role !== 'customer') {
            console.log("Redirecting to Admin:", data.user.role);
            navigate("/admin");
          } else {
            console.log("Redirecting to Home:", data.user.role);
            navigate("/"); 
          } 
        } else {
          setError("Invalid response from server");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="auth-page-wrapper">
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <div className="footer">
        <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
      </div>
      </div>
    </div>
  );
}

export default Login;