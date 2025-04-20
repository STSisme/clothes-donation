import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'; // Assuming api is configured to interact with the backend
import Header from '../../components/header';
import './VerifyDistributors.css';

const VerifyDistributors = () => {
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    // Fetch distributors on page load
    api.get('/admin/distributors')
      .then(response => setDistributors(response.data))
      .catch(error => console.error('Error fetching distributors:', error));
  }, []);

  const handleVerify = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1; // Toggle between 0 and 1
      await api.put(`/admin/verify-distributor/${id}`, { verified: newStatus });

      // Update the UI after successful status change
      setDistributors(prev =>
        prev.map(d =>
          d.id === id ? { ...d, verified: newStatus } : d
        )
      );
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  return (
    <>
        <Header/>
        <div className="verify-distributors-container">
        <h1 className="heading">Verify Distributors</h1>
        <table className="distributors-table">
          <thead>
            <tr>
              <th>Organization Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {distributors.length > 0 ? (
              distributors.map(distributor => (
                <tr key={distributor.id}>
                  <td>{distributor.organization_name}</td>
                  <td>
                    <span className={`badge ${distributor.verified === 1 ? 'verified' : 'pending'}`}>
                      {distributor.verified === 1 ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn ${distributor.verified === 1 ? 'unverify' : 'verify'}`}
                      onClick={() => handleVerify(distributor.id, distributor.verified)}
                    >
                      {distributor.verified === 1 ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No distributors tfound.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div></>
  );
};

export default VerifyDistributors;
