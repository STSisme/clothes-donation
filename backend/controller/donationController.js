import { registerDonation as modelRegisterDonation } from '../models/donationModel.js';

export const registerDonation = async (req, res) => {
  try {
    const donationData = req.body;
    const imageBuffer = req.file?.buffer || null;
    const imageType = req.file?.mimetype || null;

    const donationId = await modelRegisterDonation(donationData, imageBuffer, imageType);

    res.status(201).json({ message: 'Donation registered successfully!', donationId });
  } catch (err) {
    console.error('Donation submission failed:', err);
    res.status(500).json({ error: 'Failed to submit donation2', details: err.message });
  }
  console.log('Using modelRegisterDonation from', modelRegisterDonation.toString());

};

const getAllDonations = async (req, res) => {
  try {
    const [donations] = await db.query('SELECT * FROM donations');
    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving donations', error: err });
  }
};
