import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await query('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, sub_category, image_url, price, stock } = body;
    
    await query(
      'INSERT INTO products (name, category, sub_category, image_url, price, stock) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, category || 'collection', sub_category || 'general', image_url, price, stock]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
