import db from '../config/db';

// Get all disasters
const getAllDisasters = async () => {
  const [rows] = await db.execute('SELECT * FROM disasters ORDER BY dateReported DESC'); // Ordering by dateReported
  return rows;
};

// Add a new disaster (including type, region, severity, notify_users)
const addDisaster = async (title, description, location, type, region, severity, notify_users = false) => {
  const [result] = await db.execute(
    'INSERT INTO disasters (title, description, location, type, region, severity, notify_users) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, location, type, region, severity, notify_users]
  );
  return result.insertId;
};

module.exports = {
  getAllDisasters,
  addDisaster
};
