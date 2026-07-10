import Navbar from '@/components/Navbar';
import Link from 'next/link';
import HeroCanvasWrapper from '@/components/HeroCanvasWrapper';
import { Layers, Zap, ChevronRight, Palette, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { query } from '@/lib/db';
import AddToCartButton from '@/components/AddToCartButton';

export default async function Home() {
  let products: any[] = [];
  try {
    const res = await query('SELECT * FROM products ORDER BY id ASC LIMIT 6');
    if (res && res.rows) {
      products = res.rows;
    }
  } catch (error) {
    console.error("Failed to fetch products for home page:", error);
  }

  // Fallback products if DB fails or is empty
  if (products.length === 0) {
    products = [
      { id: 1, name: 'Men Collection', price: 45.00, image_url: '/Naruto_hoody/T-shirt_with_Naruto_202604141455-ezremove_000.webp', category: 'collection' },
      { id: 2, name: 'Couple Sets', price: 80.00, image_url: '/asessts/couple_view.jpg', category: 'collection' },
      { id: 3, name: 'Festival Edit', price: 50.00, image_url: '/asessts/all_types.jpg', category: 'collection' },
      { id: 4, name: 'Group Orders', price: 40.00, image_url: '/asessts/group_tshirt.jpg', category: 'collection' },
      { id: 5, name: 'Luxury Gold Chain', price: 120.00, image_url: '/asessts/chains2.jpg', category: 'chain' },
      { id: 6, name: 'Luxury Silver Chain', price: 110.00, image_url: '/asessts/chains2.jpg', category: 'chain' }
    ];
  }

  const features = [
    { icon: Palette, title: 'WebGL Customizer', desc: 'Experiment with colors, metalness, and roughness in a physical lighting space.' },
    { icon: Layers, title: 'DTG Graphic Decals', desc: 'Upload your designs and logos. They map flawlessly onto the fabric geometry.' },
    { icon: Zap, title: 'Instant Cart Checkout', desc: 'Design your signature look and checkout directly. We print on demand.' },
  ];

  const templates = [
    {
      id: 'classic',
      name: 'Arctic Blank Tee',
      desc: 'Clean, minimalist style. 240 GSM organic heavy combed cotton.',
      color: '#eeeeee',
      price: 45.00,
      accent: '#aaa',
      roughness: 1,
      metalness: 0
    },
    {
      id: 'retro',
      name: 'Retro Gold Edition',
      desc: 'Vibrant yellow core. Features slightly weathered vintage presets.',
      color: '#eab308',
      price: 45.00,
      accent: '#eab308',
      roughness: 0.8,
      metalness: 0.2
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Crimson',
      desc: 'Metallic blood-red finish. Specular reflections and high contrast.',
      color: '#ef4444',
      price: 45.00,
      accent: '#ef4444',
      roughness: 0.2,
      metalness: 0.8
    }
  ];

  return (
    <main style={{ backgroundColor: '#050505', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        alignItems: 'center', 
        padding: '120px 5vw 60px', 
        gap: '4rem', 
        position: 'relative', 
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: '40%', right: '10%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' }} />
        
        {/* Hero Text */}
        <div style={{ zIndex: 10, maxWidth: '600px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '99px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> Interactive 3D Shop
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1.5rem', letterSpacing: '-0.02em', background: 'linear-gradient(180deg, #fff, #999)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Design Your Own Premium Wear
          </h1>
          <p style={{ color: '#aaa', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Create customized apparel with our live 3D studio. Pick fabrics, adjust finishes, upload your own graphics, and checkout instantly. We print and ship your custom creations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/customize" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2.2rem', background: '#3b82f6', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem', transition: 'transform 0.2s', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)' }}>
              Open 3D Studio <ChevronRight size={18} />
            </Link>
            <Link href="#templates" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1.1rem 2.2rem', background: 'rgba(255,255,255,0.03)', color: '#fff', fontWeight: 700, borderRadius: '8px', textDecoration: 'none', fontSize: '0.95rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              Explore Templates
            </Link>
          </div>
        </div>

        {/* Hero 3D Preview */}
        <div style={{ zIndex: 10, position: 'relative', height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'grab' }}>
          <div style={{ width: '100%', height: '100%' }}>
            <HeroCanvasWrapper />
          </div>
        </div>
      </section>

      {/* 3D Customizable Templates Section */}
      <section id="templates" style={{ padding: '6rem 5vw', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Custom T-Shirt Templates</h2>
            <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>Select a starter preset and personalize it in full 3D interactive workspace.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {templates.map((template) => (
              <div 
                key={template.id} 
                className="glass-panel" 
                style={{ 
                  padding: '2.5rem', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'border-color 0.3s ease'
                }}
              >
                {/* Visual indicator representation of starting color swatch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '12px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.03)', position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: template.color, boxShadow: `0 0 30px ${template.color}33`, border: '3px solid rgba(255,255,255,0.1)' }} />
                  <span style={{ position: 'absolute', top: 12, right: 12, padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: '#888', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {template.id}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>{template.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.5rem', flexGrow: 1 }}>{template.desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 850, color: '#4ade80' }}>${template.price.toFixed(2)}</span>
                  <Link href={`/customize?template=${template.id}`} style={{ padding: '0.8rem 1.5rem', background: '#fff', color: '#000', fontWeight: 700, borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', transition: 'background-color 0.2s' }}>
                    Customize in 3D
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Showcase (Standard Collection Grid) */}
      <section id="catalog" style={{ padding: '6rem 5vw' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.8rem', letterSpacing: '-0.02em' }}>Shop Pre-Designed Releases</h2>
            <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto', fontSize: '1.05rem' }}>Premium ready-to-wear streetwear pieces and silver/gold chains.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem 2rem' }}>
            {products.map((item: any) => (
              <div key={item.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '1rem' }}>
                  <Link href={`/product/${item.id}`} style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Link>
                </div>
                <div>
                  <span style={{ color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.3rem' }}>{item.category}</span>
                  <Link href={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: '#fff', marginBottom: '0.4rem' }}>{item.name}</h3>
                  </Link>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700 }}>${Number(item.price).toFixed(2)}</span>
                    <AddToCartButton 
                      item={{
                        id: item.id,
                        name: item.name,
                        price: Number(item.price),
                        image: item.image_url
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: '#111',
                        border: '1px solid #333',
                        color: '#fff',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Features Section */}
      <section style={{ padding: '6rem 5vw', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-panel" style={{ padding: '2.5rem 2rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <f.icon size={24} color="#60a5fa" />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 650 }}>{f.title}</h3>
                <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.9rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '4rem 5vw', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.05em', marginBottom: '1rem', color: '#fff' }}>ZYROZ CUSTOMS</h3>
        <p style={{ color: '#444', fontSize: '0.85rem', marginBottom: '2rem' }}>Interactive WebGL Apparel Workspace.</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          {['Shop', 'Customize', 'Privacy', 'Support'].map(l => (
            <Link key={l} href="#" style={{ color: '#666', textDecoration: 'none', fontSize: '0.85rem' }}>{l}</Link>
          ))}
        </div>
      </footer>
    </main>
  );
}
