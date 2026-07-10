'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, Layers, Sliders, Box, Save, Image as ImageIcon, ShoppingBag, CreditCard, Check, Loader2 } from 'lucide-react';
import CanvasModel from './CanvasModel';
import { useCart } from '@/context/CartContext';

const colors = [
  { name: 'Obsidian', hex: '#111111' },
  { name: 'Arctic', hex: '#eeeeee' },
  { name: 'Crimson', hex: '#ef4444' },
  { name: 'Cobalt', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#22c55e' },
  { name: 'Gold', hex: '#eab308' },
];

const templates = [
  { id: 'classic', name: 'Arctic Blank Tee', color: '#eeeeee', roughness: 1, metalness: 0, graphic: null },
  { id: 'retro', name: 'Retro Gold Edition', color: '#eab308', roughness: 0.8, metalness: 0.2, graphic: '/next.svg' },
  { id: 'cyberpunk', name: 'Cyberpunk Crimson', color: '#ef4444', roughness: 0.2, metalness: 0.8, graphic: '/asessts/Zyroz_logo.jpeg' },
];

function CustomizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [design, setDesign] = useState({
    color: '#111111',
    graphic: null as string | null,
    position: { x: 50, y: 50 },
    scale: 1,
    rotation: 0,
    roughness: 1,
    metalness: 0,
    environment: 'city' as any,
  });

  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTemplate, setActiveTemplate] = useState('classic');
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  // Initialize design from URL search params template
  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (templateParam) {
      const match = templates.find(t => t.id === templateParam);
      if (match) {
        setActiveTemplate(match.id);
        setDesign({
          color: match.color,
          graphic: match.graphic,
          position: { x: 50, y: 50 },
          scale: 1,
          rotation: 0,
          roughness: match.roughness,
          metalness: match.metalness,
          environment: 'city',
        });
      }
    }
  }, [searchParams]);

  const handleTemplateChange = (id: string) => {
    const match = templates.find(t => t.id === id);
    if (match) {
      setActiveTemplate(match.id);
      setDesign({
        ...design,
        color: match.color,
        graphic: match.graphic,
        roughness: match.roughness,
        metalness: match.metalness,
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setDesign(prev => ({ ...prev, graphic: data.url }));
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Decal upload failed, using fallback local URL:', err);
        const url = URL.createObjectURL(file);
        setDesign(prev => ({ ...prev, graphic: url }));
      } finally {
        setUploading(false);
      }
    }
  };

  const activeColorName = colors.find(c => c.hex === design.color)?.name || 'Custom';
  const basePrice = 45.00;
  const decalPrice = design.graphic ? 10.00 : 0.00;
  const totalPrice = basePrice + decalPrice;

  const handleAddToCart = () => {
    addToCart({
      id: `custom-shirt-${Date.now()}`,
      name: `Custom 3D T-Shirt - ${activeColorName}`,
      price: totalPrice,
      image: design.graphic || '/asessts/Zyroz_logo.jpeg',
      metadata: {
        isCustom: true,
        color: activeColorName,
        hexColor: design.color,
        size: selectedSize,
        decalUrl: design.graphic,
        roughness: design.roughness,
        metalness: design.metalness,
      }
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      id: `custom-shirt-${Date.now()}`,
      name: `Custom 3D T-Shirt - ${activeColorName}`,
      price: totalPrice,
      image: design.graphic || '/asessts/Zyroz_logo.jpeg',
      metadata: {
        isCustom: true,
        color: activeColorName,
        hexColor: design.color,
        size: selectedSize,
        decalUrl: design.graphic,
        roughness: design.roughness,
        metalness: design.metalness,
      }
    });
    router.push('/checkout');
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#000' }}>
      
      {/* LEFT PANEL - Assets & Templates */}
      <div className="glass-panel" style={{ width: '280px', height: '100%', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 10 }}>
        <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={16} /> Templates
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.75rem', display: 'block' }}>Starting Preset</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {templates.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => handleTemplateChange(t.id)}
                  style={{ 
                    padding: '0.8rem 1rem', 
                    background: activeTemplate === t.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)', 
                    borderRadius: '8px', 
                    border: `1px solid ${activeTemplate === t.id ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.05)'}`, 
                    color: activeTemplate === t.id ? '#3b82f6' : '#bbb', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Box size={16} /> {t.name}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.75rem', display: 'block' }}>Upload Decal</label>
            <label style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
                padding: '1.2rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '8px', 
                cursor: 'pointer', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s',
                position: 'relative'
              }}>
                {uploading ? (
                  <>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} color="#888" />
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>{design.graphic ? 'Replace Image' : 'Select Image'}</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>
            {design.graphic && (
                <div style={{ marginTop: '1rem', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={design.graphic} alt="Decal preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                  <button onClick={() => setDesign({ ...design, graphic: null })} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.7)', padding: '0.4rem 0.8rem', borderRadius: '4px', color: '#ef4444', fontSize: '0.75rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remove</button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER CANVAS */}
      <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, #000 80%)' }}>
        <CanvasModel 
          color={design.color} 
          graphicUrl={design.graphic} 
          position={design.position} 
          scale={design.scale} 
          rotation={design.rotation}
          roughness={design.roughness}
          metalness={design.metalness}
          environment={design.environment}
        />
        {/* Overlay drag hint */}
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', color: '#aaa', zIndex: 5, pointerEvents: 'none' }}>
          Drag to rotate shirt. Pinch/scroll to zoom.
        </div>
      </div>

      {/* RIGHT PANEL - Properties & Checkout */}
      <div className="glass-panel custom-scrollbar" style={{ width: '320px', height: '100%', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderRight: 'none', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 10, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={16} /> Options
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Material Color */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.8rem', display: 'block', fontWeight: 600 }}>Material Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {colors.map(c => (
                <div key={c.name} onClick={() => setDesign({ ...design, color: c.hex })}
                  style={{
                    height: '40px', borderRadius: '6px', backgroundColor: c.hex, cursor: 'pointer',
                    border: `2px solid ${design.color === c.hex ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: design.color === c.hex ? '0 0 15px rgba(59, 130, 246, 0.3)' : 'none',
                    transition: 'all 0.2s'
                  }} title={c.name} />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '0.8rem', display: 'block', fontWeight: 600 }}>Select Size</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0',
                    borderRadius: '6px',
                    border: `1px solid ${selectedSize === size ? '#fff' : 'rgba(255,255,255,0.1)'}`,
                    background: selectedSize === size ? '#fff' : 'rgba(255,255,255,0.02)',
                    color: selectedSize === size ? '#000' : '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Material Finish */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ color: '#ccc', fontSize: '0.85rem', fontWeight: 600 }}>Roughness</label>
                <span style={{ color: '#fff', fontSize: '0.8rem' }}>{design.roughness}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={design.roughness} onChange={e => setDesign({ ...design, roughness: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#3b82f6' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ color: '#ccc', fontSize: '0.85rem', fontWeight: 600 }}>Metalness</label>
                <span style={{ color: '#fff', fontSize: '0.8rem' }}>{design.metalness}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={design.metalness} onChange={e => setDesign({ ...design, metalness: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#3b82f6' }} />
            </div>
          </div>

          {/* Decal Transform */}
          {design.graphic ? (
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <label style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                 <ImageIcon size={14} /> Decal Transform
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Position X</label>
                    <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{design.position.x}%</span>
                  </div>
                  <input type="range" min="20" max="80" value={design.position.x} onChange={e => setDesign({ ...design, position: { ...design.position, x: parseInt(e.target.value) } })}
                    style={{ width: '100%', accentColor: '#3b82f6' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Position Y</label>
                    <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{design.position.y}%</span>
                  </div>
                  <input type="range" min="20" max="80" value={design.position.y} onChange={e => setDesign({ ...design, position: { ...design.position, y: parseInt(e.target.value) } })}
                    style={{ width: '100%', accentColor: '#3b82f6' }} />
                </div>
                  
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Scale</label>
                    <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{design.scale}x</span>
                  </div>
                  <input type="range" min="0.5" max="3" step="0.1" value={design.scale} onChange={e => setDesign({ ...design, scale: parseFloat(e.target.value) })}
                    style={{ width: '100%', accentColor: '#3b82f6' }} />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#aaa', fontSize: '0.75rem' }}>Rotation</label>
                    <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 600 }}>{design.rotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={design.rotation} onChange={e => setDesign({ ...design, rotation: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#3b82f6' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '8px' }}>
              <p style={{ color: '#555', fontSize: '0.8rem' }}>Upload a decal to unlock transform controls.</p>
            </div>
          )}

          {/* Pricing & Cart E-Commerce Panel */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
                <span>Base Classic Tee</span>
                <span>${basePrice.toFixed(2)}</span>
              </div>
              {decalPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#888' }}>
                  <span>Custom Decal Print</span>
                  <span>+${decalPrice.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#fff', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', marginTop: '0.2rem' }}>
                <span>Total Price</span>
                <span style={{ color: '#4ade80' }}>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button 
                onClick={handleAddToCart}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  background: added ? '#4ade80' : 'rgba(255,255,255,0.05)',
                  color: added ? '#000' : '#fff',
                  border: `1px solid ${added ? '#4ade80' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                {added ? 'Added to Cart' : 'Add to Cart'}
              </button>

              <button 
                onClick={handleBuyNow}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.6rem',
                  background: '#fff',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                <CreditCard size={18} />
                Buy It Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnimeCustomizer() {
  return (
    <Suspense fallback={<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', background: '#000', height: '100%' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /><p style={{ marginTop: '10px', color: '#888' }}>Loading Customizer...</p></div>}>
      <CustomizerContent />
    </Suspense>
  );
}
