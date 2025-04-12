const db = require('../config/db');

// Get all disasters
const getAllDisasters = async () => {
  const [rows] = await db.execute('SELECT * FROM disasters ORDER BY created_at DESC');
  return rows;
};

// Add a new disaster
const addDisaster = async (title, description, location, notify_users = false) => {
  const [result] = await db.execute(
    'INSERT INTO disasters (title, description, location, notify_users) VALUES (?, ?, ?, ?)',
    [title, description, location, notify_users]
  );
  return result.insertId;
};

// Optional: Delete or update disasters, or get by ID
const getDisasterById = async (id) => {
  const [rows] = await db.execute('SELECT * FROM disasters WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  getAllDisasters,
  addDisaster,
  getDisasterById
};
