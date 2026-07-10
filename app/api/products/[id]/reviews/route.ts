import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

interface Review {
  id: number;
  product_id: number;
  customer_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const res = await query('SELECT id, product_id, customer_name, rating, comment, created_at FROM product_reviews WHERE product_id = $1 ORDER BY created_at DESC', [productId]);
    return NextResponse.json(res.rows as Review[]);
  } catch (error: unknown) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    const body = await req.json();
    const { customer_name, rating, comment } = body as {
      customer_name?: string;
      rating?: number;
      comment?: string;
    };

    if (!customer_name || !rating) {
      return NextResponse.json({ error: 'Missing required fields: customer_name, rating' }, { status: 400 });
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const res = await query(
      'INSERT INTO product_reviews (product_id, customer_name, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
      [productId, customer_name, rating, comment || null]
    );

    return NextResponse.json({ success: true, review: res.rows[0] });
  } catch (error: unknown) {
    console.error('API Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to post review', details: message }, { status: 500 });
  }
}
