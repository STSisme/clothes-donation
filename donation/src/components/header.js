import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role;
  const navigate = useNavigate(); 

  // Debug logs
  useEffect(() => {
    console.log("Header mounted");
    console.log("User from context:", user);
    console.log("Role:", role);

  }, [role, user, navigate]); // Add role, user, and navigate to the dependency array

  const handleLogout = () => {
    logout(); // Perform logout
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/">Clothes Donation System</Link>
      </h1>
      <nav className="nav">
        <ul className="nav-list">
          {user ? (
            <>

                {role === "Donor" && (
                  <>
                <li className="nav-item">
                  <Link to="/UserProfile.js">
                    <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" />
                  </Link>
                </li>
                    <Link to="/DonorDashboard.jsx">Donor Dashboard</Link>
                    <Link to="/all-ngos.js">View NGOs</Link>
                  </>
                )}

                {role === "Distributor" && (
                  <>
                <li className="nav-item">
                  <Link to="/UserProfileDistributor.js">
                    <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" />
                  </Link>
                </li>
                    <Link to="/DistributorDashboard.jsx">Distributor Dashboard</Link>
                    <Link to="/DisastersRelief.jsx">DisastersRelief</Link>
                  </>
                )}

                {role === "Admin" && (
                  <>
                    <Link to="/VerifyDistributors.jsx">Verify Distributors</Link>
                    <Link to="/ManageDisasters.jsx">Manage Disasters</Link>
                    <Link to="/UpdateDonations.jsx">Update Donations</Link>
                    <Link to="/RemoveUsers.jsx">Remove Users</Link>
                  </>
                )}
              <li className="logout-item">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link to="/register.js">Register</Link>
              <Link to="/login.js">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
