import { Distributor } from '../models/Distributor';
import bcrypt from 'bcryptjs';

export const registerDistributor = async (req, res) => {
  try {
    const {
      organization_name, organization_type, contact_name, phone_number,
      email, password, address, website, description, areas_of_operation
    } = req.body;

    const profile_image = req.file ? req.file.originalname : null;

    const existing = await Distributor.getDistributorByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    res.status(201).json({
      success: true,
      message: 'Distributor registered successfully',
      id: distributorId
    });
  } catch (error) {
    console.error('Error registering distributor:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const verifyDistributor = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  try {
    await Distributor.updateVerificationStatus(id, verified);
    res.status(200).json({ message: 'Distributor verification updated successfully.' });
  } catch (error) {
    console.error('Error updating distributor verification:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getAllDistributors = async (req, res) => {
  try {
    const distributors = await Distributor.getAllDistributors();
    res.status(200).json(distributors);
  } catch (error) {
    console.error('Error fetching distributors:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
