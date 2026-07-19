import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProductDetailsClient from '@/components/ProductDetailsClient';

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch product
  const id = params.id;
  let product = null;
  
  try {
    const res = await query('SELECT * FROM products WHERE id = $1', [id]);
    if (res && res.rows.length > 0) {
      product = res.rows[0];
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) {
    // Fallback mock data if DB fails or product not found
    if (id === 'demo' || isNaN(Number(id))) {
       product = {
         id,
         name: "Premium Varsity Jacket",
         price: 189.99,
         description: "A timeless classic reimagined. Crafted with premium wool and genuine leather sleeves. Features intricate embroidery and a tailored fit.",
         category: "outerwear",
         image_url: "/asessts/all_types.jpg",
         images: ["/asessts/all_types.jpg", "/asessts/couple_view.jpg", "/asessts/group_tshirt.jpg"] // Mock multiple images
       };
    } else {
       notFound();
    }
  }

  const p = product as any;

  // Parse multiple images if available, else duplicate the main image to simulate a gallery
  let images = [p.image_url];
  if (p.images && Array.isArray(p.images)) {
    images = p.images;
  } else {
    // Mock multiple angles based on main image
    images = [p.image_url, p.image_url, p.image_url];
  }

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', color: '#000000' }}>
      <Navbar />
      
      <div className="container" style={{ paddingTop: '15vh', paddingBottom: '10vh' }}>
        <ProductDetailsClient product={{ ...p, images }} />
      </div>
    </main>
  );
}
