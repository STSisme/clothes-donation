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

// REGISTER Donor
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

// Admin Registration Route
router.post('/register-admin', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phone_number, address } = req.body;

    if (!fullName || !email || !password || !confirmPassword || !phone_number || !address) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check if the email is already used
    db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Email is already registered.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new admin into the database
      const query = `
        INSERT INTO admins (fullName, email, password, phone_number, address)
        VALUES (?, ?, ?, ?, ?)`;
      db.query(query, [fullName, email, hashedPassword, phone_number, address], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error', error: err });

        res.status(201).json({ success: true, message: 'Admin registered successfully.' });
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed.', error: error.message });
  }
});

// LOGIN (Donor / Distributor / Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = async (query) =>
      new Promise((resolve, reject) => {
        db.query(query, [email], (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        });
      });

    let user = await checkUser('SELECT * FROM donors WHERE email = ?');
    let role = 'Donor';

    if (user) {
      if (user.isVerified === 0) {
        return res.status(403).json({ success: false, message: 'You must be verified to log in.' });
      }
    } else {
      user = await checkUser('SELECT * FROM distributors WHERE email = ?');
      role = 'Distributor';

      if (user) {
        if (user.isVerified === 0) {
          return res.status(403).json({ success: false, message: 'You must be verified to log in.' });
        }
      } else {
        user = await checkUser('SELECT * FROM admins WHERE email = ?');
        role = 'Admin';

        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found.' });
        }
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.name || user.contact_name || user.fullName,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed.', error: error.message });
  }
});
// Login route for distributors
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Query to fetch distributor by email
  const sql = 'SELECT * FROM distributors WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const distributor = results[0];

    // Check if distributor is verified
    if (distributor.verified === 0) {
      return res.status(403).json({ error: 'Distributor not verified' });
    }

    // Check if password matches (assuming bcrypt is used for password hashing)
    bcrypt.compare(password, distributor.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: 'Error checking password' });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // If password matches, generate a JWT token
      const token = jwt.sign(
        { id: distributor.id, email: distributor.email },
        process.env.JWT_SECRET, // JWT secret from .env
        { expiresIn: '1h' } // Token expiration time
      );

      // Respond with the token
      res.status(200).json({ message: 'Login successful', token });
    });
  });
});



export default router;
