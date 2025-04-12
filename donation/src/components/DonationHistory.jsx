import React, { useEffect, useState } from 'react';
import './DonationHistory.css'

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);

  // Dummy data for demonstration
  const dummyData = [
    {
      donorInfo: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        location: 'New York, NY',
      },
      clothesDetails: {
        type: 'Jackets',
        condition: 'New',
        quantity: 5,
      },
      donationMethod: {
        method: 'Pickup',
        timeSlot: '10:00 AM - 12:00 PM',
      },
      status: 'Completed',
      createdAt: '2025-04-05T14:30:00Z',
    },
    {
      donorInfo: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '987-654-3210',
        location: 'Los Angeles, CA',
      },
      clothesDetails: {
        type: 'T-Shirts',
        condition: 'Used',
        quantity: 10,
      },
      donationMethod: {
        method: 'Drop-off',
        timeSlot: '2:00 PM - 4:00 PM',
      },
      status: 'Completed',
      createdAt: '2025-04-04T11:00:00Z',
    },
    {
      donorInfo: {
        name: 'Sam Lee',
        email: 'sam.lee@example.com',
        phone: '555-123-4567',
        location: 'Chicago, IL',
      },
      clothesDetails: {
        type: 'Winter Coats',
        condition: 'Good',
        quantity: 3,
      },
      donationMethod: {
        method: 'Pickup',
        timeSlot: '8:00 AM - 10:00 AM',
      },
      status: 'Pending',
      createdAt: '2025-04-03T16:45:00Z',
    },
  ];

  useEffect(() => {
    // Simulating fetching data from an API
    setDonations(dummyData);
  }, []);

  const handleExportClick = () => {
    // Export data as CSV (can be implemented here)
    console.log('Exporting CSV...');
  };

  return (
    <section className="donation-history">
      <h3>Donation History</h3>
      <table>
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Clothes Type</th>
            <th>Condition</th>
            <th>Quantity</th>
            <th>Method</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={index}>
              <td data-label="Donor Name">{donation.donorInfo.name}</td>
              <td data-label="Email">{donation.donorInfo.email}</td>
              <td data-label="Phone">{donation.donorInfo.phone}</td>
              <td data-label="Location">{donation.donorInfo.location}</td>
              <td data-label="Clothes Type">{donation.clothesDetails.type}</td>
              <td data-label="Condition">{donation.clothesDetails.condition}</td>
              <td data-label="Quantity">{donation.clothesDetails.quantity}</td>
              <td data-label="Method">{donation.donationMethod.method}</td>
              <td data-label="Time Slot">{donation.donationMethod.timeSlot}</td>
              <td data-label="Status">{donation.status}</td>
              <td data-label="Date">{new Date(donation.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleExportClick}>Export Report (CSV)</button>
    </section>
  );
};

export default DonationHistory;
