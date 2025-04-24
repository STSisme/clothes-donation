import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Header = () => {
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
    <header className="bg-primary text-white py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="h4 m-0">
          <Link to="/" className="text-white text-decoration-none">
            Clothes Donation System
          </Link>
        </h1>

        <nav>
          <ul className="nav">
            <li className="nav-item">
              <Link
                to={`/profile/${role}`}
                className="nav-link text-white"
              >
                <FontAwesomeIcon icon={faUserCircle} size="lg" title="User Profile" /> {user?.full_name}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={`dashboard/${role}`} className="nav-link text-white">
                Dashboard
              </Link>
            </li>
            {user ? (
              <>
                {(role === "donor" || role === "distributor") && (
                  <li className="nav-item">
                    <Link
                      to={role === "donor" ? "/dashboard/donor/organizations" : "/dashboard/distributor/disasters"}
                      className="nav-link text-white"
                    >
                      {role === "donor" ? "View NGOs" : "Disaster Relief"}
                    </Link>
                  </li>
                )}

                {role === "admin" && (
                  <>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/organizations" className="nav-link text-white">
                        Organizations
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/users" className="nav-link text-white">
                        Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/disasters" className="nav-link text-white">
                        Disasters
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/admin/donations" className="nav-link text-white">
                        Donations
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light ms-3">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/register" className="nav-link text-white">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link text-white">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
