import {connection as db} from "../config/db.js"

const getAdminByEmail = async (email) => {
  const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
  return rows[0];
};

const createAdmin = async (email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO admins (email, password) VALUES (?, ?)',
    [email, hashedPassword]
  );
  return result.insertId;
};

module.exports = { getAdminByEmail, createAdmin };
