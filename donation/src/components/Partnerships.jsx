import React from 'react';
import { Link } from 'react-router-dom';
import './Partnerships.css';
import NGOlogo1 from '../images/NGOlogo1.jpg';
import NGOlogo2 from '../images/NGOlogo2.jpg';
import NGOlogo3 from '../images/NGOlogo3.jpg';
import NGOlogo4 from '../images/NGOlogo4.png';

const Partnerships = () => {
  const partnerLogos = [
    { name: 'NGO One', img: NGOlogo1 },
    { name: 'CSR Donation', img: NGOlogo2 },
    { name: 'DFoundation', img: NGOlogo3 },
    { name: ' SSG Help', img: NGOlogo4 },
  ];


  return (
    <section className="partnerships-section">
      <h2>Corporate & NGO Partnerships</h2>

      <div className="partnership-intro">
        <p>
          We welcome partnerships with businesses, schools, and organizations looking to create social impact.
        </p>
        <p>Let's collaborate to make a difference—together!</p>
        <Link to="/register/distributor">
          <button className="partner-button">Become a Partner</button>
        </Link>
      </div>

      <div className="partner-logos">
        <h3>Our Partners</h3>
        <div className="partnerships-container">
          {partnerLogos.map((partner, index) => (
            <div className="partner-card" key={index}>
              <img src={partner.img} alt={partner.name} className="partner-logo" />
              <p>{partner.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnerships;
