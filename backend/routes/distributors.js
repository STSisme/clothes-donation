import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// ✅ Ensure "uploads" folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage config
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
    console.log('📝 Form Data:', req.body);

    const {
      organization_name,
      organization_type,
      contact_name = '',
      phone_number = '',
      email,
      password,
      address = '',
      website = '',
      description = '',
      areas_of_operation = ''
    } = req.body;

    // ✅ Basic validation
    if (!organization_name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields (organization name, email, password).' });
    }

    // ✅ Check if distributor with same email exists
    const [existing] = await db.promise().execute(
      'SELECT * FROM distributors WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Distributor with this email already exists.' });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Handle file upload
    const profile_image = req.file ? req.file.filename : null;
    console.log('📎 Uploaded file:', profile_image);

    // ✅ Insert distributor into database
    const insertQuery = `
      INSERT INTO distributors (
        organization_name, organization_type, contact_name, phone_number, email, password,
        address, website, description, areas_of_operation,
        profile_image, verified, points
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.promise().execute(insertQuery, [
      organization_name,
      organization_type,
      contact_name,
      phone_number,
      email,
      hashedPassword,
      address,
      website,
      description,
      areas_of_operation,
      profile_image,     // ✅ renamed correctly
      false,             // verified
      0                  // points
    ]);

    console.log('✅ Registration successful. Insert ID:', result.insertId);
    res.status(201).json({ success: true, message: 'Registration successful!', id: result.insertId });

  } catch (err) {
    console.error('❌ Registration Error:', err.message);
    res.status(500).json({
      success: false,
      error: 'An error occurred during registration. Please try again later.',
      details: err.message // Remove in production
    });
  }
});

router.get('/admin/distributors', (req, res) => {
  const sql = 'SELECT id, organization_name, verified FROM distributors';
  
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching distributors' });
    }
    res.status(200).json(results);
  });
});

// Route to toggle the verification status of a distributor
router.put('/admin/verify-distributor/:id', (req, res) => {
  const distributorId = req.params.id;
  const { verified } = req.body; // The new verification status

  const sql = 'UPDATE distributors SET verified = ? WHERE id = ?';

  connection.query(sql, [verified, distributorId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating distributor verification status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Distributor not found' });
    }

    res.status(200).json({ message: 'Verification status updated' });
  });
});

export default router;
