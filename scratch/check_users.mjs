import { Pool } from 'pg';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const dbUrl = envFile.match(/DATABASE_URL="(.*)"/)[1];

const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    console.log("Columns in 'users' table:", res.rows.map(r => r.column_name));
  } catch (e) {
    console.log("Error or table does not exist:", e.message);
  } finally {
    pool.end();
  }
}

check();
