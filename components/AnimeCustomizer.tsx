'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Upload, Layers, Sliders, Box, ImageIcon, ShoppingBag, CreditCard, Check, Loader2, Trash2 } from 'lucide-react';
import CanvasModel from './CanvasModel';
import { useCart } from '@/context/CartContext';

interface DecalItem {
  id: string;
  url: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

const colors = [
  { name: 'Obsidian', hex: '#111111' },
  { name: 'Arctic', hex: '#eeeeee' },
  { name: 'Crimson', hex: '#ef4444' },
  { name: 'Cobalt', hex: '#3b82f6' },
  { name: 'Emerald', hex: '#22c55e' },
  { name: 'Gold', hex: '#eab308' },
];

const PRELOADED_DECALS = [
  { name: 'Zyroz Mascot', url: '/asessts/Zyroz_logo.jpeg' },
  { name: 'Classic Streetwear', url: '/asessts/couple_mockup_1.png' },
  { name: 'Urban Nomads', url: '/asessts/couple_mockup_2.png' },
  { name: 'Modern Wear', url: '/asessts/all_types.jpg' },
  { name: 'Gold Crest', url: '/asessts/gold_chain_1.png' },
  { name: 'Silver Link Print', url: '/asessts/gold_chain_2.png' },
];

const templates = [
  { id: 'classic', name: 'Arctic Blank Tee', color: '#eeeeee', roughness: 1, metalness: 0, graphic: null },
  { id: 'retro', name: 'Retro Gold Edition', color: '#eab308', roughness: 0.8, metalness: 0.2, graphic: '/asessts/gold_chain_1.png' },
  { id: 'cyberpunk', name: 'Cyberpunk Crimson', color: '#ef4444', roughness: 0.2, metalness: 0.8, graphic: '/asessts/Zyroz_logo.jpeg' },
];

function CustomizerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [design, setDesign] = useState({
    color: '#111111',
    decals: [] as DecalItem[],
    roughness: 1,
    metalness: 0,
  });

