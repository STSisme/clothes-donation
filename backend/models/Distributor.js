const db = require('../config/db');

// Register distributor
const registerDistributor = async (data) => {
  const {
    organization_name,
    organization_type,
    contact_name,
    phone_number,
    email,
    password,
    address,
    website,
    description,
    areas_of_operation,
    profile_image
  } = data;

  const [result] = await db.execute(
    `INSERT INTO distributors (
      organization_name, organization_type, contact_name, phone_number, email, password,
      address, website, description, areas_of_operation, profile_image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      organization_name,
      organization_type,
      contact_name,
      phone_number,
      email,
      password,
      address,
      website,
      description,
      areas_of_operation,
      profile_image
    ]
  );

  return result.insertId;
};

// Get distributor by email
const getDistributorByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM distributors WHERE email = ?', [email]);
  return rows[0];
};

// Get all distributors
const getAllDistributors = async () => {
  const [rows] = await db.execute('SELECT * FROM distributors');
  return rows;
};

// Update verification status
const updateVerificationStatus = async (id, verified) => {
  await db.execute('UPDATE distributors SET verified = ? WHERE id = ?', [verified, id]);
};

module.exports = {
  registerDistributor,
  getDistributorByEmail,
  getAllDistributors,
  updateVerificationStatus
};
