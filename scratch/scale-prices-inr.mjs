import { Pool } from 'pg';

const dbUrl = 'postgresql://neondb_owner:npg_1ESxrJPHYc6G@ep-calm-cell-a1ywzsse-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Multiplying all USD prices (< 500) by 50 to scale to INR...");
    const res = await client.query(
      "UPDATE products SET price = price * 50 WHERE price < 500"
    );
    console.log(`Successfully updated ${res.rowCount} products to INR!`);
  } catch (error) {
    console.error("Error scaling database prices:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
