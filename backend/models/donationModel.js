import express from 'express';
import { connection } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
// Donation registration route
router.post('/register', authenticateToken, authorizeRoles('donor', 'admin'), (req, res) => {
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

    res.status(201).json({ 
      message: 'Donation submitted successfully', 
      donationId: results.insertId 
    });
  });
});

export default router;
