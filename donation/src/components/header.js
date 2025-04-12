import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import "./header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const role = user?.role;

  // Debug logs
  useEffect(() => {
    console.log("Header mounted");
    console.log("User from context:", user);
    console.log("Role:", role);
  }, [user]);

  return (
    <header className="header">
      <h1 className="logo">
        <Link to="/">Clothes Donation System</Link>
      </h1>
      <nav className="nav">
        <ul className="nav-list">
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile">
                  <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" />
                </Link>
              </li>
              <li className="nav-item">
                {role === "Donor" && (
                  <>
                    <Link to="/">Donor Dashboard</Link>
                    <Link to="/all-ngos.js">View NGOs</Link> {/* Updated link */}
                  </>
                )}
                {role === "Distributor" && (
                  <>
                    <Link to="/distributor-dashboard">Distributor Dashboard</Link>
                    <Link to="/distributor-requests">Distributor Requests</Link> {/* Updated link */}
                  </>
                )}
                {role === "Admin" && (
                  <>
                    <Link to="/adminpanel.js">Admin Dashboard</Link>
                    <Link to="/manage-users">Manage Users</Link> {/* Updated link */}
                  </>
                )}
              </li>
              <li className="logout-item">
                <button className="logout-btn" onClick={logout}>Logout</button>
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
