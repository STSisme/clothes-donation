const Distributor = require('../models/distributorModel');
const bcrypt = require('bcryptjs');

const registerDistributor = async (req, res) => {
  try {
    const {
      organization_name, organization_type, contact_name, phone_number,
      email, password, address, website, description, areas_of_operation
    } = req.body;

    // Handle optional profile image (uploaded file)
    const profile_image = req.file ? req.file.originalname : null;

    // Check if email already registered
    const existing = await Distributor.getDistributorByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Register distributor
    const distributorId = await Distributor.registerDistributor({
      organization_name,
      organization_type,
      contact_name,
      phone_number,
      email,
      password: hashedPassword,
      address,
      website,
      description,
      areas_of_operation,
      profile_image
    });

    res.status(201).json({ success: true, message: 'Distributor registered successfully', id: distributorId });
  } catch (error) {
    console.error('Error registering distributor:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerDistributor
};
