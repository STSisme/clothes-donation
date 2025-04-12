import React, { useState } from 'react';
import './DonationPage.css';
import donationImage from '../images/0c3d2f0a5134100e32d66f1caa74bb72.jpg';

const DonationPage = () => {
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const [clothesDetails, setClothesDetails] = useState({
    type: '',
    condition: '',
    quantity: '',
    image: null,
  });

  const [donationMethod, setDonationMethod] = useState({
    method: '',
    timeSlot: '',
    note: '',
  });

  const [donationStatus, setDonationStatus] = useState('submitted');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleClothesDetailsChange = (e) => {
    const { name, value } = e.target;
    setClothesDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonationMethodChange = (e) => {
    const { name, value } = e.target;
    setDonationMethod((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('donorInfo', JSON.stringify(donorInfo));
    formData.append(
      'clothesDetails',
      JSON.stringify({
        type: clothesDetails.type,
        condition: clothesDetails.condition,
        quantity: clothesDetails.quantity,
        image: clothesDetails.image?.name || '',
      })
    );
    formData.append('donationMethod', JSON.stringify(donationMethod));
    if (clothesDetails.image) {
      formData.append('image', clothesDetails.image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/donated-clothes', {
        method: 'POST',
        body: formData,
      });
      

      if (response.ok) {
        setDonationStatus('in-progress');
        alert('Thank you for your donation! Your donation is now being processed.');
      } else {
        alert('Error submitting donation. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Server error. Please try again later.');
    }
  };

  return (
    <section className="donation-page">
      <h1>Give Clothes, Share Hope</h1>
      <form onSubmit={handleFormSubmit} className="donation-form">
        {/* Info Section */}
        <div className="info-section">
          <img src={donationImage} alt="Donate Clothes" />
          <p>
            Every piece of clothing you donate goes a long way in bringing warmth and comfort to someone in need. Let’s build a better, more caring world together.
          </p>

          {donationStatus === 'in-progress' && (
            <div className="thank-you">
              <h3>Thank You, {donorInfo.name}!</h3>
              <p>Your donation is now being processed.</p>
              <button>Track Donation Status</button>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="form-section">
          {/* Donor Info */}
          <div className="section">
            <h2>Donor Information</h2>
            <input type="text" name="name" value={donorInfo.name} onChange={handleInputChange} placeholder="Your Name" required />
            <input type="email" name="email" value={donorInfo.email} onChange={handleInputChange} placeholder="Your Email" required />
            <input type="tel" name="phone" value={donorInfo.phone} onChange={handleInputChange} placeholder="Your Phone Number" required />
            <input type="text" name="location" value={donorInfo.location} onChange={handleInputChange} placeholder="Your Location" required />
          </div>

          {/* Clothes Details */}
          <div className="section">
            <h2>Clothes Details</h2>
            <select name="type" value={clothesDetails.type} onChange={handleClothesDetailsChange} required>
              <option value="">Select Clothing Type</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="winterwear">Winterwear</option>
              <option value="traditional">Traditional</option>
              <option value="accessories">Accessories</option>
            </select>
            <select name="condition" value={clothesDetails.condition} onChange={handleClothesDetailsChange} required>
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="gently-used">Gently Used</option>
              <option value="needs-repair">Needs Repair</option>
            </select>
            <input type="number" name="quantity" value={clothesDetails.quantity} onChange={handleClothesDetailsChange} placeholder="Quantity" required min="1" />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setClothesDetails({ ...clothesDetails, image: e.target.files[0] })}
            />
          </div>

          {/* Donation Method */}
          <div className="section">
            <h2>Donation Method</h2>
            <select name="method" value={donationMethod.method} onChange={handleDonationMethodChange} required>
              <option value="">Preferred Method</option>
              <option value="pickup">Pickup</option>
              <option value="dropoff">Drop-off</option>
            </select>
            {donationMethod.method === 'pickup' && (
              <input type="time" name="timeSlot" value={donationMethod.timeSlot} onChange={handleDonationMethodChange} required />
            )}
            <textarea name="note" value={donationMethod.note} onChange={handleDonationMethodChange} placeholder="Optional note for pickup person" />
          </div>

          <button type="submit" className="donate-btn">Donate Now</button>
        </div>
      </form>
    </section>
  );
};

export default DonationPage;
