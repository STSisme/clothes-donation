import React from "react";
import { Link } from "react-router-dom"; 

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-3">
      <div className="container">
        <div className="row text-center text-md-start">
          {/* About Section */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Clothes Donation</h5>
            <h6 className="text-secondary">About Us</h6>
            <p className="text-light">
              We aim to connect donors with those in need by providing an efficient and transparent clothes donation platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-light text-decoration-none d-block py-1">Home</Link></li>
              <li><Link to="/donate" className="text-light text-decoration-none d-block py-1">Donate</Link></li>
              <li><Link to="/about" className="text-light text-decoration-none d-block py-1">About</Link></li>
              <li><Link to="/contact" className="text-light text-decoration-none d-block py-1">Contact</Link></li>
              <li><Link to="/register" className="text-light text-decoration-none d-block py-1">Register</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p className="mb-1">Email: support@clothesdonation.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-4 border-top pt-3">
          <p className="mb-0">&copy; {new Date().getFullYear()} Clothes Donation System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;