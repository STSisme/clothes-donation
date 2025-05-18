import React, { useState, useEffect } from 'react';
import api from "api/apiService";
import endpoints from 'api/endpoints';
import { useAuth } from 'context/AuthContext';

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [editing, setEditing] = useState(false);
  const [formState, setFormState] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserProfile = async () => {
      try {
        const res = await api.get(endpoints.users.detail(user.id));
        const userData = res.data;

        if (userData.role === 'distributor') {
          const orgRes = await api.get(endpoints.organizations.detail(userData.organization_id));
          userData.organization = orgRes.data.name;
        }

        setUserData(userData);
        setFormState(userData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    fetchUserProfile();
  }, [user?.id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();

      for (const key in formState) {
        if (formState[key]) {
          formData.append(key, formState[key]);
        }
      }

      if (selectedImage) {
        formData.append('profile_image', selectedImage);
      }

      const res = await api.put(endpoints.users.update(user.id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData(res.data);
      setEditing(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="card shadow p-4 border-0 rounded-4 mx-auto" style={{ maxWidth: "600px" }}>
          <h2 className="text-center mb-4">
            {userData?.role?.charAt(0).toUpperCase() + userData?.role?.slice(1)} Profile
          </h2>

          <div className="text-center mb-4">
            {userData.profile_image ? (
              <img
                src={`http://localhost:5000/uploads/${userData.profile_image}`}
                alt="Profile"
                className="rounded-circle shadow"
                width="120"
                height="120"
              />
            ) : (
              <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                style={{ width: "120px", height: "120px", fontSize: "2rem" }}>
                {userData.full_name?.charAt(0) || 'U'}
              </div>
            )}

            {editing && (
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            )}
          </div>

          <div className="mb-3">
            <strong>Full Name:</strong>{' '}
            {editing ? (
              <input
                className='form-control'
                name='full_name'
                value={formState.full_name || ''}
                onChange={handleChange}
              />
            ) : (
              <span className="text-muted">{userData.full_name}</span>
            )}
          </div>

          <div className="mb-3">
            <strong>Email:</strong> <span className="text-muted">{userData.email}</span>
          </div>

          <div className="mb-3">
            <strong>Phone:</strong>{' '}
            {editing ? (
              <input
                className="form-control"
                name="phone_number"
                value={formState.phone_number || ''}
                onChange={handleChange}
              />
            ) : (
              <span className="text-muted">{userData.phone_number}</span>
            )}
          </div>

          <div className="mb-3">
            <strong>Address:</strong>{' '}
            {editing ? (
              <input
                className="form-control"
                name="address"
                value={formState.address || ''}
                onChange={handleChange}
              />
            ) : (
              <span className="text-muted">{userData.address}</span>
            )}
          </div>

          {userData.role === "distributor" && userData.organization && (
            <div className="mb-3">
              <strong>Organization:</strong>{" "}
              <span className="text-muted">{userData.organization}</span>
            </div>
          )}

          {userData.role === "donor" && (
            <div className="mb-4">
              <strong>Points:</strong>{" "}
              <span className="text-success fw-semibold">{userData.points || 0}</span>
            </div>
          )}

          {editing ? (
            <div className="d-flex gap-2">
              <button className="btn btn-primary w-100" onClick={handleUpdate}>Save</button>
              <button className="btn btn-outline-secondary w-100" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-outline-primary w-100" onClick={() => setEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
