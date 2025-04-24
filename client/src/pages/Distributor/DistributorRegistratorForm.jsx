import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DistributorRegistrationForm.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DistributorRegister = () => {
  const [formData, setFormData] = useState({
    organization_name: "",
    organization_type: "",
    contact_name: "", // ✅ updated
    phone_number: "",
    email: "",
    password: "",
    address: "", // ✅ updated
    website: "", // ✅ updated
    description: "",
    areas_of_operation: "",
    verificationDocs: null,
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData({ ...formData, verificationDocs: e.target.files[0] });
  };

  // Submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null); // Reset error message

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/distributor/register", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Registration successful!");
        navigate("/login"); // Redirect to login after successful registration
      } else {
        setErrorMessage(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error response: ", error.response); // log the error response
      const errorMessage = error.response?.data?.error || "Wrong in registration form";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="distributor-register-page">
        <section className="distributor-form-container">
          <h2 className="form-title">Distributor Registration</h2>
          <form onSubmit={handleSubmit} className="distributor-form">
            <input
              className="form-input"
              type="text"
              name="organization_name"
              placeholder="Organization Name"
              value={formData.organization_name}
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="text"
              name="organization_type"
              placeholder="Type of Organization"
              value={formData.organization_type}
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="text"
              name="contact_name" // ✅ updated
              placeholder="Contact Person Name"
              value={formData.contact_name}
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="tel"
              name="phone_number"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              pattern="[0-9]{10}"
              title="Phone number should be 10 digits"
            />
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
            <textarea
              className="form-textarea"
              name="address" // ✅ updated
              placeholder="Official Address"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
            <textarea
              className="form-textarea"
              name="website" // ✅ updated
              placeholder="Website/Social Media"
              value={formData.website}
              onChange={handleChange}
            ></textarea>
            <textarea
              className="form-textarea"
              name="description"
              placeholder="Brief Description of Organization’s Work"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <textarea
              className="form-textarea"
              name="areas_of_operation"
              placeholder="Areas of Operation"
              value={formData.areas_of_operation}
              onChange={handleChange}
              required
            ></textarea>
            <input
              className="form-file"
              type="file"
              name="verificationDocs"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            />
            <button type="submit" className="form-submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default DistributorRegister;
