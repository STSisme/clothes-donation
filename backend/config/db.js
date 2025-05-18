import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error("MySQL connection error:", err);
      process.exit(1);
    } else {
      console.log("✅ Connected to MySQL");
    }
  });
};

export { connectDB, connection };
