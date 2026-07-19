import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();
    
    const res = await query(
      `SELECT * FROM discounts 
       WHERE code = $1 
       AND is_active = TRUE 
       AND (expiry_date IS NULL OR expiry_date > NOW())
       AND (usage_limit IS NULL OR usage_count < usage_limit)`,
      [code.toUpperCase()]
    );

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired discount code' }, { status: 400 });
    }

    const discount = res.rows[0] as any;

    if (parseFloat(cartTotal) < parseFloat(discount.min_purchase)) {
      return NextResponse.json({ 
        error: `Minimum purchase of $${discount.min_purchase} required for this code` 
      }, { status: 400 });
    }

    return NextResponse.json({
      id: discount.id,
      code: discount.code,
      type: discount.type,
      value: parseFloat(discount.value)
    });

  } catch (error) {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
