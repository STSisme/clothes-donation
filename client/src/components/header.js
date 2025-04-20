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

  useEffect(() => {
    console.log("Header mounted");
    console.log("User from context:", user);
    console.log("Role:", role);
  }, [role, user]);

  const handleLogout = () => {
    logout();
    navigate("/");
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
                    <Link to="/UserProfile">
                      <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/DonorDashboard">Donor Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/all-ngos">View NGOs</Link>
                  </li>
                </>
              )}

              {role === "Distributor" && (
                <>
                  <li className="nav-item">
                    <Link to="/UserProfileDistributor">
                      <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" />
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/DistributorDashboard">Distributor Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/DisastersRelief">Disaster Relief</Link>
                  </li>
                </>
              )}

              {role === "Admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/VerifyDistributors">Verify Distributors</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/ManageDisasters">Manage Disasters</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/UpdateDonations">Update Donations</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/RemoveUsers">Remove Users</Link>
                  </li>
                </>
              )}

              <li className="nav-item logout-item">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/register">Register</Link>
              </li>
              <li className="nav-item">
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
