import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Header from '../../components/header';
import './RemoveUsers.css'; // Importing external CSS

const RemoveUsers = () => {
  const [users, setUsers] = useState([]);
  const [userType, setUserType] = useState(''); // Add state to manage user type (donor/distributor)

  useEffect(() => {
    // Fetch donors and distributors
    api.get('/users') // Assuming this endpoint returns both donors and distributors
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleDelete = async (id, type) => {
    try {
      let url = '';
  
      // Set the correct URL based on the user type
      if (type === 'donor') {
        url = `/admin/remove-donor/${id}`;
      } else if (type === 'distributor') {
        url = `/admin/remove-distributor/${id}`;
      }
  
      console.log(`Deleting user with URL: ${url}`); // Log URL for debugging
  
      // Make the API call to delete the user
      await api.delete(url);
  
      // Filter out the deleted user from the state
      setUsers(users.filter(user => user._id !== id));
  
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  
  return (
    <>
        <Header/>
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
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn remove"
                      onClick={() => handleDelete(user._id, user.role)} // Pass role to identify user type
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div></>
  );
};

export default RemoveUsers;
