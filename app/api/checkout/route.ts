import { query } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer_name, customer_email, shipping_address, total_amount, items } = body;
    
    // Check if user is logged in
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    let userId = null;
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie.value);
        userId = user.id;
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    }

    const itemsCount = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    const trackingNumber = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create the order in orders table
    const orderRes = await query(
      `INSERT INTO orders (user_id, total_amount, items_count, shipping_address, tracking_number, customer_name, customer_email, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [userId, total_amount, itemsCount, shipping_address, trackingNumber, customer_name, customer_email, 'Processing']
    );

    const orderId = (orderRes?.rows?.[0] as any)?.id || Math.floor(100000 + Math.random() * 900000);

    // Check for custom designs (metadata.isCustom is true) and insert into custom_designs table
    for (const item of items) {
      if (item.metadata?.isCustom) {
        const color = item.metadata.color || 'Default';
        const size = item.metadata.size || 'M';
        const roughness = item.metadata.roughness ?? 1;
        const metalness = item.metadata.metalness ?? 0;
        const decalUrl = item.metadata.decalUrl || '';
        
        const designNotes = `Product: Custom 3D T-Shirt
Color: ${color}
Size: ${size}
Roughness: ${roughness}
Metalness: ${metalness}
Order Reference: #${orderId}`;

        await query(
          `INSERT INTO custom_designs (customer_name, email, design_notes, image_url)
           VALUES ($1, $2, $3, $4)`,
          [customer_name, customer_email, designNotes, decalUrl || null]
        );
      }
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: 'Failed to place order', details: error.message }, { status: 500 });
  }
}