  const [gender, setGender] = useState<'men' | 'women'>('men');
  const [selectedDecalId, setSelectedDecalId] = useState<string | null>(null);
  const [isDraggingDecal, setIsDraggingDecal] = useState(false);
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
        const newId = `decal-${Date.now()}`;
        setDesign({
          color: match.color,
          decals: match.graphic ? [
            {
              id: newId,
              url: match.graphic,
              position: { x: 50, y: 50 },
              scale: 1,
              rotation: 0
            }
          ] : [],
          roughness: match.roughness,
          metalness: match.metalness,
        });
        setSelectedDecalId(match.graphic ? newId : null);
      }
    }
  }, [searchParams]);

  const handleTemplateChange = (id: string) => {
    const match = templates.find(t => t.id === id);
    if (match) {
      setActiveTemplate(match.id);
      const newId = `decal-${Date.now()}`;
      setDesign({
        ...design,
        color: match.color,
        decals: match.graphic ? [
          {
            id: newId,
            url: match.graphic,
            position: { x: 50, y: 50 },
            scale: 1,
            rotation: 0
          }
        ] : [],
        roughness: match.roughness,
        metalness: match.metalness,
      });
      setSelectedDecalId(match.graphic ? newId : null);
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
          const newId = `decal-${Date.now()}`;
          setDesign(prev => {
            const count = prev.decals.length;
            const offset = (count * 8) % 30; // Stagger so they don't overlay on top of each other exactly
            const xCoord = Math.min(Math.max(50 + (count % 2 === 0 ? offset : -offset), 15), 85);
            const yCoord = Math.min(Math.max(50 + (count % 2 === 0 ? -offset : offset), 15), 85);
            return {
              ...prev,
              decals: [...prev.decals, { 
                id: newId, 
                url: data.url, 
                position: { x: xCoord, y: yCoord }, 
                scale: 1, 
                rotation: 0 
              }]
            };
          });
          setSelectedDecalId(newId);
        } else {
          throw new Error('Upload failed');
        }
      } catch (err) {
        console.error('Decal upload failed, using fallback local URL:', err);
        const url = URL.createObjectURL(file);
        const newId = `decal-${Date.now()}`;
        setDesign(prev => {
          const count = prev.decals.length;
          const offset = (count * 8) % 30;
          const xCoord = Math.min(Math.max(50 + (count % 2 === 0 ? offset : -offset), 15), 85);
          const yCoord = Math.min(Math.max(50 + (count % 2 === 0 ? -offset : offset), 15), 85);
          return {
            ...prev,
            decals: [...prev.decals, { 
              id: newId, 
              url, 
              position: { x: xCoord, y: yCoord }, 
              scale: 1, 
              rotation: 0 
            }]
          };
        });
        setSelectedDecalId(newId);
      } finally {
        setUploading(false);
        e.target.value = ''; // Clear value to allow uploading the same file multiple times
      }
    }
  };

  const activeColorName = colors.find(c => c.hex === design.color)?.name || 'Custom';
  const basePrice = 2499.00; // INR Currency
  const printDecalsCount = design.decals.filter(d => !d.url.startsWith('data:')).length;
  const decalPrice = printDecalsCount * 499.00; // INR Currency
  const totalPrice = basePrice + decalPrice;

  const handleAddToCart = () => {
    addToCart({
      id: `custom-shirt-${Date.now()}`,
      name: `Custom 3D T-Shirt (${gender.toUpperCase()}) - ${activeColorName}`,
      price: totalPrice,
      image: design.decals[0]?.url || '/asessts/Zyroz_logo.jpeg',
      metadata: {
        isCustom: true,
        gender,
        color: activeColorName,
        hexColor: design.color,
        size: selectedSize,
        decals: design.decals,
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
      name: `Custom 3D T-Shirt (${gender.toUpperCase()}) - ${activeColorName}`,
      price: totalPrice,
      image: design.decals[0]?.url || '/asessts/Zyroz_logo.jpeg',
      metadata: {
        isCustom: true,
        gender,
        color: activeColorName,
        hexColor: design.color,
        size: selectedSize,
        decals: design.decals,
        roughness: design.roughness,
        metalness: design.metalness,
      }
    });
    router.push('/checkout');
  };

  const selectedDecal = design.decals.find(d => d.id === selectedDecalId);

  const updateSelectedDecal = (updates: Partial<DecalItem>) => {
    if (!selectedDecalId) return;
    setDesign(prev => ({
      ...prev,
      decals: prev.decals.map(d => d.id === selectedDecalId ? { ...d, ...updates } : d)
    }));
  };

  const removeDecal = (id: string) => {
    setDesign(prev => ({
      ...prev,
      decals: prev.decals.filter(d => d.id !== id)
    }));
    if (selectedDecalId === id) {
      setSelectedDecalId(null);
    }
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', color: '#000000' }}>
      
      {/* LEFT PANEL - Assets & Templates */}
      <div className="glass-panel" style={{ width: '280px', height: '100%', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRight: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 10, backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          <Layers size={16} /> Templates
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }} className="custom-scrollbar">
          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.75rem', display: 'block', fontWeight: 700 }}>Starting Preset</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {templates.map(t => (
                <div 
                  key={t.id} 
                  onClick={() => handleTemplateChange(t.id)}
                  style={{ 
                    padding: '0.8rem 1rem', 
                    background: activeTemplate === t.id ? 'rgba(225, 29, 72, 0.06)' : '#f8f9fa', 
                    borderRadius: '8px', 
                    border: `1px solid ${activeTemplate === t.id ? '#e11d48' : '#e2e8f0'}`, 
                    color: activeTemplate === t.id ? '#e11d48' : '#333', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    cursor: 'pointer', 
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Box size={16} /> {t.name}
                </div>
              ))}
            </div>
          </div>

          {/* Preloaded PNG images options */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.75rem', display: 'block', fontWeight: 700 }}>Preloaded Stickers</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {PRELOADED_DECALS.map((p, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    const newId = `decal-${Date.now()}`;
                    setDesign(prev => {
                      const count = prev.decals.length;
                      const offset = (count * 8) % 30;
                      const xCoord = Math.min(Math.max(50 + (count % 2 === 0 ? offset : -offset), 15), 85);
                      const yCoord = Math.min(Math.max(50 + (count % 2 === 0 ? -offset : offset), 15), 85);
                      return {
                        ...prev,
                        decals: [...prev.decals, { 
                          id: newId, 
                          url: p.url, 
                          position: { x: xCoord, y: yCoord }, 
                          scale: 1, 
                          rotation: 0 
                        }]
                      };
                    });
                    setSelectedDecalId(newId);
                  }}
                  style={{ 
                    aspectRatio: '1', 
                    borderRadius: '6px', 
                    border: '1px solid #eaeaea', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    background: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px',
                    transition: 'border-color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#e11d48'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#eaeaea'}
                  title={p.name}
                >
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.75rem', display: 'block', fontWeight: 700 }}>Upload Decals (Multiple)</label>
            <label style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', 
                padding: '1.2rem', border: '1px dashed #ddd', borderRadius: '8px', 
                cursor: 'pointer', background: '#f8f9fa', transition: 'all 0.2s',
                position: 'relative', marginBottom: '1rem'
              }}>
                {uploading ? (
                  <>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    <span style={{ color: '#666', fontSize: '0.85rem' }}>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} color="#888" />
                    <span style={{ color: '#666', fontSize: '0.85rem', fontWeight: 600 }}>Add Custom Image</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} style={{ display: 'none' }} />
            </label>

            {/* List of active decals */}
            {design.decals.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', color: '#666', fontWeight: 700 }}>Active Decals List</label>
                {design.decals.map((decal, index) => (
                  <div 
                    key={decal.id} 
                    onClick={() => setSelectedDecalId(decal.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.8rem', 
                      padding: '0.5rem', 
                      borderRadius: '8px', 
                      background: selectedDecalId === decal.id ? 'rgba(225, 29, 72, 0.04)' : '#f8f9fa',
                      border: `1px solid ${selectedDecalId === decal.id ? '#e11d48' : '#e2e8f0'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <img src={decal.url} alt="Decal Thumbnail" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, flex: 1, color: '#000' }}>Decal #{index + 1}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeDecal(decal.id); }}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTER CANVAS */}
      <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%)' }}>
        <CanvasModel 
          color={design.color} 
          decals={design.decals}
          roughness={design.roughness}
          metalness={design.metalness}
          selectedDecalId={selectedDecalId}
          onSelectDecal={setSelectedDecalId}
          onUpdateDecalPosition={(id, pos) => {
            setDesign(prev => ({
              ...prev,
              decals: prev.decals.map(d => d.id === id ? { ...d, position: pos } : d)
            }));
          }}
          isDraggingDecal={isDraggingDecal}
          setIsDraggingDecal={setIsDraggingDecal}
          gender={gender}
        />
        {/* Overlay drag hint */}
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(255,255,255,0.85)', border: '1px solid #eaeaea', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.75rem', color: '#444', zIndex: 5, pointerEvents: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          Click & drag the selected logo directly on the shirt! Drag empty space to rotate.
        </div>
      </div>

      {/* RIGHT PANEL - Properties & Checkout */}
      <div className="glass-panel custom-scrollbar" style={{ width: '320px', height: '100%', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderRight: 'none', borderLeft: '1px solid #eaeaea', display: 'flex', flexDirection: 'column', padding: '1.5rem', zIndex: 10, overflowY: 'auto', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
          <Sliders size={16} /> Options
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Gender Selector - Men / Women fit styles */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.8rem', display: 'block', fontWeight: 700 }}>Select Gender Fit</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['men', 'women'].map(fit => (
                <button
                  key={fit}
                  onClick={() => setGender(fit as 'men' | 'women')}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0',
                    borderRadius: '8px',
                    border: `1px solid ${gender === fit ? '#000000' : '#dddddd'}`,
                    background: gender === fit ? '#000000' : '#f8f9fa',
                    color: gender === fit ? '#ffffff' : '#000000',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s'
                  }}
                >
                  {fit === 'men' ? 'Men Fit' : 'Women Fit'}
                </button>
              ))}
            </div>
          </div>

          {/* Material Color with Custom Color Picker Wheel */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.8rem', display: 'block', fontWeight: 700 }}>Material Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {colors.map(c => (
                <div key={c.name} onClick={() => setDesign({ ...design, color: c.hex })}
                  style={{
                    height: '40px', borderRadius: '6px', backgroundColor: c.hex, cursor: 'pointer',
                    border: `2px solid ${design.color === c.hex ? '#e11d48' : '#eaeaea'}`,
                    boxShadow: design.color === c.hex ? '0 0 15px rgba(225, 29, 72, 0.2)' : 'none',
                    transition: 'all 0.2s'
                  }} title={c.name} />
              ))}
            </div>

            {/* Custom Color Wheel option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.8rem', borderTop: '1px solid #eaeaea', paddingTop: '0.8rem' }}>
              <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)', cursor: 'pointer', border: '1px solid #ddd', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input 
                  type="color" 
                  value={design.color} 
                  onChange={e => setDesign({ ...design, color: e.target.value })}
                  style={{ position: 'absolute', top: -5, left: -5, width: '48px', height: '48px', opacity: 0, cursor: 'pointer' }} 
                />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#000000', fontWeight: 700, display: 'block' }}>Color Wheel Picker</span>
                <span style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'monospace' }}>{design.color.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label style={{ fontSize: '0.9rem', color: '#000', marginBottom: '0.8rem', display: 'block', fontWeight: 700 }}>Select Size</label>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    flex: 1,
                    padding: '0.6rem 0',
                    borderRadius: '6px',
                    border: `1px solid ${selectedSize === size ? '#000' : '#ddd'}`,
                    background: selectedSize === size ? '#000' : '#f8f9fa',
                    color: selectedSize === size ? '#fff' : '#000',
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
                <label style={{ color: '#444', fontSize: '0.85rem', fontWeight: 700 }}>Roughness</label>
                <span style={{ color: '#000', fontSize: '0.8rem', fontWeight: 600 }}>{design.roughness}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={design.roughness} onChange={e => setDesign({ ...design, roughness: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#e11d48' }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <label style={{ color: '#444', fontSize: '0.85rem', fontWeight: 700 }}>Metalness</label>
                <span style={{ color: '#000', fontSize: '0.8rem', fontWeight: 600 }}>{design.metalness}</span>
              </div>
              <input type="range" min="0" max="1" step="0.05" value={design.metalness} onChange={e => setDesign({ ...design, metalness: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#e11d48' }} />
            </div>
          </div>

          {/* Decal Transform (Selective for active Decal) */}
          {selectedDecal ? (
            <div style={{ padding: '1.5rem 1rem', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eaeaea' }}>
              <label style={{ fontSize: '0.85rem', color: '#000', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                 <ImageIcon size={14} /> Transform Decal
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#555', fontSize: '0.75rem' }}>Position X (Sides)</label>
                    <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 600 }}>{selectedDecal.position.x}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={selectedDecal.position.x} onChange={e => updateSelectedDecal({ position: { ...selectedDecal.position, x: parseInt(e.target.value) } })}
                    style={{ width: '100%', accentColor: '#e11d48' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#555', fontSize: '0.75rem' }}>Position Y (Collar to hem)</label>
                    <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 600 }}>{selectedDecal.position.y}%</span>
                  </div>
                  <input type="range" min="0" max="100" value={selectedDecal.position.y} onChange={e => updateSelectedDecal({ position: { ...selectedDecal.position, y: parseInt(e.target.value) } })}
                    style={{ width: '100%', accentColor: '#e11d48' }} />
                </div>
                  
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#555', fontSize: '0.75rem' }}>Scale</label>
                    <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 600 }}>{selectedDecal.scale}x</span>
                  </div>
                  <input type="range" min="0.3" max="4" step="0.1" value={selectedDecal.scale} onChange={e => updateSelectedDecal({ scale: parseFloat(e.target.value) })}
                    style={{ width: '100%', accentColor: '#e11d48' }} />
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <label style={{ color: '#555', fontSize: '0.75rem' }}>Rotation</label>
                    <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: 600 }}>{selectedDecal.rotation}°</span>
                  </div>
                  <input type="range" min="-180" max="180" value={selectedDecal.rotation} onChange={e => updateSelectedDecal({ rotation: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#e11d48' }} />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.2rem 1rem', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
              <p style={{ color: '#666', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>Select or upload a decal image to edit its positions.</p>
            </div>
          )}

          {/* Pricing & Cart E-Commerce Panel (INR Currency converted) */}
          <div style={{ marginTop: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
                <span>Base Classic Tee</span>
                <span>₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              {decalPrice > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
                  <span>Custom Decals Print ({printDecalsCount})</span>
                  <span>+₹{decalPrice.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#000', borderTop: '1px solid #eaeaea', paddingTop: '0.8rem', marginTop: '0.2rem' }}>
                <span>Total Price</span>
                <span style={{ color: '#0f766e' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
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
                  background: added ? '#10b981' : '#f3f4f6',
                  color: added ? '#fff' : '#000',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontWeight: 800,
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
                  background: '#e11d48',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.15)'
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
    <Suspense fallback={<div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000', background: '#ffffff', height: '100%' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} /><p style={{ marginTop: '10px', color: '#666' }}>Loading Customizer...</p></div>}>
      <CustomizerContent />
    </Suspense>
  );
}
