import express from 'express';
import mysql from 'mysql2';

const router = express.Router();

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // XAMPP default host
  user: 'root', // Your XAMPP MySQL username (default is 'root')
  password: '', // Your XAMPP MySQL password (default is empty)
  database: 'clothes_donation_db', // The name of your database
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Stop the server if database connection fails
  } else {
    console.log('Connected to MySQL database');
  }
});

// Login Admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.execute('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    const admin = results[0];
    if (admin && admin.password === password) {
      res.json({ message: 'Login successful', admin });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

// Verify distributor
router.patch('/verify-distributor/:id', (req, res) => {
  const { id } = req.params;

  db.execute('UPDATE distributors SET isVerified = ? WHERE id = ?', [true, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Distributor verified', results });
  });
});

// Delete donor or distributor
router.delete('/delete-user/:id/:role', (req, res) => {
  const { id, role } = req.params;
  const table = role === 'donor' ? 'donors' : 'distributors';

  db.execute(`DELETE FROM ${table} WHERE id = ?`, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: `${role} deleted`, results });
  });
});

// Update donation status
router.patch('/donation-status/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.execute('UPDATE donations SET status = ? WHERE id = ?', [status, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Donation status updated', results });
  });
});

// Disaster reporting
router.post('/disasters', (req, res) => {
  const { type, description, region, severity } = req.body;
  const dateReported = new Date();

  db.execute(
    'INSERT INTO disasters (type, description, region, severity, dateReported) VALUES (?, ?, ?, ?, ?)',
    [type, description, region, severity, dateReported],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Disaster reported', disasterId: results.insertId });
    }
  );
});

export default router;
