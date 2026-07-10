import { Pool } from 'pg';
import fs from 'fs';

// read .env local
let envFile;
try {
  envFile = fs.readFileSync('.env', 'utf-8');
} catch (err) {
  console.error("Error reading .env file:", err);
  process.exit(1);
}

const dbUrlMatch = envFile.match(/DATABASE_URL="(.*)"/);
if (!dbUrlMatch) {
  console.error("DATABASE_URL not found in .env file");
  process.exit(1);
}

const dbUrl = dbUrlMatch[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function setupReviews() {
  const client = await pool.connect();
  try {
    console.log("Creating product_reviews table with indexes...");

    // Create table with proper constraints
    await client.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        customer_name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Remove any duplicate reviews (keep only the one with lowest id)
    await client.query(`
      DELETE FROM product_reviews
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM product_reviews
        GROUP BY product_id, customer_name
      )
    `);

    // Add unique constraint for preventing duplicate reviews from same customer
    await client.query(`
      ALTER TABLE product_reviews
      DROP CONSTRAINT IF EXISTS product_reviews_product_id_customer_name_key,
      ADD CONSTRAINT product_reviews_product_id_customer_name_key
      UNIQUE (product_id, customer_name)
    `);

    // Create indexes for better query performance
    console.log("Creating indexes...");
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id
      ON product_reviews(product_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at
      ON product_reviews(created_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_rating
      ON product_reviews(rating);
    `);

    // Insert sample reviews with duplicate prevention
    console.log("Inserting sample reviews...");
    const sampleReviews = [
      [1, 'John Doe', 5, 'Amazing quality! The fit is perfect.'],
      [1, 'Jane Smith', 4, 'Really liked it, but shipping took a bit longer than expected.'],
      [2, 'Mike Ross', 5, 'Perfect for couples. Very cute!'],
      [3, 'Rachel Zane', 3, 'Average quality, but looks good.'],
    ];

    for (const [productId, customerName, rating, comment] of sampleReviews) {
      try {
        await client.query(
          `INSERT INTO product_reviews (product_id, customer_name, rating, comment)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (product_id, customer_name) DO NOTHING`,
          [productId, customerName, rating, comment]
        );
        console.log(`  Inserted or skipped review for product ${productId} by ${customerName}`);
      } catch (err) {
        console.error(`  Error inserting review for product ${productId}:`, err.message);
      }
    }

    // Verify the data
    const countResult = await client.query('SELECT COUNT(*) as count FROM product_reviews');
    const count = countResult.rows[0].count;
    console.log(`Total reviews in database: ${count}`);

    console.log("Reviews table set up successfully!");
  } catch (error) {
    console.error("Error setting up reviews table:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupReviews();