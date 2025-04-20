import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './ManageDisasters.css';
import Header from '../../components/header';

const ManageDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [newDisaster, setNewDisaster] = useState({
    title: '',
    description: '',
    location: '',
    type: '',
    region: '',
    severity: '',
    notify_users: false,
  });

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const response = await api.get('/disasters');
      setDisasters(response.data);
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const handleAddDisaster = async () => {
    const { title, description, location, type, region, severity } = newDisaster;
    if (!title || !description || !location || !type || !region || !severity) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await api.post('/disasters', newDisaster);

      if (response.status === 201) {
        alert('Disaster added successfully!');
        await fetchDisasters();
        setNewDisaster({
          title: '',
          description: '',
          location: '',
          type: '',
          region: '',
          severity: '',
          notify_users: false,
        });
      } else {
        alert('Something went wrong while adding the disaster.');
      }
    } catch (error) {
      console.error('Error adding disaster:', error);
      alert('Failed to add disaster. Please try again.');
    }
  };

  return (
    <>
    <Header/>
   <div className="manage-disasters-container">
        <h1 className="heading">Manage Disasters</h1>

        <div className="form-container">
          <input
            type="text"
            placeholder="Disaster Title"
            value={newDisaster.title}
            onChange={(e) => setNewDisaster({ ...newDisaster, title: e.target.value })} />
          <input
            type="text"
            placeholder="Description"
            value={newDisaster.description}
            onChange={(e) => setNewDisaster({ ...newDisaster, description: e.target.value })} />
          <input
            type="text"
            placeholder="Location"
            value={newDisaster.location}
            onChange={(e) => setNewDisaster({ ...newDisaster, location: e.target.value })} />
          <input
            type="text"
            placeholder="Type"
            value={newDisaster.type}
            onChange={(e) => setNewDisaster({ ...newDisaster, type: e.target.value })} />
          <input
            type="text"
            placeholder="Region"
            value={newDisaster.region}
            onChange={(e) => setNewDisaster({ ...newDisaster, region: e.target.value })} />
          <input
            type="text"
            placeholder="Severity"
            value={newDisaster.severity}
            onChange={(e) => setNewDisaster({ ...newDisaster, severity: e.target.value })} />
          <label>
            Notify users:
            <input
              type="checkbox"
              checked={newDisaster.notify_users}
              onChange={() => setNewDisaster({ ...newDisaster, notify_users: !newDisaster.notify_users })} />
          </label>
          <button onClick={handleAddDisaster}>Add Disaster</button>
        </div>

        <table className="disaster-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Disaster Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Type</th>
              <th>Region</th>
              <th>Severity</th>
              <th>Date Reported</th>
              <th>Notify Users</th>
            </tr>
          </thead>
          <tbody>
            {disasters.length > 0 ? (
              disasters.map((disaster, index) => (
                <tr key={disaster.id}>
                  <td>{index + 1}</td>
                  <td>{disaster.title}</td>
                  <td>{disaster.description}</td>
                  <td>{disaster.location}</td>
                  <td>{disaster.type}</td>
                  <td>{disaster.region}</td>
                  <td>{disaster.severity}</td>
                  <td>{new Date(disaster.dateReported).toLocaleString()}</td>
                  <td>{disaster.notify_users ? 'Yes' : 'No'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No disasters found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div></>
  );
};

export default ManageDisasters;
