import React from "react";
import "./Banner.css"; 
import { Link } from "react-router-dom"; 
import { useAuth } from "context/AuthContext";
import { ROLES } from "constants/roles";

const Banner = () => {
  const {user} = useAuth();

  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Donate Clothes, Change Lives</h1>
        <p>Your old clothes can bring warmth and happiness to someone in need.</p>
        {user?.role === ROLES.DONOR && (
          <Link to="/dashboard/donor/donations/donate" className="banner-button">Donate Now</Link>
        )}
      </div>
    </div>
  );
};

export default Banner;
