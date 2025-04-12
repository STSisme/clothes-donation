import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2';

const router = express.Router();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clothes_donation_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

// REGISTER Donor only
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone_number, address, profile_image, points } = req.body;

    if (!name || !email || !password || !phone_number || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields except profile_image and points are required.',
      });
    }

    // Check if donor already exists
    const checkQuery = 'SELECT * FROM donors WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });
      }

      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new donor
      const insertQuery = `
        INSERT INTO donors (name, email, password, phone_number, address, profile_image, points)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(
        insertQuery,
        [name, email, hashedPassword, phone_number, address, profile_image || null, points || 0],
        (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });
          }

          res.status(201).json({ success: true, message: 'Donor registered successfully.' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
  }
});

// REGISTER Distributor
router.post('/register-distributor', async (req, res) => {
  try {
    const { organization_name, contact_name, email, password, phone_number, address } = req.body;

    if (!organization_name || !contact_name || !email || !password || !phone_number || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if distributor exists
    db.query('SELECT * FROM distributors WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error', error: err });

      if (results.length > 0) {
        return res.status(409).json({ message: 'Email is already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        `INSERT INTO distributors (organization_name, contact_name, email, password, phone_number, address)
          VALUES (?, ?, ?, ?, ?, ?)`,
        [organization_name, contact_name, email, hashedPassword, phone_number, address],
        (err) => {
          if (err) return res.status(500).json({ message: 'Database error', error: err });
          res.status(201).json({ message: 'Distributor registered successfully' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering distributor.', error: error.message });
  }
});

// LOGIN (Donor / Distributor / Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check in Donor table first
    const donorQuery = 'SELECT * FROM donors WHERE email = ?';
    db.query(donorQuery, [email], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });

      let user = results[0];
      let role = 'Donor';

      // If not found in donors, check distributors
      if (!user) {
        const distributorQuery = 'SELECT * FROM distributors WHERE email = ?';
        db.query(distributorQuery, [email], async (err, results) => {
          if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });

          user = results[0];
          role = 'Distributor';

          // If not found in distributors, check admin
          if (!user) {
            const adminQuery = 'SELECT * FROM admins WHERE email = ?';
            db.query(adminQuery, [email], async (err, results) => {
              if (err) return res.status(500).json({ success: false, message: 'Database error', error: err.sqlMessage });

              user = results[0];
              role = 'Admin';
              if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

              const isMatch = await bcrypt.compare(password, user.password);
              if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password.' });

              const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
              res.status(200).json({
                success: true,
                message: 'Login successful',
                token,
                user: {
                  id: user.id,
                  fullName: user.name || user.organization_name || 'Admin',
                  email: user.email,
                  role,
                },
              });
            });
          } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password.' });

            const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({
              success: true,
              message: 'Login successful',
              token,
              user: {
                id: user.id,
                fullName: user.name || user.organization_name,
                email: user.email,
                role,
              },
            });
          }
        });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password.' });

        const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            fullName: user.name,
            email: user.email,
            role,
          },
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
});

export default router;
