import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyDonations.css';
import Header from '../components/header';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:5000/api/donations/donor/${user.id}`)
        .then((response) => {
          setDonations(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching donations:', error);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div className="loading">Loading your donations...</div>;

  return (
    <><Header />
    <div className="my-donations-page">
          <h2>My Donations</h2>
          {donations.length === 0 ? (
              <p>You haven't made any donations yet.</p>
          ) : (
              <div className="donation-list">
                  {donations.map((donation) => (
                      <div className="donation-card" key={donation.id}>
                          {donation.image_url && (
                              <img src={donation.image_url} alt="Donation" className="donation-image" />
                          )}
                          <div className="donation-details">
                              <h4>{donation.cloth_type} ({donation.cloth_condition})</h4>
                              <p><strong>Method:</strong> {donation.method}</p>
                              {donation.method === 'pickup' && (
                                  <>
                                      <p><strong>Pickup Address:</strong> {donation.pickup_address}</p>
                                      <p><strong>Pickup Time:</strong> {new Date(donation.pickup_time).toLocaleString()}</p>
                                  </>
                              )}
                              <p><strong>Note:</strong> {donation.note || 'No note'}</p>
                              <p><strong>Status:</strong> {donation.status}</p>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div></>
  );
};

export default MyDonations;
