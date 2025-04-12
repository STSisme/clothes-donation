import React, { useState, useEffect } from 'react';
import './DonationStats.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { api } from '../services/api';

const DonationStats = () => {
  const [stats, setStats] = useState({
    donated: 0,
    distributed: 0,
    peopleHelped: 0,
  });

  const userId = localStorage.getItem('userId'); // Or get it from context

  useEffect(() => {
    const fetchUserDonations = async () => {
      try {
        const response = await api.get(`/donations/user/${userId}`);
        const userDonations = response.data;

        let donatedCount = 0;
        let distributedCount = 0;
        let helpedPeople = 0;

        userDonations.forEach(donation => {
          if (donation.status === 'Donated') donatedCount++;
          if (donation.status === 'Distributed') distributedCount++;
          if (donation.peopleHelped) helpedPeople += donation.peopleHelped;
        });

        setStats({
          donated: donatedCount,
          distributed: distributedCount,
          peopleHelped: helpedPeople,
        });
      } catch (error) {
        console.error('Error fetching user donations:', error);
      }
    };

    fetchUserDonations();

    const interval = setInterval(() => {
      fetchUserDonations(); // refresh every 10 seconds
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <section className="donation-stats-section">
      <h2>Your Donation Tracker & Statistics</h2>

      <div className="stats">
        <div className="stat-box">
          <h3>{stats.donated}</h3>
          <p>Clothes Donated</p>
        </div>
        <div className="stat-box">
          <h3>{stats.distributed}</h3>
          <p>Clothes Distributed</p>
        </div>
        <div className="stat-box">
          <h3>{stats.peopleHelped}</h3>
          <p>People Helped</p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={[27.7172, 85.3240]} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Optional: Add dynamic markers if location data exists in user donations */}
        </MapContainer>
      </div>

      <div className="campaigns">
        <h3>Ongoing Campaigns</h3>
        <ul>
          <li>🧥 Winter Clothes Drive</li>
          <li>👕 Summer Essentials for Children</li>
          <li>🎒 Back to School Uniform Drive</li>
        </ul>
      </div>
    </section>
  );
};

export default DonationStats;
