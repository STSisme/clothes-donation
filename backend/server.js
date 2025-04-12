import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import donatedClothesRoutes from './routes/donatedClothes.js';
import exportRoutes from './routes/exportRoutes.js';
import distributorRoutes from './routes/distributors.js';
import donorRoutes from './routes/donorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // To serve uploaded files


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

// Resolve __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup multer for image upload (store temporarily in memory)
const upload = multer({ 
  storage: multer.memoryStorage()  // Store the file in memory
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
        profile_image: user.profile_image  // The base64 image string stored in the DB
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

// Image upload route to update profile image (store as Base64 in DB)
app.post('/api/uploadProfileImage', upload.single('image'), (req, res) => {
  const { userId } = req.body;  // Assuming the userId is passed in the request
  const imageBuffer = req.file.buffer;  // Image file in memory as a buffer

  // Convert the buffer to a Base64 string
  const base64Image = imageBuffer.toString('base64');

  // Update the user's profile image in the database (Base64 string)
  const query = 'UPDATE users SET profile_image = ? WHERE id = ?';
  db.query(query, [base64Image, userId], (err, results) => {
    if (err) return res.status(500).send('Error saving image to the database');
    res.json({ message: 'Image uploaded and saved successfully' });
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/distributor', distributorRoutes);
app.use('/api/donor', donorRoutes);
app.use('/api/donated-clothes', donatedClothesRoutes);
app.use('/api', exportRoutes);

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
