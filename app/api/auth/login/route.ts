import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const res = await query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = res.rows[0] as any;
    delete user.password;

    // Set a simple cookie (in real apps, use a JWT or session token)
    (await cookies()).set('user', JSON.stringify(user), {
      httpOnly: false, // For simplicity in this demo so we can read it on client
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
