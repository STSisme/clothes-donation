import e from "express";
import { connection as db } from "../config/db.js";
import { upload } from "../config/mutlerConfig.js";

import express from "express";

const router = express.Router();

router
  .get("", async (req, res) => {
    const query = `
    SELECT d.*, 
    u.full_name AS donor_name, 
    o.name AS organization_name, 
    COALESCE(SUM(di.count), 0) AS total_items
    FROM donations d
    JOIN users u ON d.donor_id = u.id
    JOIN organizations o ON d.organization_id = o.id
    LEFT JOIN donation_items di ON di.donation_id = d.id
    GROUP BY d.id
  `;

    try {
      const response = await db.query(query);
      res.status(200).json(response[0]);
    } catch (error) {
      res.status(500).json({
        message: "Failed To Fetch Donations",
      });
    }
  })
  .get("/items", async (req, res) => {
    const donationQuery = `
      SELECT d.*, 
             di.id AS item_id, 
             di.cloth_for, di.gender, di.season, 
             di.cloth_condition, di.count, di.image_url, 
             di.donation_id
      FROM donations d
      LEFT JOIN donation_items di ON d.id = di.donation_id
      WHERE d.status = 'approved' AND di.status = 'donated'
    `;

    try {
      const [rows] = await db.query(donationQuery);

      const donationsMap = {};
      for (const row of rows) {
        const donationId = row.id;

        if (!donationsMap[donationId]) {
          donationsMap[donationId] = {
            id: row.id,
            donor_id: row.donor_id,
            organization_id: row.organization_id,
            donation_method: row.donation_method,
            status: row.status,
            pickup_address: row.pickup_address,
            pickup_time: row.pickup_time,
            note: row.note,
            created_at: row.created_at,
            items: [],
          };
        }

        if (row.item_id) {
          donationsMap[donationId].items.push({
            id: row.item_id,
            cloth_for: row.cloth_for,
            gender: row.gender,
            season: row.season,
            cloth_condition: row.cloth_condition,
            count: row.count,
            image_url: row.image_url,
          });
        }
      }

      const donations = Object.values(donationsMap);
      res.status(200).json(donations);
    } catch (error) {
      console.error("Error fetching donations with items", error);
      res
        .status(500)
        .json({ message: "Failed to fetch donations with items." });
    }
  })
  .get("/organizations/:id", async (req, res) => {
    const id = req.params.id;

    const query = `
      SELECT d.*, 
      u.full_name AS donor_name, 
      o.name AS organization_name, 
      COALESCE(SUM(di.count), 0) AS total_items
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      JOIN organizations o ON d.organization_id = o.id
      LEFT JOIN donation_items di ON di.donation_id = d.id
      WHERE d.organization_id = ?
      GROUP BY d.id
  `;
    try {
      const response = await db.query(query, [id]);
      res.status(200).json(response[0]);
    } catch (error) {
      res.status(500).json({
        message: "Error Fetching the Donations",
      });
    }
  })
  .get("/donors/:id", async (req, res) => {
    const id = req.params.id;

    const query = `
      SELECT d.*, o.* ,
      u.full_name AS donor_name, 
      o.name AS organization_name, 
      COALESCE(SUM(di.count), 0) AS total_items
      FROM donations d
      JOIN users u ON d.donor_id = u.id
      JOIN organizations o ON d.organization_id = o.id
      LEFT JOIN donation_items di ON di.donation_id = d.id
      WHERE d.donor_id = ?
      GROUP BY d.id
  `;
    try {
      const response = await db.query(query, [id]);      
      res.status(200).json(response[0]);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  })
  .get("/detail/:id", async (req, res) => {
    const id = req.params.id;

    try {
      const [donationRows] = await db.query(
        "SELECT * FROM donations WHERE id = ?",
        [id]
      );

      if (donationRows.length === 0) {
        return res.status(404).json({ message: "Donation not found" });
      }

      const donation = donationRows[0];

      const [itemRows] = await db.query(
        "SELECT * FROM donation_items WHERE donation_id = ?",
        [id]
      );

      res.status(200).json({
        ...donation,
        items: itemRows,
      });
    } catch (error) {
      console.error("Error fetching donation detail:", error);
      res.status(500).json({ message: "Failed to retrieve donation detail" });
    }
  })
  .get("/leaderboard", async (req, res) => {
    const query =
      "SELECT id, full_name AS name, points FROM users WHERE role='donor' ORDER BY points DESC";

    try {
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (e) {
      console.error("Error fetching leaderboard:", e);
      res.status(500).json({
        message: "Failed To Retrieve Data",
        error: e.message,
      });
    }
  });

router.post("/create", upload.any(), async (req, res) => {
  const {
    organization_id,
    donor_id,
    note,
    donation_method,
    pickup_address,
    pickup_time,
    status,
    items,
  } = req.body;

  try {
    const donationQuery = `
        INSERT INTO donations (
          organization_id,
          donor_id,
          note,
          donation_method,
          pickup_address,
          pickup_time,
          status
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
    const donationValues = [
      organization_id,
      donor_id,
      note,
      donation_method,
      donation_method === "pickup" ? pickup_address : null,
      donation_method === "pickup" ? pickup_time : null,
      status,
    ];

    const [donationResult] = await db.query(donationQuery, donationValues);
    const donationId = donationResult.insertId;

    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

    const imageMap = {};

    for (const file of req.files) {
      const match = file.fieldname.match(/^items\[(\d+)]\[image]$/);
      if (match) {
        const index = parseInt(match[1]);
        imageMap[index] = file.filename;
      }
    }

    let totalPoints = 0;

    for (let i = 0; i < parsedItems.length; i++) {
      const item = parsedItems[i];
      const imageFilename = imageMap[i] || null;

      await db.query(
        `
          INSERT INTO donation_items 
          (donation_id, cloth_for, gender, season, cloth_condition, count, image_url) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
        [
          donationId,
          item.cloth_for,
          item.gender,
          item.season,
          item.cloth_condition,
          item.count,
          imageFilename,
        ]
      );

      let pointsPerItem = 0;
      if (item.cloth_condition === "needs_repair") pointsPerItem = 5;
      else if (item.cloth_condition === "gently_used") pointsPerItem = 10;
      else if (item.cloth_condition === "new") pointsPerItem = 15;

      totalPoints += pointsPerItem * item.count;
    }

    await db.query(
      `
        UPDATE users 
        SET points = COALESCE(points, 0) + ? 
        WHERE id = ?
        `,
      [totalPoints, donor_id]
    );

    res
      .status(201)
      .json({
        message: "Donation created successfully.",
        awarded_points: totalPoints,
      });
  } catch (err) {
    console.error("Error creating donation:", err);
    res.status(500).json({ error: "Failed to create donation." });
  }
});

