import React from "react";
import "./Footer.css"; 
import { Link } from "react-router-dom"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h1>Clothes Donation</h1>
          <h2>About Us</h2>
          <p>We aim to connect donors with those in need by providing an efficient and transparent clothes donation platform.</p>
        </div>

        <div className="footer-section">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/Register.js">Register</Link></li>

          </ul>
        </div>

        <div className="footer-section">
          <h2>Contact</h2>
          <p>Email: support@clothesdonation.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Clothes Donation System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;


