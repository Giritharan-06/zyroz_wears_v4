import { query } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

export default async function CollectionPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  let products: any[] = [];
  
  try {
    // Query database for products belonging to this sub_category
    const res = await query('SELECT * FROM products WHERE sub_category = $1', [id]);
    if (res && res.rows) {
      products = res.rows;
    }
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  const categoryName = id.toUpperCase();

  return (
    <main style={{ backgroundColor: '#000', minHeight: '100vh', position: 'relative' }}>
      <Navbar />
      <div style={{ paddingTop: '15vh', paddingBottom: '10vh', minHeight: '80vh', display: 'flex', flexDirection: 'column' }} className="container">
        
        <Link href="/" style={{ color: '#888', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', textTransform: 'uppercase' }}>{categoryName} COLLECTION</h1>
        <p style={{ color: '#aaa', marginBottom: '4rem', fontSize: '1.2rem' }}>Premium items designed to match your identity.</p>

        {products.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#555', fontSize: '1.2rem' }}>No products available in this collection yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
            {products.map((item: any) => (
              <div key={item.id} style={{ backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
                <Link href={`/product/${item.id}`} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ width: '100%', height: '400px', backgroundColor: '#151515' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: 600 }}>{item.name}</h3>
                  </div>
                </Link>
                <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 500 }}>${Number(item.price).toFixed(2)}</span>
                    <AddToCartButton 
                      item={{
                        id: item.id,
                        name: item.name,
                        price: Number(item.price),
                        image: item.image_url
                      }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <footer style={{ borderTop: '1px solid #111', padding: '3rem 5vw', color: '#555', fontSize: '0.9rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} ZYROZ. All rights reserved.</p>
      </footer>
    </main>
  );
}
