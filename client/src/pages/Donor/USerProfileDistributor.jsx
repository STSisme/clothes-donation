// src/pages/UserProfile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/header';

const UserProfileDistributor = ({ userId, userType }) => {
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({});
  const apiBaseURL = `http://localhost:5000/api/distributors/${userId}`;

  useEffect(() => {
    axios.get(apiBaseURL)
      .then(res => {
        setUserData(res.data);
        setFormState(res.data);
      })
      .catch(err => {
        console.error('Fetch error:', err);
      });
  }, [userId]);

  const handleChange = (e) => {
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
    <>
      <Header />
      <div className="user-profile">
        <h2>{userType} Profile</h2>

        <p><strong>Organization Name:</strong>
          {editing ? (
            <input name="organization_name" value={formState.organization_name || ''} onChange={handleChange} />
          ) : (
            userData.organization_name
          )}
        </p>

        <p><strong>Organization Type:</strong>
          {editing ? (
            <input name="organization_type" value={formState.organization_type || ''} onChange={handleChange} />
          ) : (
            userData.organization_type
          )}
        </p>

        <p><strong>Contact Name:</strong>
          {editing ? (
            <input name="contact_name" value={formState.contact_name || ''} onChange={handleChange} />
          ) : (
            userData.contact_name
          )}
        </p>

        <p><strong>Email:</strong> {userData.email}</p>

        <p><strong>Phone Number:</strong>
          {editing ? (
            <input name="phone_number" value={formState.phone_number || ''} onChange={handleChange} />
          ) : (
            userData.phone_number
          )}
        </p>

        <p><strong>Website:</strong>
          {editing ? (
            <input name="website" value={formState.website || ''} onChange={handleChange} />
          ) : (
            userData.website
          )}
        </p>

        <p><strong>Address:</strong>
          {editing ? (
            <input name="address" value={formState.address || ''} onChange={handleChange} />
          ) : (
            userData.address
          )}
        </p>

        <p><strong>Description:</strong>
          {editing ? (
            <textarea name="description" value={formState.description || ''} onChange={handleChange} />
          ) : (
            userData.description
          )}
        </p>

        <p><strong>Areas of Operation:</strong>
          {editing ? (
            <input name="areas_of_operation" value={formState.areas_of_operation || ''} onChange={handleChange} />
          ) : (
            userData.areas_of_operation
          )}
        </p>

        <p><strong>Points:</strong> {userData.points || 0}</p>

        <p><strong>Verified:</strong> {userData.verified ? "Yes" : "No"}</p>

        {userData.profile_image && (
          <div>
            <strong>Profile Image:</strong><br />
            <img src={userData.profile_image.startsWith("http") ? userData.profile_image : `http://localhost:5000${userData.profile_image}`} alt="Profile" width="120" />
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
      </div>
    </>
  );
};

export default UserProfileDistributor;
