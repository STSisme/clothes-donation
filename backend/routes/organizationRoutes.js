import express from "express";
import { connection as db } from "../config/db.js";
import { upload } from "../config/mutlerConfig.js";

const router = express.Router();

router.get("", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM organizations");
    res.json(results);
  } catch (err) {
    console.error("Error fetching organizations:", err);
    return res.status(500).json({ error: "Failed to fetch organizations" });
  }
})
.get("/detail/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [organization] = await db.query(
      "SELECT * FROM organizations WHERE id = ?",
      [id]
    );

    if (organization.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    res.json(organization[0]);
  } catch (err) {
    console.error("Error fetching organization details:", err);
    res.status(500).json({ error: "Failed to fetch organization details" });
  }
});

router.post("/create", upload.single("image_url"), async (req, res) => {
  const { name, description, phone_number, address, latitude, longitude } =
    req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = `${req.file.filename}`;
  }

  const insertValues = [
    name,
    description,
    phone_number,
    address,
    latitude,
    longitude,
    imagePath,
  ];

  const query =
    "INSERT INTO organizations(name, description, phone_number, address, latitude, longitude, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";

  try {
    const [response] = await db.query(query, insertValues);

    if (response.affectedRows > 0) {
      res.status(200).json({
        ok: true,
        message: "Sucessfully Created The Organization",
      });
    } else {
      res.status(500).json({
        message: "Something Went Wrong",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

router.put("/update/:id", upload.single("image_url"), async (req, res) => {
  const { name, description, phone_number, address, latitude, longitude } = req.body;
  const { id } = req.params;

  let imagePath = null;
  if (req.file) {
    imagePath = req.file.filename;
  }

  const updateFields = [];
  const values = [];

  if (name) {
    updateFields.push("name = ?");
    values.push(name);
  }

  if (description) {
    updateFields.push("description = ?");
    values.push(description);
  }

  if (phone_number) {
    updateFields.push("phone_number = ?");
    values.push(phone_number);
  }

  if (address) {
    updateFields.push("address = ?");
    values.push(address);
  }

  if (latitude) {
    updateFields.push("latitude = ?");
    values.push(latitude);
  }

  if (longitude) {
    updateFields.push("longitude = ?");
    values.push(longitude);
  }

  if (imagePath) {
    updateFields.push("image_url = ?");
    values.push(imagePath);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updateQuery = `UPDATE organizations SET ${updateFields.join(", ")} WHERE id = ?`;
  values.push(id);

  try {
    const [response] = await db.query(updateQuery, values);

    if (response.affectedRows > 0) {
      res.status(200).json({
        ok: true,
        message: "Successfully updated the organization",
      });
    } else {
      res.status(404).json({
        message: "Organization not found or no changes made",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});


router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = "DELETE from organizations WHERE id = ?";

  try {
    const [response] = await db.query(query, [id]);

    if (response.affectedRows > 0) {
      res.status(200).send({
        message: `Organization with ${id} sucessfully deleted`,
      });
    }else{
      res.status(500).send({
        message: "Failed to Delete"
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error
    });
  }
});

export default router;
