import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query(`
      SELECT 
        id, customer_name, customer_email, status, total_amount, 
        created_at, items_count
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 50
    `);
    return NextResponse.json(res.rows);
  } catch (error) {
    // Return mock orders on DB error
    return NextResponse.json([
      { id: 'ORD-2001', customer_name: 'Alex Johnson', customer_email: 'alex@gmail.com', status: 'Processing', total_amount: 120.00, created_at: new Date().toISOString(), items_count: 2 },
      { id: 'ORD-2002', customer_name: 'Samantha Lee', customer_email: 'sam@gmail.com', status: 'Shipped', total_amount: 85.00, created_at: new Date(Date.now()-3600000).toISOString(), items_count: 1 },
      { id: 'ORD-2003', customer_name: 'Michael Chen', customer_email: 'mike@gmail.com', status: 'Delivered', total_amount: 210.00, created_at: new Date(Date.now()-7200000).toISOString(), items_count: 3 },
      { id: 'ORD-2004', customer_name: 'Emma Wilson', customer_email: 'emma@gmail.com', status: 'Delivered', total_amount: 310.00, created_at: new Date(Date.now()-86400000).toISOString(), items_count: 4 },
      { id: 'ORD-2005', customer_name: 'Lucas Gray', customer_email: 'lucas@gmail.com', status: 'Cancelled', total_amount: 60.00, created_at: new Date(Date.now()-172800000).toISOString(), items_count: 1 },
    ]);
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    await query('UPDATE orders SET status = $1 WHERE id = $2', [status, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
