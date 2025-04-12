import React from 'react';
import { Link } from 'react-router-dom';
import './DisasterRelief.css';

const DisasterRelief = () => {
  const recentUpdates = [
    {
      title: 'Earthquake Relief - Region X',
      description: '500 clothes distributed. Focused on children and elderly.',
      date: 'April 1, 2025',
    },
    {
      title: 'Flood Relief - Region Y',
      description: '1,200 clothes and blankets delivered through partner NGOs.',
      date: 'March 28, 2025',
    },
    {
      title: 'Fire Victims Support - Region Z',
      description: 'Urgent winter clothing dispatched to 70+ families.',
      date: 'March 20, 2025',
    },
  ];

  return (
    <section className="disaster-relief-section">
      <h2>Disaster Relief & Emergency Donations</h2>

      <p className="intro-text">
        Support our ongoing disaster relief efforts. Your donations make a direct impact during emergencies.
      </p>

      <Link to="/Donate.js">
        <button className="donate-btn">Donate for Disaster Relief</button>
      </Link>

      <h3>Recent Updates</h3>
      <div className="update-card-container">
      {recentUpdates.map((update, index) => (
        <div className="update-card" key={index}>
          <h3>{update.title}</h3>
          <p>{update.description}</p>
          <small>{update.date}</small>
        </div>
      ))}
    </div>
    </section>
  );
};

export default DisasterRelief;
