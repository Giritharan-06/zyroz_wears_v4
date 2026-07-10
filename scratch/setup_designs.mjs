import { Pool } from 'pg';
import fs from 'fs';

// read .env
const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrl = envFile.match(/DATABASE_URL="(.*)"/)[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function setupCustomDesigns() {
  const client = await pool.connect();
  try {
    console.log("Ensuring custom_designs table exists with image_url...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS custom_designs (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        design_notes TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if image_url exists, if not add it
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='custom_designs' AND column_name='image_url';
    `);

    if (res.rowCount === 0) {
      console.log("Adding image_url column to custom_designs...");
      await client.query(`ALTER TABLE custom_designs ADD COLUMN image_url TEXT;`);
    }

    console.log("Custom designs table setup successfully!");
  } catch (error) {
    console.error("Error setting up custom designs table:", error);
  } finally {
    client.release();
    pool.end();
  }
}

setupCustomDesigns();
