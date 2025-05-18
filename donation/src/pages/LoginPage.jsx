import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import EmailInput from "components/form/EmailInput";
import PasswordInput from "components/form/PasswordInput";

const Login = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setErrorMessage("");

    try {
      const user = await login(formData.email, formData.password);
      
      if (!user?.role) {
        throw new Error("User role missing");
      }
      
      navigate(`/dashboard/${user.role}`, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center justify-content-center">
        <div className="col-lg-8 shadow-lg p-5 rounded">
          <div className="row align-items-center">
            <h2 className="text-center mb-4">Login</h2>
            <div className="col-lg-6 d-flex justify-content-center align-items-center">
              <img src={"/register_image.png"} alt="Login" className="img-fluid h-100 object-fit-cover" />
            </div>
            <div className="col-lg-6">
              <form onSubmit={handleSubmit}>
                <EmailInput
                  label="Email Address"
                  name="email"
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

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    'Login'
                  )}
                </button>

                <Link to={"/register"} className="d-block text-center mt-3">
                  Don't Have An Account? Register
                </Link>

                {errorMessage && (
                  <div className="alert alert-danger mt-3">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;