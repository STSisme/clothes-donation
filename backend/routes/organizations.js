import express from 'express';
import { connection as db } from '../config/db.js';  // Ensure you have the correct path to your DB configuration

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, organization_name FROM distributors')
    
    res.json(results); // Send the results to the frontend
  } catch (err) {
    console.error('Error fetching organizations:', err);
    return res.status(500).json({ error: 'Failed to fetch organizations' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Query to get the organization's details by its ID
    const [organization] = await db.query(
      'SELECT organization_name, latitude, longitude FROM distributors WHERE id = ?',
      [id]
    );

    // If no organization is found
    if (organization.length === 0) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Send back the organization details (name, latitude, longitude)
    res.json(organization[0]); // The result is an array, so we take the first element
  } catch (err) {
    console.error('Error fetching organization details:', err);
    res.status(500).json({ error: 'Failed to fetch organization details' });
  }
});


export default router;

