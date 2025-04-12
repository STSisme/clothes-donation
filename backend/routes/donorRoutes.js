import express from 'express';
import mysql from 'mysql2/promise'; // Use promise-based connection

const router = express.Router();

// MySQL connection setup (using Promise-based version)
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'clothes_donation_db', // replace with your database name
});

db.connect().then(() => {
  console.log('Connected to MySQL database');
}).catch((err) => {
  console.error('Error connecting to MySQL:', err);
  process.exit(1);
});

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
