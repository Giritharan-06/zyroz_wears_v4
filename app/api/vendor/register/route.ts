import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Vendor self-registration
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { store_name, owner_name, email, phone, category, description } = body;

    const res = await query(
      `INSERT INTO vendors (store_name, owner_name, email, phone, category, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending') RETURNING *`,
      [store_name, owner_name, email, phone, category, description]
    );
    return NextResponse.json({ success: true, vendor: res.rows[0] });
  } catch (error: any) {
    if (error.message?.includes('unique')) {
      return NextResponse.json({ error: 'A vendor with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
