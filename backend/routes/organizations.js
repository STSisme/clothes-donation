import express from 'express';
import { connection } from '../config/db.js';  // Ensure you have the correct path to your DB configuration

const router = express.Router();

// Endpoint to get the list of organizations (distributors)
router.get('/', (req, res) => {
  // Query the 'distributors' table to get the organization names
  const query = 'SELECT id, organization_name FROM distributors';  // Replace with your actual column name

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching organizations:', err);
      return res.status(500).json({ error: 'Failed to fetch organizations' });
    }
    res.json(results); // Send the results to the frontend
  });
});

export default router;
