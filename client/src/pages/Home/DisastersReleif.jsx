import React, { useState, useEffect } from 'react';
import './disastersRelief.css';

const DisastersRelief = () => {
  const [disasters, setDisasters] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  useEffect(() => {
    // Mock API call to fetch disaster updates
    fetch('/api/disasters') // replace with actual API when available
      .then(res => res.json())
      .then(data => setDisasters(data))
      .catch(err => console.error('Failed to fetch disaster data:', err));
  }, []);

  const handleDonateClick = (disaster) => {
    setSelectedDisaster(disaster);
    // Redirect or open modal to donation form
    alert(`Redirecting to donation form for: ${disaster.title}`);
  };

  return (
    <div className="disaster-relief-page">
      <section className="overview">
        <h2>🌍 Disaster Relief & Emergency Donations</h2>
        <p>Your contribution can make a life-changing difference in these urgent situations. Help those in need now.</p>
      </section>

      <section className="disaster-list">
        <h3>🚨 Current Disaster Updates</h3>
        {disasters.length === 0 ? (
          <p>Loading updates...</p>
        ) : (
          disasters.map((dis, idx) => (
            <div className="disaster-card" key={idx}>
              <h4>{dis.title}</h4>
              <p><strong>Location:</strong> {dis.location}</p>
              <p><strong>Type:</strong> {dis.type}</p>
              <p><strong>Affected:</strong> {dis.affected}</p>
              <p><strong>Urgent Needs:</strong> {dis.needs.join(', ')}</p>
              <button onClick={() => handleDonateClick(dis)}>Donate Now</button>
            </div>
          ))
        )}
      </section>

      <section className="cta-section">
        <button className="join-distributor-btn">Join as a Distributor</button>
        <button className="donate-more-btn">Donate More</button>
      </section>
    </div>
  );
};

export default DisastersRelief;
