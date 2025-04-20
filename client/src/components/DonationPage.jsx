import React, { useState, useEffect } from 'react';
import axios from 'axios';
import donationImage from '../images/0c3d2f0a5134100e32d66f1caa74bb72.jpg';
import './DonationPage.css';

const DonationPage = () => {
  const [donation, setDonation] = useState({
    donor_id: '',
    organization_id: '',
    cloth_type: '',
    cloth_condition: '',
    method: '',
    pickup_address: '',
    pickup_time: '',
    note: '',
    image: null,
  });

  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setDonation((prev) => ({ ...prev, donor_id: user.id }));
    }
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/organizations')
      .then((response) => setOrganizations(response.data))
      .catch((error) => console.error('Error fetching organizations:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDonation((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('donor_id', donation.donor_id);
    formData.append('organization_id', donation.organization_id);
    formData.append('cloth_type', donation.cloth_type);
    formData.append('cloth_condition', donation.cloth_condition);
    formData.append('method', donation.method);
    formData.append('note', donation.note);
    formData.append('pickup_address', donation.method === 'pickup' ? donation.pickup_address : '');
    formData.append('pickup_time', donation.method === 'pickup' ? donation.pickup_time : '');
  
    if (donation.image) {
      formData.append('image', donation.image);  // This sends the file
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/donations/register', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      console.log(data);
  
      alert('Donation submitted successfully!');
      setDonation({
        donor_id: donation.donor_id,
        organization_id: '',
        cloth_type: '',
        cloth_condition: '',
        method: '',
        pickup_address: '',
        pickup_time: '',
        note: '',
        image: null,
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('Failed to submit donation');
    }
  };
  

  return (
    <div className="donation-page">
      <h1>Donate Clothes</h1>
      <div className="donation-content">
        <div className="info-section">
          <img src={donationImage} alt="Donate Clothes" />
          <p>
            Every piece of clothing you donate brings comfort to someone in need.
            Let’s build a better world together.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Select Organization</label>
            <select name="organization_id" value={donation.organization_id} onChange={handleChange} required>
              <option value="">Select Distributor</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.organization_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cloth Type</label>
            <select name="cloth_type" value={donation.cloth_type} onChange={handleChange} required>
              <option value="">Select Cloth Type</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="winterwear">Winterwear</option>
              <option value="traditional">Traditional</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <label>Condition</label>
            <select name="cloth_condition" value={donation.cloth_condition} onChange={handleChange} required>
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="gently-used">Gently Used</option>
              <option value="needs-repair">Needs Repair</option>
            </select>
          </div>

          <div>
            <label>Donation Method</label>
            <select name="method" value={donation.method} onChange={handleChange} required>
              <option value="">Select Method</option>
              <option value="pickup">Pickup</option>
              <option value="dropoff">Drop-off</option>
            </select>
          </div>

          {donation.method === 'pickup' && (
            <>
              <div>
                <label>Pickup Time</label>
                <input
                  type="datetime-local"
                  name="pickup_time"
                  value={donation.pickup_time}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Pickup Address</label>
                <input
                  type="text"
                  name="pickup_address"
                  value={donation.pickup_address}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label>Note</label>
            <textarea
              name="note"
              value={donation.note}
              onChange={handleChange}
              placeholder="Additional note for the pickup person"
            />
          </div>

          <div>
            <label>Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button type="submit">Submit Donation</button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;
