'use client';

import dynamic from 'next/dynamic';

const CanvasModel = dynamic(() => import('@/components/CanvasModel'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0a', borderRadius: '16px', border: '1px solid #222' }}>
      <div style={{ color: '#555', fontSize: '0.9rem' }}>Initializing WebGL Studio...</div>
    </div>
  )
});

export default function HeroCanvasWrapper() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CanvasModel 
        color="#111111" 
        graphicUrl="/asessts/Zyroz_logo.jpeg" 
        position={{ x: 50, y: 50 }} 
        scale={1} 
        rotation={0}
        roughness={0.8}
        metalness={0.2}
        environment="studio"
      />
    </div>
  );
}
