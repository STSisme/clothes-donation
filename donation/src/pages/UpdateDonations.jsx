// src/pages/UpdateDonations.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './UpdateDonations.css'; // Import the external CSS file

const UpdateDonations = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    api.get('/donations')
      .then(response => setDonations(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admin/update-donation-status/${id}`, { status });
      setDonations(donations.map(d => d._id === id ? { ...d, status } : d));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="update-donations-container">
      <h1 className="heading">Update Donation Status</h1>
      <table className="donation-table">
        <thead>
          <tr>
            <th>Donor</th>
            <th>Donation Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation) => (
            <tr key={donation._id}>
              <td>{donation.donorInfo.name}</td>
              <td>{donation.clothesDetails.type}</td>
              <td>{donation.status}</td>
              <td>
                <button
                  className="btn donate"
                  onClick={() => handleUpdateStatus(donation._id, 'Donated')}
                >
                  Mark as Donated
                </button>
                <button
                  className="btn pending"
                  onClick={() => handleUpdateStatus(donation._id, 'Pending')}
                >
                  Mark as Pending
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UpdateDonations;
