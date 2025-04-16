const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Register a new user (Distributor or Donor)
const registerUser = async (req, res) => {
  const {
    fullName, email, password, phoneNumber, address, userType,
    organization_name, organization_type, website, description, areas_of_operation
  } = req.body;

  try {
    const connection = await pool.getConnection();

    // Determine the table and fields based on userType
    const table = userType === 'Distributor' ? 'distributors' : 'donors';
    const nameField = userType === 'Distributor' ? 'contact_name' : 'name';

    // Check for existing user
    const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the appropriate table
    let insertQuery, values;
    if (userType === 'Distributor') {
      insertQuery = `
        INSERT INTO distributors (organization_name, organization_type, ${nameField}, phone_number, email, password, address, website, description, areas_of_operation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      values = [
        organization_name, organization_type, fullName, phoneNumber, email,
        hashedPassword, address, website, description, areas_of_operation
      ];
    } else {
      insertQuery = `
        INSERT INTO donors (name, email, password, phone_number, address)
        VALUES (?, ?, ?, ?, ?)
      `;
      values = [fullName, email, hashedPassword, phoneNumber, address];
    }

    await connection.execute(insertQuery, values);
    connection.release();

    // Create JWT token for the new user
    const token = jwt.sign({ email, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ success: true, message: 'Registration successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error registering user.' });
  }
};

// Login user (Distributor or Donor)
const loginUser = async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const connection = await pool.getConnection();
    const table = userType === 'Distributor' ? 'distributors' : 'donors';

    // Check if the user exists in the correct table
    const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token for the user
    const token = jwt.sign({ id: user.id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error." });
  }
};



module.exports = { registerUser, loginUser };
