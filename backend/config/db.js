import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'clothes_donation_db',
});

const connectDB = () => {
  connection.connect((err) => {
    if (err) {
      console.error('MySQL connection error:', err);
      process.exit(1);
    } else {
      console.log('✅ Connected to MySQL');
    }
  });
};

export { connectDB, connection };