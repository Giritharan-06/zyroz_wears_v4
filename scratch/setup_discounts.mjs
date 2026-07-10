import { Pool } from 'pg';
import fs from 'fs';

// read .env
const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrl = envFile.match(/DATABASE_URL="(.*)"/)[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function setupDiscounts() {
  const client = await pool.connect();
  try {
    console.log("Ensuring discounts table exists...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS discounts (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' or 'fixed'
        value DECIMAL(10, 2) NOT NULL,
        min_purchase DECIMAL(10, 2) DEFAULT 0,
        expiry_date TIMESTAMP,
        usage_limit INTEGER DEFAULT NULL,
        usage_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Discounts table setup successfully!");
  } catch (error) {
    console.error("Error setting up discounts table:", error);
  } finally {
    client.release();
    pool.end();
  }
}

setupDiscounts();
