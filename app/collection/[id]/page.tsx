import { query } from '@/lib/db';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Star, Palette } from 'lucide-react';
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

  const categoryName = id === 'special' ? 'SPECIAL EDITION' : id.toUpperCase();

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', position: 'relative', color: '#000' }}>
      <Navbar />
      
      <div style={{ paddingTop: '15vh', paddingBottom: '10vh', minHeight: '80vh', display: 'flex', flexDirection: 'column' }} className="container">
        
        <Link href="/" style={{ color: '#666', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block', fontWeight: 600 }}>
          &larr; Back to Home
        </Link>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', textTransform: 'uppercase', color: '#000', fontWeight: 900, letterSpacing: '-0.02em' }}>{categoryName} COLLECTION</h1>
        <p style={{ color: '#666', marginBottom: '4rem', fontSize: '1.1rem' }}>Premium items designed to match your identity.</p>

        {products.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#888', fontSize: '1.2rem' }}>No products available in this collection yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '3.5rem 2.2rem' }}>
            {products.map((item: any, idx: number) => {
              const hasOffer = item.offer > 0;
              const originalPrice = hasOffer 
                ? Math.round(Number(item.price) / (1 - item.offer / 100)).toLocaleString('en-IN')
                : null;
              const badgeText = idx % 3 === 0 ? 'BESTSELLER' : (idx % 3 === 1 ? 'NEW ARRIVAL' : '100% COTTON');
              const badgeBg = idx % 3 === 0 ? '#e11d48' : (idx % 3 === 1 ? '#3b82f6' : '#10b981');

              return (
                <div key={item.id} className="product-card-container" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Thumbnail Wrapper */}
                  <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f8f9fa', borderRadius: '14px', overflow: 'hidden', border: '1px solid #eee', marginBottom: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: badgeBg, color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '4px', letterSpacing: '0.05em', zIndex: 5 }}>
                      {badgeText}
                    </span>
                    
                    <Link href={`/product/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img src={item.image_url} alt={item.name} className="product-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                  </div>
                  
                  {/* Metadata */}
                  <div>
                    <span style={{ color: '#e11d48', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>{item.category}</span>
                    
                    <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000', marginBottom: '0.3rem', lineHeight: '1.3' }}>{item.name}</h3>
                    </Link>

                    {/* Reviews */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', color: '#eab308' }}><Star size={12} fill="#eab308" color="#eab308" /></div>
                      <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>4.8 | 120+ reviews</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#000' }}>₹{Math.round(Number(item.price)).toLocaleString('en-IN')}</span>
                          {hasOffer && (
                            <span style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'line-through' }}>₹{originalPrice}</span>
                          )}
                        </div>
                        {hasOffer && (
                          <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{item.offer}% OFF</span>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          href={`/customize?template=${item.sub_category === 'men' ? 'classic' : (item.sub_category === 'couple' ? 'retro' : 'cyberpunk')}`} 
                          title="Edit in 3D Studio"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#f8f9fa', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#718096', transition: 'all 0.2s' }}
                        >
                          <Palette size={16} />
                        </Link>
                        <AddToCartButton 
                          item={{
                            id: item.id,
                            name: item.name,
                            price: Number(item.price),
                            image: item.image_url
                          }}
                          style={{
                            padding: '0.5rem 0.8rem',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: '#000',
                            color: '#fff',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <footer style={{ borderTop: '1px solid #eaeaea', padding: '3rem 5vw', color: '#777', fontSize: '0.9rem', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <p>&copy; {new Date().getFullYear()} ZYROZ. All rights reserved.</p>
      </footer>

      <style>{`
        .product-card-img {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .product-card-container:hover .product-card-img {
          transform: scale(1.04);
        }
      `}</style>
    </main>
  );
}
