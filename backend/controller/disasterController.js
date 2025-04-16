const db = require('../config/db');

// GET all disasters
const getDisasters = (req, res) => {
  db.query('SELECT * FROM disasters ORDER BY dateReported DESC', (err, results) => {
    if (err) {
      console.error('Error fetching disasters:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.status(200).json(results);
  });
};

// POST a new disaster
const createDisaster = (req, res) => {
  const { title, description, location, type, region, severity, notify_users } = req.body;

  if (!title || !description || !location || !type || !region || !severity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const sql = `
    INSERT INTO disasters (title, description, location, type, region, severity, notify_users)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [title, description, location, type, region, severity, notify_users || false];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error adding disaster:", err);
      return res.status(500).json({ message: 'Error adding disaster' });
    }

    res.status(201).json({ message: 'Disaster added successfully' });
  });
};

module.exports = {
  getDisasters,
  createDisaster,
};
