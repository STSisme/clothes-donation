import React, { useState, useEffect } from 'react';
import './DonationStats.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import L from 'leaflet';  // Import leaflet for custom icons

const DonationStats = () => {
  const [stats, setStats] = useState({
    donated: 0,
    distributed: 0,
    peopleHelped: 0,
  });

  const [distributors, setDistributors] = useState([]); // State for distributor locations
  const { user } = useAuth(); // Access user object from AuthContext
  const userId = user ? user.id : null; // Extract userId from user object

  useEffect(() => {
    if (!userId) {
      console.log("User ID is not available");
      return;
    }

    const fetchUserDonations = async () => {
      try {
        const response = await api.get(`/api/donations/donor/${userId}`);
        const userDonations = response.data;

        let donatedCount = 0;
        let distributedCount = 0;
        let helpedPeople = 0;
        const distributorLocations = [];

        for (const donation of userDonations) {
          if (donation.status === 'approved') donatedCount++;
          if (donation.status === 'Distributed') distributedCount++;
          if (donation.peopleHelped) helpedPeople += donation.peopleHelped;

          // Collect distributor locations for approved donations
          if (donation.status === 'approved' && donation.organization_id) {
            // Query the organization for the location using the organization_id
            const orgResponse = await api.get(`/api/organizations/${donation.organization_id}`);
            const organization = orgResponse.data;
            
            if (organization && organization.latitude && organization.longitude) {
              distributorLocations.push({
                latitude: organization.latitude,
                longitude: organization.longitude,
                distributor_name: organization.name,  // Assuming the organization has a 'name' field
              });
            }
          }
        }

        setStats({
          donated: donatedCount,
          distributed: distributedCount,
          peopleHelped: helpedPeople,
        });

        setDistributors(distributorLocations);
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

          {/* Render markers for each distributor location */}
          {distributors.map((distributor, index) => (
            <Marker
              key={index}
              position={[distributor.latitude, distributor.longitude]}
              icon={new L.Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Customize icon if needed
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <strong>{distributor.distributor_name}</strong>
              </Popup>
            </Marker>
          ))}
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
