import bcrypt from 'bcryptjs';
import {connection as db} from './db.js';

const createAdmin = async () => {
  const fullName = 'Super Admin';
  const email = 'admin@admin.com';
  const password = 'Admin@123';
  const phone = '1234567890';
  const address = 'HQ';
  const role = 'admin';
  const isVerified = 1;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(`
      INSERT INTO users (full_name, email, password, phone_number, address, role, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [fullName, email, hashedPassword, phone, address, role, isVerified]);

    console.log('✅ Admin user created successfully');
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
  } finally {
    await db.end();    
    process.exit(0); 
  }
};

createAdmin();
