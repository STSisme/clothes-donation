import express from 'express';
import mysql from 'mysql2';
import multer from 'multer';

const router = express.Router();

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'clothes_donation_db', // replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Multer setup (for image upload)
const storage = multer.memoryStorage(); // Store in memory; for production, use diskStorage
const upload = multer({ storage });

// Route to handle donations
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const donorInfo = JSON.parse(req.body.donorInfo);
    const clothesDetails = JSON.parse(req.body.clothesDetails);
    const donationMethod = JSON.parse(req.body.donationMethod);
    const imageBuffer = req.file ? req.file.buffer : null;
    const imageName = req.file ? req.file.originalname : null;

    // Construct SQL query for inserting donation
    const insertQuery = `
      INSERT INTO donations (donor_id, organization_id, cloth_type, \`condition\`, image_urls, method, pickup_time, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const donationData = [
      donorInfo.userId, // Donor ID
      donorInfo.organizationId, // Organization ID
      clothesDetails.clothType, // Cloth type
      clothesDetails.condition, // Condition
      imageName, // Image name (URLs could be handled differently based on storage)
      donationMethod.method, // Donation method (pickup/dropoff)
      donationMethod.pickupTime, // Pickup time (if applicable)
      'submitted', // Default status as 'submitted'
    ];

    // Insert the donation data into MySQL
    db.execute(insertQuery, donationData, (err, result) => {
      if (err) {
        console.error('Error inserting donation:', err);
        return res.status(500).json({ error: 'Failed to save donation' });
      }

      // If image exists, save it to a separate table (optional, based on your needs)
      if (imageBuffer) {
        const imageQuery = `
          INSERT INTO donation_images (donation_id, image_data, content_type)
          VALUES (?, ?, ?)
        `;

        db.execute(imageQuery, [result.insertId, imageBuffer, req.file.mimetype], (err, result) => {
          if (err) {
            console.error('Error inserting image data:', err);
            return res.status(500).json({ error: 'Failed to save image' });
          }

          res.status(200).json({ message: 'Donation received successfully' });
        });
      } else {
        res.status(200).json({ message: 'Donation received successfully' });
      }
    });
  } catch (err) {
    console.error('Error in POST /donations:', err);
    res.status(500).json({ error: 'Failed to save donation' });
  }
});

// Route to get all donated clothes
router.get('/api/donated-clothes', async (req, res) => {
  try {
    const selectQuery = 'SELECT * FROM donations';
    db.execute(selectQuery, (err, results) => {
      if (err) {
        console.error('Error fetching donations:', err);
        return res.status(500).json({ error: 'Error fetching donations' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

// Route to get donations by user ID
router.get('/donations/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const selectQuery = 'SELECT * FROM donations WHERE donor_id = ?';
    db.execute(selectQuery, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching user donations:', err);
        return res.status(500).json({ error: 'Error fetching user donations' });
      }
      res.status(200).json(results);
    });
  } catch (error) {
    console.error('Error fetching user donations:', error);
    res.status(500).json({ error: 'Error fetching user donations' });
  }
});

export default router;
