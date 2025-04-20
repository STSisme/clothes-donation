// disasterRoutes.js
import express from 'express';
import { connection } from '../config/db.js';

const router = express.Router();

// GET all disasters
router.get('/', (req, res) => {
  connection.query('SELECT * FROM disasters ORDER BY dateReported DESC', (err, results) => {
    if (err) {
      console.error('Error fetching disasters:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

// POST new disaster
router.post('/', (req, res) => {
  const { title, description, location, type, region, severity, notify_users } = req.body;
  const dateReported = new Date();

  if (!title || !description || !location || !type || !region || !severity) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = `
    INSERT INTO disasters (title, description, location, type, region, severity, notify_users, dateReported)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(sql, [title, description, location, type, region, severity, notify_users, dateReported], (err, result) => {
    if (err) {
      console.error('Error inserting disaster:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Disaster added successfully', id: result.insertId });
  });
});

export default router;
