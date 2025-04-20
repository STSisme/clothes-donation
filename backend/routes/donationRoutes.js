import express from "express";
import { connection as db } from "../config/db.js"; // Assuming you're using db from mysql2/promise
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { upload } from "../config/mutlerConfig.js";

const router = express.Router();

// POST route for registering a donation
router.post(
  "/register",
  authorizeRoles("donor", "admin"),
  upload.single("image"),
  async (req, res) => {
    try {
      // Check if the connection is alive
      await db.ping();

      // Destructure incoming request body
      const {
        donor_id,
        organization_id,
        cloth_type,
        cloth_condition,
        method,
        pickup_address,
        pickup_time,
        note,
      } = req.body;

      // Get the uploaded image URL (path)
      const image_url = req.file ? `/uploads/${req.file.filename}` : null;

      // Verify if donor exists in the donors table
      const checkDonorQuery = "SELECT * FROM donors WHERE id = ?";
      const [result] = await db.execute(checkDonorQuery, [donor_id]);

      if (result.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid donor ID. Donor does not exist." });
      }

      // Handle the pickup address and pickup time if method is 'pickup'
      const address = method === "pickup" ? pickup_address : null;
      const time = method === "pickup" ? pickup_time : null;

      const status = "pending";

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
        image_url,
      ];

      console.log("Executing query with values:", values); // Add this to debug

      const [results] = await db.execute(query, values);
      console.log("Inserted donation successfully:", results);
      res.status(201).json({ message: "Donation submitted successfully" });
    } catch (err) {
      console.error("Error registering donation:", err);
      res.status(500).json({ error: "Failed to submit donation", details: err.message });
    }
  }
);

// Get all donations for a specific donor
router.get("/donor/:donorId", async (req, res) => {
  const { donorId } = req.params;

  try {
    const query = "SELECT * FROM donations WHERE donor_id = ? ORDER BY id DESC";
    const [results] = await db.execute(query, [donorId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching donor donations:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// GET all donations
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM donations");
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching donations:", err.message || err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Update donation status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.execute("UPDATE donations SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating donation status:", err);
    res.status(500).json({ error: "Failed to update donation status" });
  }
});

export default router;
