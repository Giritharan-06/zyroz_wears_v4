import { Pool } from 'pg';
import fs from 'fs';

// read .env
const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrl = envFile.match(/DATABASE_URL="(.*)"/)[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function setupAuthAndOrders() {
  const client = await pool.connect();
  try {
    console.log("Dropping and recreating users table...");
    await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Recreating orders table...");
    await client.query(`DROP TABLE IF EXISTS orders CASCADE;`);
    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Processing',
        total_amount DECIMAL(10, 2) NOT NULL,
        items_count INTEGER NOT NULL,
        shipping_address TEXT,
        tracking_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Inserting test users...");
    await client.query(`
      INSERT INTO users (name, email, password, role)
      VALUES 
        ('Admin User', 'admin@zyroz.com', 'admin123', 'admin'),
        ('Test User', 'user@gmail.com', 'user123', 'user')
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("Inserting sample orders...");
    await client.query(`
      INSERT INTO orders (user_id, customer_name, customer_email, status, total_amount, items_count, tracking_number)
      VALUES 
        (2, 'Test User', 'user@gmail.com', 'Shipped', 120.00, 2, 'ZYR-123456'),
        (2, 'Test User', 'user@gmail.com', 'Processing', 85.00, 1, 'ZYR-789012')
    `);

    console.log("Auth and Orders setup successfully!");
  } catch (error) {
    console.error("Error setting up auth and orders:", error);
  } finally {
    client.release();
    pool.end();
  }
}

setupAuthAndOrders();
