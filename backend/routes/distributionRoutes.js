import express from "express";
import { connection as db } from "../../../FYP/clothes-donation/backend/config/db.js";

const router = express.Router();

router
  .get("/:id", async (req, res) => {
    const id = req.params.id;

    const query = `
    SELECT 
    dists.id AS distribution_id,
    dists.distributed_to,
    dists.disaster_id,
    dists.recipient_name,
    dists.recipient_contact,
    dists.recipient_address,
    dists.distributed_at AS distribution_date,
    
    items.id AS item_id,
    items.donation_id,
    items.cloth_for,
    items.gender,
    items.season,
    items.cloth_condition,
    items.count,
    items.donated_count,
    items.status,
    items.image_url,

    dn.id AS donation_id,
    dn.organization_id,
    dn.donor_id,
    dn.note AS donation_note,
    dn.donation_method,
    dn.pickup_address,
    dn.pickup_time,
    dn.status AS donation_status

    FROM distributions dists
    JOIN distribution_items di ON di.distribution_id = dists.id
    JOIN donation_items items ON items.id = di.donation_item_id
    JOIN donations dn ON dn.id = items.donation_id
    WHERE dists.id = ?
    ORDER BY dists.distributed_at DESC;
    `;

    try {
      const [response] = await db.query(query, [id]);
      const grouped = {};

      for (const row of response) {
        const distId = row.distribution_id;

        if (!grouped[distId]) {
          grouped[distId] = {
            distribution_id: distId,
            distributed_to: row.distributed_to,
            disaster_id: row.disaster_id,
            recipient_name: row.recipient_name,
            recipient_contact: row.recipient_contact,
            recipient_address: row.recipient_address,
            distribution_date: row.distribution_date,
            donation: {
              donation_id: row.donation_id,
              organization_id: row.organization_id,
              donor_id: row.donor_id,
              donation_note: row.donation_note,
              donation_method: row.donation_method,
              pickup_address: row.pickup_address,
              pickup_time: row.pickup_time,
              donation_status: row.donation_status,
            },
            items: [],
          };
        }

        grouped[distId].items.push({
          item_id: row.item_id,
          cloth_for: row.cloth_for,
          gender: row.gender,
          season: row.season,
          cloth_condition: row.cloth_condition,
          count: row.count,
          donated_count: row.donated_count,
          status: row.status,
          image_url: row.image_url,
        });
      }

      res.status(200).json(grouped[id]);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  })
  .get("/donors/:id", async (req, res) => {
    const donorId = req.params.id;

    const query = `
      SELECT 
        dists.id AS distribution_id,
        dists.distributed_to,
        dists.disaster_id,
        dists.recipient_name,
        dists.recipient_contact,
        dists.recipient_address,
        dists.latitude AS dist_latitude,
        dists.longitude AS dist_longitude,
        dists.distributed_at AS distribution_date,
  
        items.id AS item_id,
        items.cloth_for,
        items.gender,
        items.season,
        items.cloth_condition,
        items.count,
        items.donated_count,
        items.status,
        items.image_url,
  
        dn.id AS donation_id,
        dn.organization_id,
        dn.note AS donation_note,
        dn.donation_method,
        dn.pickup_address,
        dn.pickup_time,
        dn.status AS donation_status,
  
        disas.title AS disaster_name,
        disas.latitude AS disaster_latitude,
        disas.longitude AS disaster_longitude
  
      FROM distributions dists
      JOIN distribution_items di ON di.distribution_id = dists.id
      JOIN donation_items items ON items.id = di.donation_item_id
      JOIN donations dn ON dn.id = items.donation_id
      LEFT JOIN disasters disas ON disas.id = dists.disaster_id
      WHERE dn.donor_id = ?
      ORDER BY dists.distributed_at DESC
    `;

    try {
      const [results] = await db.query(query, [donorId]);

      const grouped = {};

      for (const row of results) {
        const distId = row.distribution_id;

        if (!grouped[distId]) {
          const latitude =
            row.distributed_to === "disaster"
              ? row.disaster_latitude
              : row.dist_latitude;
          const longitude =
            row.distributed_to === "disaster"
              ? row.disaster_longitude
              : row.dist_longitude;

          grouped[distId] = {
            distribution_id: distId,
            distributed_to: row.distributed_to,
            distribution_date: row.distribution_date,
            recipient_name: row.recipient_name,
            recipient_contact: row.recipient_contact,
            recipient_address: row.recipient_address,
            donation: {
              donation_id: row.donation_id,
              organization_id: row.organization_id,
              donation_note: row.donation_note,
              donation_method: row.donation_method,
              pickup_address: row.pickup_address,
              pickup_time: row.pickup_time,
              donation_status: row.donation_status,
            },
            location: {
              latitude,
              longitude,
              name:
                row.distributed_to === "disaster"
                  ? row.disaster_name
                  : row.recipient_name || "Recipient",
            },
            items: [],
          };
        }

        grouped[distId].items.push({
          item_id: row.item_id,
          cloth_for: row.cloth_for,
          gender: row.gender,
          season: row.season,
          cloth_condition: row.cloth_condition,
          count: row.count,
          donated_count: row.donated_count,
          status: row.status,
          image_url: row.image_url,
        });
      }

      res.json(Object.values(grouped));
    } catch (error) {
      console.error("Error fetching distributions by donor:", error);
      res.status(500).json({ error: "Failed to fetch distributions." });
    }
  })
  .get("/all/:id", async (req, res) => {
    const id = req.params.id;

    const query = `
    SELECT 
    dists.id AS distribution_id,
    dists.distributed_to,
    dists.disaster_id,
    dists.recipient_name,
    dists.recipient_contact,
    dists.recipient_address,
    dists.distributed_at AS distribution_date,
    
    items.id AS item_id,
    items.donation_id,
    items.cloth_for,
    items.gender,
    items.season,
    items.cloth_condition,
    items.count,
    items.donated_count,
    items.status,
    items.image_url,

    dn.id AS donation_id,
    dn.organization_id,
    dn.donor_id,
    dn.note AS donation_note,
    dn.donation_method,
    dn.pickup_address,
    dn.pickup_time,
    dn.status AS donation_status

    FROM distributions dists
    JOIN distribution_items di ON di.distribution_id = dists.id
    JOIN donation_items items ON items.id = di.donation_item_id
    JOIN donations dn ON dn.id = items.donation_id
    WHERE dists.distributed_by = ?
    ORDER BY dists.distributed_at DESC;
    `;

    try {
      const [response] = await db.query(query, [id]);
      const grouped = {};

      for (const row of response) {
        const distId = row.distribution_id;

        if (!grouped[distId]) {
          grouped[distId] = {
            distribution_id: distId,
            distributed_to: row.distributed_to,
            disaster_id: row.disaster_id,
            recipient_name: row.recipient_name,
            recipient_contact: row.recipient_contact,
            recipient_address: row.recipient_address,
            distribution_date: row.distribution_date,
            donation: {
              donation_id: row.donation_id,
              organization_id: row.organization_id,
              donor_id: row.donor_id,
              donation_note: row.donation_note,
              donation_method: row.donation_method,
              pickup_address: row.pickup_address,
              pickup_time: row.pickup_time,
              donation_status: row.donation_status,
            },
            items: [],
          };
        }

        grouped[distId].items.push({
          item_id: row.item_id,
          cloth_for: row.cloth_for,
          gender: row.gender,
          season: row.season,
          cloth_condition: row.cloth_condition,
          count: row.count,
          donated_count: row.donated_count,
          status: row.status,
          image_url: row.image_url,
        });
      }

      res.status(200).json(Object.values(grouped));
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });

router.post("/create", async (req, res) => {
  const {
    donation_item_ids,
    distributed_count,
    distributed_to,
    disaster_id,
    recipient_name,
    recipient_contact,
    recipient_address,
    distributed_by,
  } = req.body;

  try {
    const [distributionResult] = await db.query(
      `INSERT INTO distributions
          (distributed_to, disaster_id, recipient_name, recipient_contact, recipient_address, distributed_count, distributed_by)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        distributed_to,
        distributed_to === "disaster" ? disaster_id : null,
        distributed_to !== "disaster" ? recipient_name : null,
        distributed_to !== "disaster" ? recipient_contact : null,
        distributed_to !== "disaster" ? recipient_address : null,
        distributed_count,
        distributed_by,
      ]
    );

    const distributionId = distributionResult.insertId;

    const distItemValues = donation_item_ids.map((itemId) => [
      distributionId,
      itemId,
    ]);
    await db.query(
      `INSERT INTO distribution_items (distribution_id, donation_item_id) VALUES ?`,
      [distItemValues]
    );

    for (const itemId of donation_item_ids) {
      await db.query(
        `UPDATE donation_items
            SET donated_count = count, status = 'distributed'
            WHERE id = ?`,
        [itemId]
      );
    }

    const [donationRows] = await db.query(
      `SELECT DISTINCT donation_id FROM donation_items WHERE id IN (?)`,
      [donation_item_ids]
    );

    for (const row of donationRows) {
      const donationId = row.donation_id;
      const [itemStatuses] = await db.query(
        `SELECT status FROM donation_items WHERE donation_id = ?`,
        [donationId]
      );

      const allDistributed = itemStatuses.every(
        (item) => item.status === "distributed"
      );

      if (allDistributed) {
        await db.query(
          `UPDATE donations SET status = 'distributed' WHERE id = ?`,
          [donationId]
        );
      }
    }

    res.status(201).json({ message: "Distribution recorded successfully." });
  } catch (error) {
    console.error("Error in distribution:", error);
    res.status(500).json({ error: "Failed to record distribution." });
  }
});

export default router;
