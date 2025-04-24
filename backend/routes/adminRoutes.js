import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connection as db } from '../config/db.js';

import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Registration
router.post('/register-admin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  db.execute('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.execute(
      'INSERT INTO admins (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

        res.status(201).json({ success: true, message: 'Admin registered successfully.' });
      }
    );
  });
});

// Admin Login
router.post('/login-admin', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  db.execute('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin',
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ success: true, message: 'Logged in successfully', token });
  });
});

// Admin Dashboard (Protected Route)
router.get('/dashboard', authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

// Get all distributors (Public)
// Fetch all distributors
router.get('/distributors', (req, res) => {
  db.query('SELECT * FROM distributors', (err, results) => {
    if (err) {
      console.error('Error fetching distributors:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// Verify/Unverify distributor
router.put('/verify-distributor/:id', (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;  // either 0 or 1

  const sql = 'UPDATE distributors SET verified = ? WHERE id = ?';

  db.query(sql, [verified, id], (err, result) => {
    if (err) {
      console.error('Error updating distributor verification:', err);
      return res.status(500).json({ error: 'Failed to update distributor verification' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    res.status(200).json({ message: 'Distributor verification status updated successfully' });
  });
});

// Delete a donor or distributor (Public)
// Route to delete a donor
router.delete('/admin/remove-donor/:id', (req, res) => {
  const donorId = req.params.id;

  const sql = 'DELETE FROM donors WHERE id = ?';

  db.query(sql, [donorId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting donor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    res.status(200).json({ message: 'Donor removed successfully' });
  });
});

// Route to delete a distributor
router.delete('/admin/remove-distributor/:id', (req, res) => {
  const distributorId = req.params.id;

  const sql = 'DELETE FROM distributors WHERE id = ?';

  db.query(sql, [distributorId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting distributor' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    res.status(200).json({ message: 'Distributor removed successfully' });
  });
});


// Update donation status (Public)
router.patch('/donation-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Donation status is required.' });
  }

  db.execute('UPDATE donations SET status = ? WHERE id = ?', [status, id], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }

    res.json({ success: true, message: 'Donation status updated successfully' });
  });
});

// Get all disasters (Public)
router.get('/disasters', (req, res) => {
  const query = 'SELECT * FROM disasters ORDER BY dateReported DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching disasters:', err);
      return res.status(500).json({ message: 'Error fetching disasters' });
    }
    res.json(results);
  });
});

// Report disaster (Public)
router.post('/disasters', (req, res) => {
  const { type, description, region, severity } = req.body;

  if (!type || !description || !region || !severity) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const dateReported = new Date();

  db.execute(
    'INSERT INTO disasters (type, description, region, severity, dateReported) VALUES (?, ?, ?, ?, ?)',
    [type, description, region, severity, dateReported],
    (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

      res.json({ success: true, message: 'Disaster reported', disasterId: results.insertId });
    }
  );
});

// Add a new disaster (Public)
router.post('/admin/add-disaster', (req, res) => {
  const { title, description, location, type, region, severity, notify_users = false } = req.body;

  if (!title || !description || !location || !type || !region || !severity) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const dateReported = new Date();

  const query = 'INSERT INTO disasters (title, description, location, type, region, severity, dateReported, notify_users) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [title, description, location, type, region, severity, dateReported, notify_users], (err, results) => {
    if (err) {
      console.error('Error adding disaster:', err);
      return res.status(500).json({ message: 'Error adding disaster' });
    }

    const disasterId = results.insertId;
    if (notify_users) {
      sendNotificationToUsers(disasterId);
    }

    res.status(201).json({ message: 'Disaster added successfully', disasterId });
  });
});

// Function to send notifications to users (still public)
const sendNotificationToUsers = (disasterId) => {
  console.log(`Notification sent for disaster with ID: ${disasterId}`);
};


export default router;
