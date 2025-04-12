import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ✅ MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your MySQL root password
  database: 'clothes_donation_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
    process.exit(1);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Disk Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ✅ Distributor Registration Route
router.post('/register', upload.single('verificationDocs'), async (req, res) => {
  try {
    console.log('📩 Incoming registration request');

    const {
      organization_name,
      organization_type,  // Updated to match the column name in DB
      contact_person_name,
      phone_number,
      email,
      password,
      official_address,
      website_social_media,
      description,
      areas_of_operation
    } = req.body;

    console.log('📝 Form Data:', req.body);

    // Validate required fields
    if (!organization_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the email already exists
    const [existing] = await db.promise().execute(
      'SELECT * FROM distributors WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Distributor with this email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle file upload (verificationDocs)
    const verificationDocs = req.file ? req.file.filename : null;
    console.log('📎 Uploaded file:', verificationDocs);

    // Insert the distributor's data into the database
    const insertQuery = `
      INSERT INTO distributors (
        organization_name, organization_type, contact_person_name, phone_number, email, password,
        official_address, website_social_media, description, areas_of_operation,
        verificationDocs, verified, points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().execute(insertQuery, [
      organization_name,
      organization_type,  // Updated to match the correct column name in DB
      contact_person_name,
      phone_number,
      email,
      hashedPassword,
      official_address,
      website_social_media,
      description,
      areas_of_operation,
      verificationDocs,
      false,  // verified status (default false)
      0       // points (default 0)
    ]);

    console.log('✅ Registration complete:', result.insertId);
    res.status(201).json({ message: 'Registration successful!', id: result.insertId });

  } catch (err) {
    console.error('❌ Error during registration:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Distributor with this email already exists' });
    }
    res.status(500).json({
      error: 'An error occurred during registration. Please try again later.',
      details: err.message  // Include detailed error message in response
    });
  }
});

export default router;
