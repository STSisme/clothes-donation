import express from 'express';
import {connection as db} from "../config/db.js";

const router = express.Router();

// Update user profile
router.put('/profile/:id', async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;
  const userId = req.params.id;

  const query = `
    UPDATE donors 
    SET name = ?, phone_number = ?, address = ?
    WHERE id = ?
  `;
  
  try {
    const [results] = await db.execute(query, [fullName, phoneNumber, address, userId]);
    res.json({ message: 'Profile updated successfully', results });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM donors WHERE id = ?';
  
  try {
    const [results] = await db.execute(query, [userId]);
    
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Error loading profile' });
  }
});

export default router;
