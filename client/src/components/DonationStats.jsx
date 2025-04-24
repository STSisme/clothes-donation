import React, { useState, useEffect } from 'react';
import './DonationStats.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useAuth } from '../context/AuthContext';
import api from "../api/apiService";
import L from 'leaflet'; 
import endpoints from 'api/endpoints';

const DonationStats = () => {
  const [stats, setStats] = useState({
    donated: 0,
    distributed: 0,
    peopleHelped: 0,
  });

  const [distributors, setDistributors] = useState([]);
  const { user } = useAuth();
  const userId = user ? user.id : null; 

  useEffect(() => {
    if (!userId) {
      console.log("User ID is not available");
      return;
    }
  
    const fetchStatsAndLocations = async () => {
      try {
        const donationsRes = await api.get(endpoints.donations.getAllByDonor(user.id));
        const userDonations = donationsRes.data;
  
        const distributionsRes = await api.get(endpoints.distributions.getByDonor(user.id));
        const userDistributions = distributionsRes.data;
  
        let donatedCount = 0;
        let distributedCount = 0;
        const markers = [];
  
        for (const donation of userDonations) {
          if (donation.status === 'approved') donatedCount++;
          if (donation.status === 'distributed') distributedCount++;
        }
  
        for (const dist of userDistributions) {
          const { location } = dist;
          if (location?.latitude && location?.longitude) {
            markers.push({
              latitude: location.latitude,
              longitude: location.longitude,
              distributor_name: location.name,
            });
          }
        }
  
        setStats({
          donated: donatedCount,
          distributed: distributedCount,
        });
  
        setDistributors(markers);
      } catch (error) {
        console.error('Error fetching data for donation stats:', error);
      }
    };
  
    fetchStatsAndLocations();
  }, [userId]);
  

  return (
    <section className="donation-stats-section">
      <h2>Your Donation Tracker & Statistics</h2>

      <div className="stats">
        <div className="stat-box">
          <h3>{stats.donated}</h3>
          <p>Donations Made</p>
        </div>
        <div className="stat-box">
          <h3>{stats.distributed}</h3>
          <p>Donations Distributed</p>
        </div>
      </div>

      <div className="map-container">
        <MapContainer center={[27.7172, 85.3240]} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {distributors.map((distributor, index) => (
            <Marker
              key={index}
              position={[distributor.latitude, distributor.longitude]}
              icon={new L.Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
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
