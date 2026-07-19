import { Pool } from 'pg';

const dbUrl = 'postgresql://neondb_owner:npg_1ESxrJPHYc6G@ep-calm-cell-a1ywzsse-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const client = await pool.connect();
  try {
    console.log("Checking if column 'offer' exists on table 'products'...");
    const checkRes = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='offer'
    `);
    
    if (checkRes.rows.length === 0) {
      console.log("Adding column 'offer' to products table...");
      await client.query("ALTER TABLE products ADD COLUMN offer INTEGER DEFAULT 0;");
      console.log("Column added successfully!");
    } else {
      console.log("Column 'offer' already exists.");
    }

    // Let's set some default offer percentages for testing!
    console.log("Setting some default offer values for testing...");
    await client.query("UPDATE products SET offer = 15 WHERE sub_category = 'women'");
    await client.query("UPDATE products SET offer = 25 WHERE sub_category = 'men'");
    await client.query("UPDATE products SET offer = 20 WHERE sub_category = 'special'");
    
    console.log("Migration and test seeding complete!");
  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    client.release();
    pool.end();
  }
}

run();
