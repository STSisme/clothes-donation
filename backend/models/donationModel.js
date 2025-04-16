import express from 'express';
import { connection } from './config/db.js';  
import { authenticateToken, authorizeRoles } from './middleware/authMiddleware';  // Make sure you're using authenticateToken

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());  // This line is crucial for parsing JSON data

// Donation registration route for donors and admins
app.post('/api/donations/register', authenticateToken, authorizeRoles('donor', 'admin'), (req, res) => {
  const {
    donor_id,
    organization_id,
    cloth_type,
    cloth_condition,
    method,
    pickup_address,
    pickup_time,
    note,
    image_url
  } = req.body;

  // Handle the pickup address and pickup time if method is 'pickup'
  const address = method === 'pickup' ? pickup_address : null;
  const time = method === 'pickup' ? pickup_time : null;

  const status = 'pending';

  const query = `
    INSERT INTO donations (
      donor_id, 
      organization_id, 
      cloth_type, 
      cloth_condition, 
      method, 
      pickup_address,
      pickup_time, 
      note, 
      status, 
      image_url
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    donor_id,
    organization_id,
    cloth_type,
    cloth_condition,
    method,
    address,
    time,
    note,
    status,
    image_url
  ];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error inserting donation:', err);
      return res.status(500).json({ error: 'Failed to submit donation' });
    }

    // Optionally return the inserted donation ID or other details
    const insertedDonationId = results.insertId;

    res.status(201).json({ 
      message: 'Donation submitted successfully', 
      donationId: insertedDonationId 
    });
  });
});

export default app;
