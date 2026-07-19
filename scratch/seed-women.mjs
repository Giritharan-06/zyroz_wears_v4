import { Pool } from 'pg';

const dbUrl = 'postgresql://neondb_owner:npg_1ESxrJPHYc6G@ep-calm-cell-a1ywzsse-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Checking products table...");
    const values = [
      ['Women Streetwear Crop Top', 'collection', 'women', '/asessts/couple_mockup_1.png', 39.00, 100],
      ['Oversized Women Tee', 'collection', 'women', '/asessts/couple_mockup_2.png', 42.00, 80],
      ['Women High-Waist Pants', 'collection', 'women', '/asessts/all_types.jpg', 55.00, 60]
    ];

    for (const row of values) {
      const res = await client.query('SELECT * FROM products WHERE name = $1', [row[0]]);
      if (res.rows.length === 0) {
        console.log(`Inserting ${row[0]}...`);
        await client.query(
          'INSERT INTO products (name, category, sub_category, image_url, price, stock) VALUES ($1, $2, $3, $4, $5, $6)',
          row
        );
      } else {
        console.log(`${row[0]} already exists.`);
      }
    }
    console.log("Women products database update complete!");
  } catch (error) {
    console.error("Error updating database:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
