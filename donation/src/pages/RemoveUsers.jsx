// src/pages/RemoveUsers.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import './RemoveUsers.css'; // Importing external CSS

const RemoveUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/remove-user/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="remove-users-container">
      <h1 className="heading">Remove Users</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn remove" onClick={() => handleDelete(user._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RemoveUsers;
