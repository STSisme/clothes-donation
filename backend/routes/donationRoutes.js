import express from 'express';
import { connection } from '../config/db.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// POST route for registering a donation
router.post('/api/donations/register', authorizeRoles('donor', 'admin'), (req, res) => {
    // Check if the connection is alive
    connection.ping((err) => {
      if (err) {
        console.error('Database connection issue', err);
        return res.status(500).json({ error: 'Database connection issue' });
      }
    });
  
    // Destructure incoming request body
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
  
    // Verify if donor exists in the donors table
    const checkDonorQuery = 'SELECT * FROM donors WHERE id = ?';
    
    connection.query(checkDonorQuery, [donor_id], (err, result) => {
      if (err) {
        console.error('Error verifying donor:', err);
        return res.status(500).json({ error: 'Error verifying donor' });
      }
      if (result.length === 0) {
        return res.status(400).json({ error: 'Invalid donor ID. Donor does not exist.' });
      }
  
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
  
      console.log('Executing query with values:', values); // Add this to debug
  
      connection.query(query, values, (err, results) => {
        if (err) {
          console.error('Error inserting donation:', err);
          return res.status(500).json({ error: 'Failed to submit donation' });
        }
        console.log('Inserted donation successfully:', results);
        res.status(201).json({ message: 'Donation submitted successfully' });
      });
    });
  });
  

  router.get('/api/donations/donor/:donorId', (req, res) => {
    const { donorId } = req.params;
    const query = 'SELECT * FROM donations WHERE donor_id = ? ORDER BY id DESC';
  
    connection.query(query, [donorId], (err, results) => {
      if (err) {
        console.error('Error fetching donor donations:', err);
        return res.status(500).json({ error: 'Failed to fetch donations' });
      }
      res.status(200).json(results);
    });
  });

// GET all donations
router.get('/', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM donations');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching donations:', err); // 👈 check what this logs
      res.status(500).json({ error: 'Server error' });
    }
  });
  

// ✅ Update status
  router.put('/api/donations/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      await db.query('UPDATE donations SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'Status updated successfully' });
    } catch (err) {
      console.error('Error updating donation status:', err);
      res.status(500).json({ error: 'Failed to update donation status' });
    }
  });
  

export default router;
