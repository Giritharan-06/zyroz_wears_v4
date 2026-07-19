import { Pool } from 'pg';

const dbUrl = 'postgresql://neondb_owner:npg_1ESxrJPHYc6G@ep-calm-cell-a1ywzsse-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Updating database sub_category values...");
    const res = await client.query(
      "UPDATE products SET sub_category = 'special' WHERE sub_category = 'festival'"
    );
    console.log(`Successfully updated ${res.rowCount} products from 'festival' to 'special'!`);
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
