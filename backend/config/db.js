const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clothes_donation_db'
});

// Connect to MySQL
const connectDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error('MySQL connection error:', err);
            process.exit(1);
        } else {
            console.log('Connected to MySQL database');
        }
    });
};

module.exports = { connectDB, connection };
