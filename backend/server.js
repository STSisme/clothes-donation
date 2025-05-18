import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import {connection as db, connectDB} from "./config/db.js"

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import donationRoutes from "./routes/donationRoutes.js";
import disasterRoutes from "./routes/disasterRoutes.js";
import organizationRoutes from "./routes/organizationRoutes.js";
import distributionRoutes from "./routes/distributionRoutes.js";

dotenv.config();

connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/disasters", disasterRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/distributions", distributionRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
