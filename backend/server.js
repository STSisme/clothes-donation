import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {connection as db, connectDB} from "./config/db.js"
import {upload} from "./config/mutlerConfig.js"

// Routes
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import distributorRoutes from "./routes/distributors.js";
import donorRoutes from "./routes/donorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import disasterRoutes from "./routes/disasterRoutes.js";
import organizationRoutes from "./routes/organizations.js";

dotenv.config();

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Serve homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM users WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send("Error fetching user data");

    if (results.length > 0) {
      const user = results[0];
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number,
        address: user.address,
        points: user.points,
        profile_image: user.profile_image,
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});

// Upload profile image
app.post("/api/uploadProfileImage", upload.single("image"), (req, res) => {
  const { userId } = req.body;

  if (!req.file) return res.status(400).send("No image uploaded");

  const imageUrl = `/uploads/${req.file.filename}`;

  const query = "UPDATE users SET profile_image = ? WHERE id = ?";
  db.query(query, [imageUrl, userId], (err) => {
    if (err) return res.status(500).send("Error saving image to database");

    res.json({ message: "Image uploaded and saved successfully", imageUrl });
  });
});

// Get all distributors
app.get("/distributors", (req, res) => {
  const sql = "SELECT * FROM distributors";

  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("Database query error");
    } else {
      res.json(results);
    }
  });
});

// Get single distributor
app.get("/distributor/:id", (req, res) => {
  const distributorId = req.params.id;
  const sql = "SELECT * FROM distributors WHERE id = ?";

  db.query(sql, [distributorId], (err, results) => {
    if (err) {
      res.status(500).send("Database query error");
    } else {
      res.json(results[0]);
    }
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/distributor", distributorRoutes);
app.use("/api/donor", donorRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api", exportRoutes);
app.use("/disasters", disasterRoutes);
app.use("/api/organizations", organizationRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
