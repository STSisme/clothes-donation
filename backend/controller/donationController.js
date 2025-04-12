const Donation = require('../models/donationModel');

const registerDonation = async (req, res) => {
  try {
    const {
      donor_id,
      organization_id,
      cloth_type,
      condition,
      image_urls,
      method,
      pickup_time,
      status = 'pending'
    } = req.body;

    const donationId = await Donation.registerDonation({
      donor_id,
      organization_id,
      cloth_type,
      condition,
      image_urls,
      method,
      pickup_time,
      status
    });

    res.status(201).json({ success: true, message: 'Donation registered', donationId });
  } catch (error) {
    console.error('Error registering donation:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { registerDonation };