router
  .put("/update/:id", upload.any(), async (req, res) => {
    const donationId = req.params.id;
    const {
      organization_id,
      donor_id,
      note,
      donation_method,
      pickup_address,
      pickup_time,
      status,
      items,
    } = req.body;

    try {
      let updateQuery = `
      UPDATE donations SET 
        organization_id = ?, 
        donor_id = ?, 
        note = ?, 
        donation_method = ?, 
        pickup_address = ?, 
        pickup_time = ?, 
        status = ?
      WHERE id = ?
    `;

      await db.query(updateQuery, [
        organization_id,
        donor_id,
        note,
        donation_method,
        donation_method === "pickup" ? pickup_address : null,
        donation_method === "pickup" ? pickup_time : null,
        status,
        donationId,
      ]);

      const [existingItemsRes] = await db.query(
        `SELECT id, image_url FROM donation_items WHERE donation_id = ?`,
        [donationId]
      );

      const existingItemMap = {};
      for (const row of existingItemsRes) {
        existingItemMap[row.id] = row.image_url;
      }
      const existingItemIds = Object.keys(existingItemMap).map(Number);

      const parsedItems = typeof items === "string" ? JSON.parse(items) : items;

      const imageMap = {};
      for (const file of req.files) {
        const match = file.fieldname.match(/^items\[(\d+)\]\[image\]$/);
        if (match) {
          const index = parseInt(match[1]);
          imageMap[index] = file.filename;
        }
      }

      const receivedItemIds = [];
      for (let i = 0; i < parsedItems.length; i++) {
        const item = parsedItems[i];
        const imageFilename = imageMap[i] || null;

        if (item.id) {
          await db.query(
            `UPDATE donation_items SET 
              cloth_for = ?, gender = ?, season = ?, 
              cloth_condition = ?, count = ?, image_url = ?, status = ?
            WHERE id = ? AND donation_id = ?`,
            [
              item.cloth_for,
              item.gender,
              item.season,
              item.cloth_condition,
              item.count,
              imageFilename || existingItemMap[item.id],
              item.status || "pending",
              item.id,
              donationId,
            ]
          );
          receivedItemIds.push(Number(item.id));
        } else {
          await db.query(
            `INSERT INTO donation_items 
              (donation_id, cloth_for, gender, season, cloth_condition, count, image_url, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              donationId,
              item.cloth_for,
              item.gender,
              item.season,
              item.cloth_condition,
              item.count,
              imageFilename,
              item.status || "pending",
            ]
          );
        }
      }

      const idsToDelete = existingItemIds.filter(
        (id) => !receivedItemIds.includes(id)
      );
      if (idsToDelete.length > 0) {
        await db.query(
          `DELETE FROM donation_items WHERE id IN (?) AND donation_id = ?`,
          [idsToDelete, donationId]
        );
      }

      res
        .status(200)
        .json({ message: "Donation and items updated successfully." });
    } catch (err) {
      console.error("Error updating donation:", err);
      res.status(500).json({ error: "Failed to update donation." });
    }
  })
  .put("/approve/:id", async (req, res) => {
    const id = req.params.id;

    const query = "UPDATE donations SET status = 'approved' WHERE id = ?";

    try {
      const [response] = await db.query(query, [id]);
      if (response.affectedRows > 0) {
        const [updatedDonation] = await db.query(
          "SELECT * FROM donations WHERE id = ?",
          [id]
        );
        res.status(200).json(updatedDonation[0]);
      } else {
        res.status(500).json({
          message: "Failed To Approve Donation",
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

  const query = "DELETE FROM donations WHERE id = ?";

  try {
    const [response] = await db.query(query, [id]);

    if (response.affectedRows > 0) {
      res.status(200).json({
        message: "Successfully Deleted",
      });
    } else {
      res.status(500).json({
        message: "Failed to Delete",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});

export default router;
