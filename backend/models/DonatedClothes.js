const db = require('../config/db');

// Register a new donation
const registerDonation = async (data) => {
  const {
    donor_id,
    organization_id,
    cloth_type,
    condition,
    image_urls,
    method,
    pickup_time,
    status
  } = data;

  const [result] = await db.execute(
    `INSERT INTO donations (
      donor_id, organization_id, cloth_type, condition, image_urls, method, pickup_time, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      donor_id,
      organization_id,
      cloth_type,
      condition,
      image_urls,
      method,
      pickup_time,
      status
    ]
  );

  return result.insertId;
};

// Get donation by ID
const getDonationById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM donations WHERE id = ?', [id]);
  return rows[0];
};

// Optional: Get all donations, update status, etc.
const getAllDonations = async () => {
  const [rows] = await db.execute('SELECT * FROM donations');
  return rows;
};

const updateDonationStatus = async (id, status) => {
  await db.execute('UPDATE donations SET status = ? WHERE id = ?', [status, id]);
};

module.exports = {
  registerDonation,
  getDonationById,
  getAllDonations,
  updateDonationStatus
};
