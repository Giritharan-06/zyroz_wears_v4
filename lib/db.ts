import { neon } from '@neondatabase/serverless';

export const query = async (text: string, params?: unknown[]) => {
  // Use the provided database URL if the environment variable is not picked up
  const dbUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_1ESxrJPHYc6G@ep-calm-cell-a1ywzsse-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL is not defined');
  }
  
  const sql = neon(dbUrl) as any;
  
  try {
    const result = await sql.query(text, params);
    // neon sql.query returns an array directly, but our code expects { rows }
    const rows = Array.isArray(result) ? result : (result as { rows: unknown[] }).rows;
    return { rows };
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};
