import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import Header from "../../components/header";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone_number: '',
    address: '',
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.phone_number || !formData.address) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        setErrorMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrorMessage(error.message || "Error registering user.");
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            className="input-field"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="input-field"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="input-field"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone_number"
            className="input-field"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            className="input-field"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <p>
            <Link to="/login">Already have an account? Login</Link>
          </p>
          <p>
            <Link to="/distributor-registration">Register as a Distributor</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
