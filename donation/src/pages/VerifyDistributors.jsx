import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './VerifyDistributors.css'; // External CSS

const VerifyDistributors = () => {
  const [distributors, setDistributors] = useState([]);

  useEffect(() => {
    api.get('/distributors')
      .then(response => setDistributors(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleVerify = async (id) => {
    try {
      await api.put(`/admin/verify-distributor/${id}`);
      setDistributors(distributors.map(d => d._id === id ? { ...d, isVerified: true } : d));
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
          {distributors.map(distributor => (
            <tr key={distributor._id}>
              <td>{distributor.orgName}</td>
              <td>
                <span className={distributor.isVerified ? 'badge verified' : 'badge pending'}>
                  {distributor.isVerified ? 'Verified' : 'Pending'}
                </span>
              </td>
              <td>
                {!distributor.isVerified && (
                  <button className="btn verify" onClick={() => handleVerify(distributor._id)}>
                    Verify
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyDistributors;
