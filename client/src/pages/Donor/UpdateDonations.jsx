import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UpdateDonations.css';
import Header from '../../components/header';

const UpdateDonationStatus = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({});

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/donations')
      .then((response) => {
        console.log('Fetched donations:', response.data);
        setDonations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching donations:', error);
        setLoading(false);
      });
  }, []);
  

  const handleStatusChange = (id, value) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: value }));
  };

  const updateStatus = (id) => {
    const newStatus = statusUpdate[id];
    if (!newStatus) return alert('Please select a status');

    axios
      .put(`http://localhost:5000/api/donations/update-status/${id}`, { status: newStatus })
      .then(() => {
        alert('Status updated successfully');
        setDonations((prev) =>
          prev.map((donation) =>
            donation.id === id ? { ...donation, status: newStatus } : donation
          )
        );
        setStatusUpdate((prev) => ({ ...prev, [id]: '' }));
      })
      .catch((error) => {
        console.error('Error updating status:', error);
        alert('Failed to update status');
      });
  };

  if (loading) return <div className="loading">Loading donations...</div>;

  return (
    <><Header />
    <div className="update-status-page">
      <h2>Update Donation Status</h2>
      {donations.length === 0 ? (
        <p>No donations found.</p>
      ) : (
        <table className="donation-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Donor ID</th>
              <th>Organization ID</th>
              <th>Cloth Type</th>
              <th>Condition</th>
              <th>Method</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.id}</td>
                <td>{donation.donor_id}</td>
                <td>{donation.organization_id}</td>
                <td>{donation.cloth_type}</td>
                <td>{donation.cloth_condition}</td>
                <td>{donation.method}</td>
                <td>{donation.status}</td>
                <td>
                  <select
                    value={statusUpdate[donation.id] || ''}
                    onChange={(e) => handleStatusChange(donation.id, e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button onClick={() => updateStatus(donation.id)}>Update</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      )}
    </div></>
  );
};

export default UpdateDonationStatus;
