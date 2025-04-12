import express from 'express';
import mysql from 'mysql2';
import { Parser } from 'json2csv';


const router = express.Router();
// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: '', // replace with your MySQL password
  database: 'clothes_donation_db', // replace with your database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

router.get('/export', async (req, res) => {
  try {
    // Fetch data from MySQL donations table
    const query = 'SELECT * FROM donations';
    db.execute(query, (err, results) => {
      if (err) {
        console.error('Error fetching donations:', err);
        return res.status(500).send('Server error');
      }

      // Convert MySQL results to JSON format
      const donatedClothes = results;

      // Convert JSON data to CSV using json2csv
      const json2csvParser = new Parser();
      const csvData = json2csvParser.parse(donatedClothes);

      // Set CSV headers for file download
      res.header('Content-Type', 'text/csv');
      res.attachment('donated_clothes_report.csv');

      // Send CSV data as response
      return res.send(csvData);
    });
  } catch (err) {
    console.error('Error exporting data:', err);
    res.status(500).send('Server error');
  }
});

export default router;
