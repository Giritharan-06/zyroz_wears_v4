import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT * FROM discounts ORDER BY created_at DESC');
    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discounts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, type, value, min_purchase, expiry_date, usage_limit, is_active } = await req.json();
    
    await query(
      `INSERT INTO discounts (code, type, value, min_purchase, expiry_date, usage_limit, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [code.toUpperCase(), type, value, min_purchase || 0, expiry_date || null, usage_limit || null, is_active ?? true]
    );
    
    return NextResponse.json({ message: 'Discount created' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create discount' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, is_active } = await req.json();
    await query('UPDATE discounts SET is_active = $1 WHERE id = $2', [is_active, id]);
    return NextResponse.json({ message: 'Discount updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update discount' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await query('DELETE FROM discounts WHERE id = $1', [id]);
    return NextResponse.json({ message: 'Discount deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete discount' }, { status: 500 });
  }
}
