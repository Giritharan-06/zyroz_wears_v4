import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

interface AdminReview {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
  product_name: string;
}

export async function GET() {
  try {
    const res = await query(`
      SELECT r.id, r.product_id, r.customer_name, r.rating, r.comment, r.created_at, p.name as product_name
      FROM product_reviews r
      JOIN products p ON r.product_id = p.id
      ORDER BY r.created_at DESC
    `);
    return NextResponse.json(res.rows as AdminReview[]);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch all reviews' }, { status: 500 });
  }
}
