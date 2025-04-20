import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection as db } from "../config/db.js";
import { registerDonor } from "../models/Donor.js";

const router = express.Router();

// REGISTER Donor
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      address,
      profile_image,
      points,
    } = req.body;

    if (!name || !email || !password || !phone_number || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields except profile_image and points are required.",
      });
    }

    const checkQuery = "SELECT * FROM donors WHERE email = ?";
    const [results] = await db.query(checkQuery, [email]);

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = [
      name,
      email,
      hashedPassword,
      phone_number,
      address,
      profile_image ?? null,
      points || 0,
    ];

    const insertId = await registerDonor(donor); // Ensure registerDonor returns a promise

    if (insertId) {
      return res.json({
        success: true,
        message: "Donor registered successfully.",
      });
    } else {
      return res.json({
        success: false,
        message: "Database error",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// REGISTER Distributor
router.post("/register-distributor", async (req, res) => {
  try {
    const {
      organization_name,
      contact_name,
      email,
      password,
      phone_number,
      address,
    } = req.body;

    if (
      !organization_name ||
      !contact_name ||
      !email ||
      !password ||
      !phone_number ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Check if distributor exists
    const [results] = await db.query("SELECT * FROM distributors WHERE email = ?", [email]);

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO distributors (organization_name, contact_name, email, password, phone_number, address)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        organization_name,
        contact_name,
        email,
        hashedPassword,
        phone_number,
        address,
      ]
    );

    res.status(201).json({ success: true, message: "Distributor registered successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering distributor.",
      error: error.message,
    });
  }
});

// Admin Registration Route
router.post("/register-admin", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone_number,
      address,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone_number ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    // Check if the email is already used
    const [results] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);

    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database
    const query = `
      INSERT INTO admins (fullName, email, password, phone_number, address)
      VALUES (?, ?, ?, ?, ?)`;

    await db.query(query, [fullName, email, hashedPassword, phone_number, address]);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// LOGIN (Donor / Distributor / Admin)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const checkUser = async (query) => {
      const [results] = await db.query(query, [email]);
      return results[0];
    };

    let user = await checkUser("SELECT * FROM donors WHERE email = ?");
    let role = "Donor";

    if (user) {
      if (user.isVerified === 0) {
        return res
          .status(403)
          .json({ success: false, message: "You must be verified to log in." });
      }
    } else {
      user = await checkUser("SELECT * FROM distributors WHERE email = ?");
      role = "Distributor";

      if (user) {
        if (user.isVerified === 0) {
          return res.status(403).json({
            success: false,
            message: "You must be verified to log in.",
          });
        }
      } else {
        user = await checkUser("SELECT * FROM admins WHERE email = ?");
        role = "Admin";

        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found." });
        }
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullName: user.name || user.contact_name || user.fullName,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed.", error: error.message });
  }
});

export default router;
