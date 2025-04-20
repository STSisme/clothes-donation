import React, { useState } from "react";
import Header from "../../components/header";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // From context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success && data.user) {
        // Set in context
        login(data.user);

        // ✅ Save to localStorage explicitly
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");

        // ✅ Navigate based on role
        const role = data.user.role;
        console.log(role);
        
        if (role === "admin") {
          navigate("/admin-panel");
        } else if (role === "distributor") {
          navigate("/distributor-dashboard");
        } else if (role === "donor") {
          navigate("/");
        } else {
          navigate("/");
        }

        // ✅ Force page reload to update UI (like Header)
        setTimeout(() => window.location.reload(), 100); // Delay allows navigation to complete
      } else {
        setErrorMessage(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        setErrorMessage("Could not connect to the server. Please try again later.");
      } else {
        setErrorMessage("An unexpected error occurred during login.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <h2 className="register-title">Login</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </>
  );
};

export default Login;
