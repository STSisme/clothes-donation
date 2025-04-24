import { connection as db } from "./db.js";

const createUsersTable = `
  CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255),
    address VARCHAR(255),
    profile_image VARCHAR(255),
    points INT DEFAULT 0,
    organization_id INT,
    role ENUM('donor', 'distributor', 'admin') NOT NULL,
    is_verified TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createOrganizationsTable = `
  CREATE TABLE organizations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone_number VARCHAR(15),
    address VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createDisastersTable = `
    CREATE TABLE disasters (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      location VARCHAR(255),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      type VARCHAR(100),
      region VARCHAR(100),
      severity ENUM('low', 'moderate', 'high', 'critical') DEFAULT 'low',
      notify_users TINYINT(1) DEFAULT 0,
      dateReported TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createDonationTable = `
  CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    donor_id INT NOT NULL,
    donation_method ENUM('dropoff', 'pickup') NOT NULL,
    note TEXT,
    pickup_address TEXT,
    pickup_time DATETIME,
    status ENUM('pending', 'approved', 'distributed', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

const createDonationItemsTable = `
  CREATE TABLE IF NOT EXISTS donation_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT NOT NULL,
    cloth_for ENUM('child', 'adult') NOT NULL,
    gender ENUM('male', 'female', 'unisexual') NOT NULL,
    season ENUM('winter', 'seasonal') NOT NULL,
    cloth_condition ENUM('new', 'gently_used', 'needs_repair') NOT NULL,
    count INT NOT NULL DEFAULT 1,
    image_url TEXT,
    donated_count INT NOT NULL DEFAULT 0,
    status ENUM('donated', 'distributed') NOT NULL DEFAULT 'donated',

    FOREIGN KEY (donation_id) REFERENCES donations(id) ON DELETE CASCADE
  );
`;

const createDistributionTable = `
    CREATE TABLE distributions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      distributed_by INT NOT NULL,
      distributed_count INT NOT NULL,
      distributed_to ENUM('disaster', 'individual', 'institution') NOT NULL,
      disaster_id INT,
      recipient_name VARCHAR(255),
      recipient_contact VARCHAR(100),
      recipient_address TEXT,
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      distributed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (distributed_by) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (disaster_id) REFERENCES disasters(id) ON DELETE SET NULL
  );
`;

const createDistributionItemsTable = `
  CREATE TABLE distribution_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    distribution_id INT NOT NULL,
    donation_item_id INT NOT NULL,
    FOREIGN KEY (distribution_id) REFERENCES distributions(id) ON DELETE CASCADE,
    FOREIGN KEY (donation_item_id) REFERENCES donation_items(id) ON DELETE CASCADE, 
    UNIQUE KEY unique_distribution_item (distribution_id, donation_item_id)  
  );
`;

const createNotificationTable = `
  CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    message TEXT,
    disaster_id INT,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (disaster_id) REFERENCES disasters(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`;

async function createTables() {
  try {
    await db.query(createUsersTable);
    console.log("Users Table created (if not exists).");

    await db.query(createOrganizationsTable);
    console.log("Organizations Table created (if not exists).");

    await db.query(createDisastersTable);
    console.log("Disasters Table created (if not exists).");

    await db.query(createDonationTable);
    console.log("Donations Table created (if not exists).");

    await db.query(createDonationItemsTable);
    console.log("Donation Items Table Created (if Not Exists).");

    await db.query(createDistributionTable);
    console.log("Distribution Table Created (if Not Exists).");

    await db.query(createDistributionItemsTable);
    console.log("Distribution Items Table Created (if Not Exists).");

    await db.query(createNotificationTable);
    console.log("Notification Table Created (if Not Exists).");

  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    db.end();
    console.log("Database connection closed.");
  }
}

createTables();

