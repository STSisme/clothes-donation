import express from "express";
import { connection as db } from "../config/db.js";
import { upload } from "../config/mutlerConfig.js";
import bcrypt from "bcryptjs";

const router = express.Router();

const getUserByIdQuery = "SELECT * FROM users WHERE id = ?";

router.get("", async (req, res) => {
  const query = "SELECT * FROM users";

  try {
    const [users] = await db.query(query);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
})
.get("/detail/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await db.query(getUserByIdQuery, [id]);

    if (result.length > 0) {
      return res.status(200).json(result[0]);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Server error", error: err });
  }
})
.get("/:role", async (req, res) => {
  const role = req.params.role;
  const query = "SELECT * FROM users WHERE role = ?";

  try {
    const [response] = await db.query(query, [role]);
    if (response.length > 0) {
      res.status(200).json(response);
    }else{
      res.status(500).json({
        message: `Failed to get users of the role ${role}`
      });
    }
  } catch (error) {
    res.status(500).json({
        message: error,
      });
  }
});

router.put("/update/:id", upload.single("profile_image"), async (req, res) => {
  const id = req.params.id;
  const { full_name, phone_number, address, is_verified } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = `${req.file.filename}`;
  }

  if (!full_name && !phone_number && !address && !req.file && is_verified === undefined) {
    return res
      .status(400)
      .json({ message: "At least one field (or image) is required to update" });
  }

  const updateFields = [];
  const updateValues = [];

  if (full_name) {
    updateFields.push("full_name = ?");
    updateValues.push(full_name);
  }
  if (phone_number) {
    updateFields.push("phone_number = ?");
    updateValues.push(phone_number);
  }
  if (address) {
    updateFields.push("address = ?");
    updateValues.push(address);
  }
  if (imagePath) {
    updateFields.push("profile_image = ?");
    updateValues.push(imagePath);
  }
  if (typeof is_verified !== "undefined") {
    const verifiedValue = is_verified === "true" || is_verified === true ? 1 : 0;
    updateFields.push("is_verified = ?");
    updateValues.push(verifiedValue);
  }

  updateValues.push(id);

  const updateUserQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

  try {
    const [result] = await db.query(updateUserQuery, updateValues);

    if (result.affectedRows > 0) {
      const getUserByIdQuery = "SELECT * FROM users WHERE id = ?";
      const [updatedUser] = await db.query(getUserByIdQuery, [id]);

      if (updatedUser.length > 0) {
        return res.status(200).json(updatedUser[0]);
      } else {
        return res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(404).json({ message: "User not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
})
.put("/approve/:id", async (req, res) => {
  const id = req.params.id;

  const query = "UPDATE users SET is_verified = 1 WHERE id = ?";
  try {
    const [result] = await db.query(query, [id]);
    if (result.affectedRows > 0) {
      const [updatedUser] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
      res.status(200).json(updatedUser[0]);
    }else{
      res.status(500).json({
        message: "Failed To Approve The User"
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error
    });
  }
});

router.post("/create", upload.single("profile_image"), async (req, res) => {
  try {
    const {
      role,
      full_name,
      email,
      password,
      phone_number,
      address,
      points,
      organization_id,
      is_verified
    } = req.body;

    const userRole = role || "donor";

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
      (!full_name || !email || !password || !phone_number || !address)
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required for admin.",
      });
    }

    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }

    let is_approved = false;
    if (userRole === "donor") {
      is_approved = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImagePath = req.file ? req.file.filename : null;

    const isVerifiedValue = is_verified === "true" || is_verified === true ? 1 : 0;

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
      profileImagePath,
      points || 0,
      userRole === "distributor" ? organization_id : null,
      userRole,
      isVerifiedValue
    ];

    const [result] = await db.query(insertQuery, insertValues);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} created successfully.`,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "User creation failed.",
      });
    }
  } catch (error) {
    console.error("User creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during user creation.",
      error: error.message,
    });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const query = "DELETE FROM users WHERE id = ?";

  try {
    const [result] = await db.query(query, [id]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: `User with ${id} sucessfully deleted`
      })
    }else{
      res.status(500).json({
        message: "Failed In Deleting the User"
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error
    })
  }
});

export default router;
