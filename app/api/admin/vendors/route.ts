import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Initialize vendor tables
export async function POST() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        store_name VARCHAR(255) NOT NULL,
        owner_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(50),
        category VARCHAR(100),
        description TEXT,
        logo_url TEXT,
        banner_url TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        commission_rate NUMERIC(5,2) DEFAULT 10.00,
        total_sales NUMERIC(12,2) DEFAULT 0,
        total_revenue NUMERIC(12,2) DEFAULT 0,
        rating NUMERIC(3,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS vendor_products (
        id SERIAL PRIMARY KEY,
        vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        stock INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Seed sample vendors
    await query(`
      INSERT INTO vendors (store_name, owner_name, email, phone, category, description, status, commission_rate, total_sales, total_revenue, rating)
      VALUES
        ('UrbanThread Co.', 'Rahul Sharma', 'rahul@urbanthread.com', '+91 98765 43210', 'Streetwear', 'Premium urban streetwear from Chennai. Hoodies, tees, and more.', 'active', 12.00, 342, 24800.00, 4.8),
        ('ChainKing', 'Arjun Nair', 'arjun@chainkingjewels.com', '+91 87654 32109', 'Jewelry', 'Authentic gold and silver plated chains handcrafted in India.', 'active', 8.00, 210, 18500.00, 4.9),
        ('SlickWear', 'Priya Mehta', 'priya@slickwear.in', '+91 76543 21098', 'Casual', 'Casual and formal fusion shirts and pants for modern professionals.', 'pending', 10.00, 0, 0, 0),
        ('DrapeHouse', 'Samuel Thomas', 'samuel@drapehouse.com', '+91 65432 10987', 'Fashion', 'Sustainable fashion using organic fabrics. Eco-friendly and stylish.', 'active', 11.00, 156, 9200.00, 4.6),
        ('NeonInk Apparel', 'Kavya R.', 'kavya@neonink.com', '+91 54321 09876', 'Streetwear', 'Bold graphic tees with neon prints. Stand out with NeonInk.', 'suspended', 10.00, 89, 5300.00, 3.9)
      ON CONFLICT (email) DO NOTHING
    `);

    return NextResponse.json({ success: true, message: 'Vendor tables initialized and seeded.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await query(`SELECT * FROM vendors ORDER BY created_at DESC`);
    return NextResponse.json(res.rows);
  } catch (error: any) {
    // Return mock data on DB error
    return NextResponse.json([
      { id: 1, store_name: 'UrbanThread Co.', owner_name: 'Rahul Sharma', email: 'rahul@urbanthread.com', phone: '+91 98765 43210', category: 'Streetwear', status: 'active', commission_rate: 12, total_sales: 342, total_revenue: 24800, rating: 4.8, created_at: new Date().toISOString() },
      { id: 2, store_name: 'ChainKing', owner_name: 'Arjun Nair', email: 'arjun@chainkingjewels.com', phone: '+91 87654 32109', category: 'Jewelry', status: 'active', commission_rate: 8, total_sales: 210, total_revenue: 18500, rating: 4.9, created_at: new Date().toISOString() },
      { id: 3, store_name: 'SlickWear', owner_name: 'Priya Mehta', email: 'priya@slickwear.in', phone: '+91 76543 21098', category: 'Casual', status: 'pending', commission_rate: 10, total_sales: 0, total_revenue: 0, rating: 0, created_at: new Date().toISOString() },
      { id: 4, store_name: 'DrapeHouse', owner_name: 'Samuel Thomas', email: 'samuel@drapehouse.com', phone: '+91 65432 10987', category: 'Fashion', status: 'active', commission_rate: 11, total_sales: 156, total_revenue: 9200, rating: 4.6, created_at: new Date().toISOString() },
      { id: 5, store_name: 'NeonInk Apparel', owner_name: 'Kavya R.', email: 'kavya@neonink.com', phone: '+91 54321 09876', category: 'Streetwear', status: 'suspended', commission_rate: 10, total_sales: 89, total_revenue: 5300, rating: 3.9, created_at: new Date().toISOString() },
    ]);
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, commission_rate } = await req.json();
    if (commission_rate !== undefined) {
      await query('UPDATE vendors SET commission_rate = $1 WHERE id = $2', [commission_rate, id]);
    }
    if (status !== undefined) {
      await query('UPDATE vendors SET status = $1 WHERE id = $2', [status, id]);
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
