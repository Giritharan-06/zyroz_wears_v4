import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// read .env.local
const envFile = fs.readFileSync('.env.local', 'utf-8');
const dbUrl = envFile.match(/DATABASE_URL="(.*)"/)[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Creating tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(50) NOT NULL,
        sub_category VARCHAR(50) NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) DEFAULT 0.00,
        stock INTEGER DEFAULT 100
      );
    `);

    console.log("Emptying old products...");
    await client.query('TRUNCATE TABLE products RESTART IDENTITY;');

    console.log("Inserting new stock...");
    const values = [
      ['Men Collection', 'collection', 'men', '/Naruto_hoody/T-shirt_with_Naruto_202604141455-ezremove_000.webp', 45.00, 150],
      ['Couple Sets', 'collection', 'couple', '/asessts/couple_view.jpg', 80.00, 50],
      ['Special Edition', 'collection', 'special', '/asessts/all_types.jpg', 50.00, 200],
      ['Group Orders', 'collection', 'group', '/asessts/group_tshirt.jpg', 40.00, 300],
      ['Luxury Gold Chain', 'chain', 'gold', '/asessts/chains2.jpg', 120.00, 12],
      ['Luxury Silver Chain', 'chain', 'silver', '/asessts/chains2.jpg', 110.00, 24]
    ];

    for (const row of values) {
      await client.query(
        'INSERT INTO products (name, category, sub_category, image_url, price, stock) VALUES ($1, $2, $3, $4, $5, $6)',
        row
      );
    }
    
    // Also create orders to satisfy the admin dashboard query
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error setting up DB:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
