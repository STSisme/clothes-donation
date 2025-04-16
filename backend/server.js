import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import multer from 'multer';
import multerS3 from 'multer-s3'; // For AWS S3 storage
import AWS from 'aws-sdk'; // For AWS S3 setup
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import distributorRoutes from './routes/distributors.js';
import donorRoutes from './routes/donorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js'; 
import organizationRoutes from './routes/organizations.js';
import path from 'path';
import { connectDB, connection } from './config/db.js';



dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // To serve uploaded files
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// MySQL connection setup using mysql2 package
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clothes_donation_db',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); // Stop the server if database connection fails
  } else {
    console.log('Connected to MySQL database');
  }
});

app.use("/uploads", express.static("uploads"));

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve the homepage (NGOs page)
app.get('/', (req, res) => {
  // Here, you can send a static HTML file or dynamically render the page
  res.sendFile(path.join(__dirname, 'index.html'));
});



// Storing images locally in the server (filesystem)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set destination directory (ensure it exists)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filenames
  }
});

// Or, if you want to use AWS S3 for cloud storage
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Setup multer for image upload (store in AWS S3)
const s3Storage = multerS3({
  s3: s3,
  bucket: 'your-s3-bucket-name', // Your S3 bucket name
  acl: 'public-read', // Set the file permission (can be private or public-read)
  key: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // File name on S3
  },
});

// Use multer based on your preference (local storage or cloud storage)
const upload = multer({
  storage: storage, // Use s3Storage for AWS S3, or storage for local file system
});

// Fetch user data by userId (with profile image URL)
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user data');
    }
    if (results.length > 0) {
      const user = results[0];
      // Return user data with profile image URL (if any)
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        points: user.points,
        profile_image: user.profile_image // The URL or Base64 image string stored in the DB
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Image upload route to update profile image (store as Base64 or S3 URL in DB)
app.post('/api/uploadProfileImage', upload.single('image'), (req, res) => {
  const { userId } = req.body;  // Assuming the userId is passed in the request

  let imageUrl;
  
  // For local storage (File System)
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`; // Path to the uploaded file
  }
  
  // For AWS S3 storage
  if (req.file && req.file.location) {
    imageUrl = req.file.location; // URL from S3
  }

  // Update the user's profile image URL in the database
  const query = 'UPDATE users SET profile_image = ? WHERE id = ?';
  db.query(query, [imageUrl, userId], (err, results) => {
    if (err) return res.status(500).send('Error saving image to the database');
    res.json({ message: 'Image uploaded and saved successfully', imageUrl });
  });
});

// Use routes
app.use('/api/auth', authRoutes); 
app.use('/api/admin', adminRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api', exportRoutes);
app.use('/disasters', disasterRoutes);
app.use('/api/organizations', organizationRoutes);



// Endpoint to register a donation
app.post('/api/donations/register', (req, res) => {
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

  // Check if any required fields are missing
  if (!donor_id || !organization_id || !cloth_type || !cloth_condition || !method) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const status = 'pending';

  // Handle pickup_address and pickup_time: set to null if method is dropoff
  const address = method === 'pickup' ? pickup_address : null;
  const time = method === 'pickup' ? pickup_time : null;

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

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('❌ Error inserting donation:', err);
      return res.status(500).json({ error: 'Failed to submit donation' });
    }
    res.status(201).json({ message: '✅ Donation submitted successfully' });
  });
});



// Endpoint to get distributor data from MySQL
app.get('/distributors', (req, res) => {
  const sql = 'SELECT * FROM distributors'; // Your distributors table query

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results); // Send distributor data as JSON
    }
  });
});


// Serve the distributor info page dynamically
app.get('/distributor/:id', (req, res) => {
  const distributorId = req.params.id;
  const sql = 'SELECT * FROM distributors WHERE id = ?';

  db.query(sql, [distributorId], (err, results) => {
    if (err) {
      res.status(500).send('Database query error');
    } else {
      res.json(results[0]); // Send data of the specific distributor
    }
  });
});



// Test route for troubleshooting
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
