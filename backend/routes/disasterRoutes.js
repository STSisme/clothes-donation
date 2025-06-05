import express from 'express';
import { connection as db } from '../config/db.js';
import sendEmail from '../config/nodeMailer.js';

const router = express.Router();

router.get("", async (req, res) => {
  const query = "SELECT * FROM disasters ORDER BY dateReported DESC";
  try {
    const [response] = await db.query(query);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching disasters",
      error: error.message,
    });
  }
});

router.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM disasters WHERE id = ?";
    const [result] = await db.query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found.",
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching disaster detail:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching disaster detail.",
      error: error.message,
    });
  }
});

router.post("/create", async (req, res) => {
  const {
    title,
    description,
    location,
    region,
    severity,
    type,
    latitude,
    longitude,
  } = req.body;

  if (!title || !description || !location || !region || !severity || !type) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const query = `
      INSERT INTO disasters (title, description, location, region, severity, type, latitude, longitude, dateReported)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      title,
      description,
      location,
      region,
      severity,
      type,
      latitude || null,
      longitude || null,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      return res.status(201).json({
        success: true,
        message: "Disaster created successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Failed to create disaster.",
      });
    }
  } catch (error) {
    console.error("Disaster creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating disaster.",
      error: error.message,
    });
  }
});

router.post("/notify/:userId/:disasterId", async (req, res) => {
  const distributorId = req.params.userId;
  const disasterId = req.params.disasterId;

  try {
    console.log("🔔 Notify API Hit:", { distributorId, disasterId });

    const [orgRes] = await db.query(
      "SELECT organization_id FROM users WHERE id = ?",
      [distributorId]
    );
    if (!orgRes.length)
      return res.status(400).json({ message: "Distributor not found." });

    const orgId = orgRes[0].organization_id;

    const [disasterRes] = await db.query(
      "SELECT * FROM disasters WHERE id = ?",
      [disasterId]
    );
    if (!disasterRes.length)
      return res.status(404).json({ message: "Disaster not found." });

    const disaster = disasterRes[0];

    const [users] = await db.query(
      `
      SELECT DISTINCT u.id, u.email
      FROM users u
      JOIN donations d ON d.donor_id = u.id
      WHERE d.organization_id = ?
    `,
      [orgId]
    );

    console.log("👥 Users to Notify:", users);

    const notifications = users.map((user) => [
      "Donation Request: Disaster Relief",
      `A disaster (${disaster.title}) has occurred. Please consider donating again.`,
      disasterId,
      user.id,
    ]);

    if (notifications.length === 0) {
      return res
        .status(400)
        .json({ message: "No donors found to notify." });
    }

    await db.query(
      `
      INSERT INTO notifications (title, message, disaster_id, user_id)
      VALUES ?
    `,
      [notifications]
    );

    users.forEach((user) => {
      sendEmail(user.email, {
        subject: "Disaster Relief Needed",
        body: `Hello,\n\n${disaster.description}\n\nPlease consider donating again.`,
      });
    });

    await db.query(
      `UPDATE disasters SET notify_users = 1 WHERE id = ?`,
      [disasterId]
    );

    res.status(200).json({ message: "Notifications sent." });
  } catch (err) {
    console.error("❌ Notify Route Error:", err);
    res.status(500).json({ message: "Failed to notify users." });
  }
});



router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    region,
    severity,
    type,
    latitude,
    longitude,
  } = req.body;

  if (!title || !description || !location || !region || !severity || !type) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const query = `
      UPDATE disasters
      SET title = ?, description = ?, location = ?, region = ?, severity = ?, type = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `;
    const values = [
      title,
      description,
      location,
      region,
      severity,
      type,
      latitude || null,
      longitude || null,
      id,
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: "Disaster updated successfully.",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Disaster not found or no changes made.",
      });
    }
  } catch (error) {
    console.error("Disaster update error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating disaster.",
      error: error.message,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM disasters WHERE id = ?";
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Disaster not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Disaster deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting disaster:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting disaster.",
      error: error.message,
    });
  }
});

export default router;
