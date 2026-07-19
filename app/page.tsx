import Navbar from '@/components/Navbar';
import Link from 'next/link';
import HeroCanvasWrapper from '@/components/HeroCanvasWrapper';
import HeroSlider from '@/components/HeroSlider';
import { Layers, Zap, ChevronRight, Palette, Sparkles, Star, Percent } from 'lucide-react';
import { query } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';

export default async function Home() {
  let products: any[] = [];
  try {
    const res = await query('SELECT * FROM products ORDER BY id ASC LIMIT 8');
    if (res && res.rows) {
      products = res.rows;
    }
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
  }

  // Fallback products if DB fails or is empty
  if (products.length === 0) {
    products = [
      { id: 1, name: 'Tokyo Drift Heavy Tee', price: 2499, image_url: '/Naruto_hoody/T-shirt_with_Naruto_202604141455-ezremove_000.webp', category: 'collection', sub_category: 'men' },
      { id: 2, name: 'Yin & Yang Matching Set', price: 4999, image_url: '/asessts/couple_mockup_1.png', category: 'collection', sub_category: 'couple' },
      { id: 3, name: 'Electric Wave Acid Wash Tee', price: 2999, image_url: '/asessts/all_types.jpg', category: 'collection', sub_category: 'special' },
      { id: 4, name: 'Luxury Cuban Link Gold Chain', price: 5999, image_url: '/asessts/gold_chain_1.png', category: 'chain', sub_category: 'gold' }
    ];
  }

  const features = [
    { icon: Palette, title: 'WebGL 3D Studio', desc: 'Experiment with colors, metalness, and roughness in a physical lighting space.' },
    { icon: Layers, title: 'DTG Graphic Decals', desc: 'Upload your designs and logos. They map flawlessly onto the fabric geometry.' },
    { icon: Zap, title: 'Instant Cart Checkout', desc: 'Design your signature look and checkout directly. We print on demand.' },
  ];

  const templates = [
    {
      id: 'classic',
      name: 'Arctic Blank Tee',
      desc: 'Clean, minimalist style. 240 GSM organic heavy combed cotton.',
      color: '#eeeeee',
      price: 2499,
      accent: '#aaa',
      roughness: 1,
      metalness: 0
    },
    {
      id: 'retro',
      name: 'Retro Gold Edition',
      desc: 'Vibrant yellow core. Features slightly weathered vintage presets.',
      color: '#eab308',
      price: 2499,
      accent: '#eab308',
      roughness: 0.8,
      metalness: 0.2
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Crimson',
      desc: 'Metallic blood-red finish. Specular reflections and high contrast.',
      color: '#ef4444',
      price: 2499,
      accent: '#ef4444',
      roughness: 0.2,
      metalness: 0.8
    }
  ];

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', position: 'relative', overflowX: 'hidden', color: '#000' }}>
      <Navbar />

      {/* Category Quick Nav Bubble List (The Souled Store Style) */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2.5rem', 
          padding: '130px 5vw 25px', 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch', 
          backgroundColor: '#f8f9fa', 
          borderBottom: '1px solid #eaeaea' 
        }} 
        className="custom-scrollbar"
      >
        {[
          { name: '3D Studio', href: '/customize', icon: '🎨', color: 'rgba(225, 29, 72, 0.06)' },
          { name: 'Men Wear', href: '/collection/men', icon: '👕', color: '#fff' },
          { name: 'Couples Sets', href: '/collection/couple', icon: '👩‍❤️‍👨', color: '#fff' },
          { name: 'Women Wear', href: '/collection/women', icon: '👚', color: '#fff' },
          { name: 'Special Edition', href: '/collection/special', icon: '✨', color: '#fff' },
        ].map((cat, idx) => (
          <Link key={idx} href={cat.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem', minWidth: '85px', textDecoration: 'none' }}>
            <div 
              className="bubble-nav-item"
              style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                backgroundColor: cat.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '1.8rem', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)', 
                transition: 'transform 0.2s, border-color 0.2s' 
              }}
            >
              {cat.icon}
            </div>
            <span style={{ fontSize: '0.8rem', color: '#4a5568', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Hero Slider Carousel Section (The Souled Store Product Display Theme) */}
      <HeroSlider />

      {/* Interactive 3D Teaser Section */}
      <section style={{ 
        padding: '5rem 5vw', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        alignItems: 'center', 
        gap: '4rem', 
        maxWidth: '1400px',
        margin: '0 auto',
        backgroundColor: '#ffffff'
      }}>
        {/* Teaser Text */}
        <div style={{ maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '99px', background: 'rgba(225,29,72,0.06)', border: '1px solid rgba(225,29,72,0.12)', color: '#e11d48', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Sparkles size={14} style={{ color: '#e11d48' }} /> Live 3D Editor Workspace
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#000' }}>
            You Are the Designer
          </h2>
          <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Interactive real-time 3D model customization at your fingertips. Rotate and inspect fabrics under physical studio lighting. Adjust colors, decals, metalness, and preview before checkout.
          </p>
          <Link href="/customize" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', background: '#e11d48', color: '#fff', fontWeight: 800, borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', boxShadow: '0 4px 14px rgba(225, 29, 72, 0.2)' }}>
            Launch 3D Studio <ChevronRight size={16} />
          </Link>
        </div>

        {/* Hero 3D Preview (Interactive) */}
        <div style={{ position: 'relative', height: '420px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'grab', background: '#f8f9fa', borderRadius: '16px', border: '1px solid #eaeaea', overflow: 'hidden' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <HeroCanvasWrapper />
          </div>
        </div>
      </section>

      {/* 3D Customizable Templates Section */}
      <section id="templates" style={{ padding: '6rem 5vw', background: '#f8f9fa', borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, marginBottom: '0.8rem', letterSpacing: '-0.02em', color: '#000' }}>Interactive Customizer Starter Presets</h2>
            <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>Select a blank slate template to begin editing color and texture parameters.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="glass-panel" 
                style={{ 
                  padding: '2.5rem', 
                  borderRadius: '16px', 
                  backgroundColor: '#ffffff',
                  border: '1px solid #eaeaea', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'border-color 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', backgroundColor: '#f8f9fa', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #eee', position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: template.color, boxShadow: `0 0 20px rgba(0,0,0,0.05)`, border: '3px solid #fff' }} />
                  <span style={{ position: 'absolute', top: 12, right: 12, padding: '0.3rem 0.6rem', borderRadius: '4px', background: '#eaeaea', color: '#555', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {template.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', color: '#000' }}>{template.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: 1 }}>{template.desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #eee' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f766e' }}>₹{template.price.toLocaleString('en-IN')}</span>
                  <Link href={`/customize?template=${template.id}`} style={{ padding: '0.8rem 1.5rem', background: '#000', color: '#fff', fontWeight: 800, borderRadius: '8px', textDecoration: 'none', fontSize: '0.85rem', transition: 'background-color 0.2s' }}>
                    Customize in 3D
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Showcase (The Souled Store Inspired Grid Layout) */}
      <section id="catalog" style={{ padding: '6rem 5vw', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, marginBottom: '0.8rem', letterSpacing: '-0.02em', color: '#000' }}>Bestsellers & New Drops</h2>
            <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>Top releases trending this week. Grab pre-designed styles or modify them in 3D.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '3.5rem 2.2rem' }}>
            {products.map((item: any, idx: number) => {
              const hasOffer = item.offer > 0;
              const originalPrice = hasOffer 
                ? Math.round(Number(item.price) / (1 - item.offer / 100)).toLocaleString('en-IN')
                : null;
              // Circular rotation of badge designs
              const badgeText = idx % 3 === 0 ? 'BESTSELLER' : (idx % 3 === 1 ? 'NEW ARRIVAL' : '100% COTTON');
              const badgeBg = idx % 3 === 0 ? '#e11d48' : (idx % 3 === 1 ? '#3b82f6' : '#10b981');

              return (
                <div key={item.id} className="product-card-container" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Thumbnail Wrapper */}
                  <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#f8f9fa', borderRadius: '14px', overflow: 'hidden', border: '1px solid #eee', marginBottom: '1.2rem', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                    {/* Badge Overlay */}
                    <span style={{ position: 'absolute', top: 12, left: 12, backgroundColor: badgeBg, color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.3rem 0.6rem', borderRadius: '4px', letterSpacing: '0.05em', zIndex: 5 }}>
                      {badgeText}
                    </span>
                    
                    <Link href={`/product/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                      <img src={item.image_url} alt={item.name} className="product-card-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Link>
                  </div>
                  
                  {/* Product Metadata */}
                  <div>
                    <span style={{ color: '#e11d48', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>{item.category}</span>
                    
                    <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#000', marginBottom: '0.3rem', lineHeight: '1.3' }}>{item.name}</h3>
                    </Link>

                    {/* Customer Review Summary */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', color: '#eab308' }}><Star size={12} fill="#eab308" /></div>
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
                        {/* Customize Link Shortcut */}
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
        </div>
      </section>

      {/* Zyroz Club Promo Banner (The Souled Store Style Pricing Mechanics) */}
      <section style={{ padding: '4rem 5vw 6rem', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div 
            style={{ 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
              borderRadius: '24px', 
              padding: '3.5rem 3vw', 
              border: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
            }}
          >
            {/* Background glowing sphere decoration */}
            <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(225, 29, 72, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ zIndex: 10, maxWidth: '650px' }}>
              <span style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Exclusive Membership</span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#000', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Join ZYROZ Club & Save Big</h2>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Become a premium member today. Get a **flat 15% discount** on all 3D customizer orders, early access to limited edition drops, and free shipping on everything.
              </p>
            </div>
            
            <div style={{ zIndex: 10, display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', color: '#000' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹999</span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>/ year</span>
              </div>
              <Link href="/signup" style={{ textAlign: 'center', padding: '1rem 2rem', background: '#e11d48', color: '#fff', fontWeight: 800, borderRadius: '10px', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(225, 29, 72, 0.25)' }}>
                Join ZYROZ Club
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Features Section */}
      <section style={{ padding: '6rem 5vw', background: '#f8f9fa', borderTop: '1px solid #eaeaea' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(225, 29, 72, 0.06)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <f.icon size={24} color="#e11d48" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 800, color: '#000' }}>{f.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 5vw', background: '#ffffff', borderTop: '1px solid #eaeaea', textAlign: 'center', color: '#000' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '1rem', color: '#000' }}>ZYROZ CUSTOMS</h3>
        <p style={{ color: '#777', fontSize: '0.85rem', marginBottom: '2rem' }}>Interactive WebGL Apparel Workspace.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {['Shop', 'Customize', 'Privacy', 'Support'].map(l => (
            <Link key={l} href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}>{l}</Link>
          ))}
        </div>
      </footer>

      {/* Custom Stylesheet block to inject hover dynamics */}
      <style>{`
        .product-card-img {
          transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .product-card-container:hover .product-card-img {
          transform: scale(1.04);
        }
        .bubble-nav-item:hover {
          transform: translateY(-4px) scale(1.05);
          border-color: #e11d48 !important;
        }
      `}</style>
    </main>
  );
}
