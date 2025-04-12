// src/pages/ManageDisasters.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './ManageDisasters.css'; // Import the CSS

const ManageDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [newDisaster, setNewDisaster] = useState({ name: '', description: '', location: '' });

  useEffect(() => {
    api.get('/disasters')
      .then(response => setDisasters(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAddDisaster = async () => {
    try {
      await api.post('/admin/add-disaster', newDisaster);
      setDisasters([...disasters, newDisaster]);
      setNewDisaster({ name: '', description: '', location: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="manage-disasters-container">
      <h1 className="heading">Manage Disasters</h1>
      <div className="form-container">
        <input
          type="text"
          placeholder="Disaster Name"
          value={newDisaster.name}
          onChange={(e) => setNewDisaster({ ...newDisaster, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newDisaster.description}
          onChange={(e) => setNewDisaster({ ...newDisaster, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newDisaster.location}
          onChange={(e) => setNewDisaster({ ...newDisaster, location: e.target.value })}
        />
        <button onClick={handleAddDisaster}>Add Disaster</button>
      </div>

      <table className="disaster-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Disaster Name</th>
            <th>Description</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {disasters.map((disaster, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{disaster.name}</td>
              <td>{disaster.description}</td>
              <td>{disaster.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageDisasters;
