import express from 'express';
import mysql from 'mysql2';
import { Parser } from 'json2csv';


const router = express.Router();

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
