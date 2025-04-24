import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log("✅ Connected to MySQL");
  } catch (err) {
    console.error("❌ MySQL connection error:", err);
    process.exit(1);
  }
};

export { connectDB, connection };
