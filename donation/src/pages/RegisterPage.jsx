import React, { useEffect, useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import TextInput from "components/form/TextInput";
import PhoneNumberInput from "components/form/PhoneNumberInput";
import PasswordInput from "components/form/PasswordInput";
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";
import api from "api/apiService";
import endpoints from "api/endpoints";

const Register = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, register } = useAuth();
  const location = useLocation();

  const isDistributorPath = location.pathname.includes("/distributor");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    address: "",
    role: isDistributorPath ? ROLES.DISTRIBUTOR : ROLES.DONOR,
    organization_id: null
  });

  const [organizations, setOrganizations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      role: isDistributorPath ? ROLES.DISTRIBUTOR : ROLES.DONOR
    }));
  }, [isDistributorPath]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const res = await api.get(endpoints.organizations.all);
        setOrganizations(res.data);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
      }
    };

    if (isDistributorPath) {
      fetchOrganizations();
    }
  }, [isDistributorPath]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isAuthenticated) {
    return <Navigate to={`/dashboard/${user.role}`} />
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { full_name, email, password, confirmPassword, phone_number, address, organization_id } = formData;

    if (!full_name || !email || !password || !phone_number || !address || 
        (isDistributorPath && !organization_id)) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {      
      await register(formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-8 shadow-lg p-5 rounded">
          <div className="row">
            <h2 className="text-center mb-4">
              {isDistributorPath ? "Distributor Registration" : "Donor Registration"}
            </h2>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <img src={"/register_image.png"} alt="Register" className="img-fluid h-100 object-fit-cover" />
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubmit}>
                <TextInput
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />

                <PhoneNumberInput
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />

                <TextInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  required
                />

                {isDistributorPath && (
                  <div className="form-group mb-3">
                    <label htmlFor="organization_id">Organization *</label>
                    <select
                      id="organization_id"
                      name="organization_id"
                      className="form-control"
                      value={formData.organization_id || ""}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Organization --</option>
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 m-0">
                  Register
                </button>

                {errorMessage && (
                  <div className="alert alert-danger mt-3">
                    {errorMessage}
                  </div>
                )}

                <div className="mt-3 text-center">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                  {!isDistributorPath && (
                    <p>
                      Want to distribute donations? <Link to="/register/distributor">Register as Distributor</Link>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;