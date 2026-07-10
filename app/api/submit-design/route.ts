import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const notes = formData.get('notes') as string;
    const productType = formData.get('productType') as string;

    const designImage = formData.get('designImage') as File;
    let imageUrl = null;

    if (designImage && designImage.name && designImage.size > 0) {
      const bytes = await designImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${designImage.name.replace(/\s+/g, '-')}`;
      const path = `./public/uploads/${filename}`;
      await require('fs').promises.writeFile(path, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    // Collect all options that start with opt_
    const options: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (key.startsWith('opt_')) {
        options[key.replace('opt_', '').replace(/_/g, ' ')] = value.toString();
      }
    });

    const fullNotes = `Product: ${productType}\nOptions: ${JSON.stringify(options)}\nAdditional Notes: ${notes || 'None'}`;

    if (name && email) {
      await query(
        'INSERT INTO custom_designs (customer_name, email, design_notes, image_url) VALUES ($1, $2, $3, $4)',
        [name, email, fullNotes, imageUrl]
      );
      
      return NextResponse.redirect(new URL('/customize?success=true', req.url), 303);
    }

    return NextResponse.redirect(new URL('/customize?error=missing_fields', req.url), 303);
  } catch (error) {
    console.error("Error submitting design:", error);
    return NextResponse.redirect(new URL('/customize?error=server_error', req.url), 303);
  }
}
