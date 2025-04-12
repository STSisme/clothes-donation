const db = require('../config/db');

// Register a new donor
const registerDonor = async (data) => {
  const { name, email, password, phone_number, address, profile_image = null, points = 0 } = data;

  const [result] = await db.execute(
    `INSERT INTO donors (
      name, email, password, phone_number, address, profile_image, points
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, phone_number, address, profile_image, points]
  );

  return result.insertId;
};

// Get donor by email
const getDonorByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM donors WHERE email = ?', [email]);
  return rows[0];
};

// Get all donors
const getAllDonors = async () => {
  const [rows] = await db.execute('SELECT * FROM donors');
  return rows;
};

module.exports = {
  registerDonor,
  getDonorByEmail,
  getAllDonors
};
