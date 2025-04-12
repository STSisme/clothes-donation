const Donor = require('../models/donorModel');

// Register a new donor
const registerDonor = async (req, res) => {
  try {
    const { name, email, password, phone_number, address } = req.body;

    // Check if the donor already exists
    const existingDonor = await Donor.getDonorByEmail(email);
    if (existingDonor) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register the new donor with default values for profile_image and points
    const donorId = await Donor.registerDonor({
      name,
      email,
      password: hashedPassword,
      phone_number,
      address,
      profile_image: null,  // Default to null if not provided
      points: 0  // Default to 0 points
    });

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully',
      donorId
    });
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all donors
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.getAllDonors();
    res.json({ success: true, donors });
  } catch (error) {
    console.error('Error getting donors:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { registerDonor, getAllDonors };
