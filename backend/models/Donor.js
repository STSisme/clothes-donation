// donorModel.js (ES module)
import { connection as db } from "../config/db.js";

const registerDonor = async (data) => {
  const [
    name,
    email,
    password,
    phone_number,
    address,
    profile_image = null,
    points = 0,
   ] = data;

  console.log(name, email, password, phone_number, address, profile_image, points);
  

  const result = db.execute(
    `INSERT INTO donors (
      name, email, password, phone_number, address, profile_image, points
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, email, password, phone_number, address, profile_image, points]
  );

  console.log(result);
  

  return result.insertId;
};

const getDonorByEmail = async (email) => {
  const [rows] = await db.execute("SELECT * FROM donors WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

const getAllDonors = async () => {
  const [rows] = await db.execute("SELECT * FROM donors");
  return rows;
};

export { registerDonor, getDonorByEmail, getAllDonors };
