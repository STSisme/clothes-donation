import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connection as db } from "../config/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      role,
      full_name,
      email,
      password,
      phone_number,
      address,
      profile_image,
      points,
      organization_id,
      confirmPassword,
    } = req.body;

    const userRole = role || "donor";

    console.log(req.body);
    
    
    if (
      userRole === "donor" &&
      (!full_name || !email || !password || !phone_number || !address)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields except profile_image and points are required for donor.",
      });
    }

    if (
      userRole === "distributor" &&
      (!organization_id || !email || !password || !phone_number || !address)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields except profile_image and points are required for distributor.",
      });
    }

    if (
      userRole === "admin" &&
      (!full_name ||
        !email ||
        !password ||
        !confirmPassword ||
        !phone_number ||
        !address)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for admin.",
      });
    }

    if (userRole === "admin" && password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match." });
    }

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (results.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (full_name, email, password, phone_number, address, profile_image, points, organization_id, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertValues = [
      full_name,
      email,
      hashedPassword,
      phone_number,
      address,
      profile_image || null,
      points || 0,
      userRole === "distributor" ? organization_id : null,
      userRole,
      userRole === "donor" ? true : false
    ];

    const [response] = await db.query(insertQuery, insertValues);

    if (response.affectedRows > 0) {
      const [newUserRows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      const newUser = newUserRows[0];

      const token = jwt.sign(
        { id: newUser.id, role: newUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      res.status(200).json({
        success: true,
        message: `${
          userRole.charAt(0).toUpperCase() + userRole.slice(1)
        } registered successfully.`,
        role: userRole,
        token,
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          email: newUser.email,
          role: newUser.role,
          organization_id: newUser.organization_id
        },
      });
    }else {
      res.status(200).json({
        success: false,
        message: `Failed to Register.`,
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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const user = results[0];

    if (
      (user.role === "distributor" || user.role === "admin") &&
      user.is_verified === 0
    ) {
      return res
        .status(403)
        .json({ success: false, message: "You must be verified to log in." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        organization_id: user.organization_id
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed.", error: error.message });
  }
});

export default router;
