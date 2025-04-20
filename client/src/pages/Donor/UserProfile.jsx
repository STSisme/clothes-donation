// UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header';

const UserProfile = ({ userId, userType }) => {
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({});
  const apiBaseURL = `http://localhost:5000/api/users/${userId}`;

  useEffect(() => {
    // Fetch user data when the component mounts or userId/userType changes
    axios.get(apiBaseURL)
      .then(res => {
        setUserData(res.data);
        setFormState(res.data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
      });
  }, [userId, userType]); // Re-run the effect when userId or userType changes

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(apiBaseURL, formState);
      setUserData(res.data);
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <><Header />
    <div className="user-profile">
      <h2>{userType} Profile</h2>
      <p><strong>Username:</strong> {userData.username || userData.contact_name || userData.full_name}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Phone:</strong>
        {editing ? <input name="phone" value={formState.phone || formState.phone_number} onChange={handleChange} />
          : (userData.phone || userData.phone_number)}
      </p>
      <p><strong>Address:</strong>
        {editing ? <input name="address" value={formState.address} onChange={handleChange} />
          : userData.address}
      </p>
      <p><strong>Points:</strong> {userData.points || userData.donationPoints || 0}</p>

      {/* Display the profile image */}
      {userData.profile_image && (
        <div>
          <strong>Profile Image:</strong>
          <img src={userData.profile_image} alt="Profile" width="100" />
        </div>
      )}

      {editing ? (
        <>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <button onClick={() => setEditing(true)}>Edit Profile</button>
      )}
    </div></>
  );
};

export default UserProfile;
