const Disaster = require('../models/disasterModel');

const getDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.getAllDisasters();
    res.json({ success: true, disasters });
  } catch (error) {
    console.error('Error fetching disasters:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createDisaster = async (req, res) => {
  const { title, description, location, notify_users } = req.body;
  try {
    const disasterId = await Disaster.addDisaster(title, description, location, notify_users);
    res.status(201).json({ success: true, message: 'Disaster created', id: disasterId });
  } catch (error) {
    console.error('Error adding disaster:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getDisasters, createDisaster };
