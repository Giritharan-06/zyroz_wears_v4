'use client';

import { Canvas } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import { Suspense, useEffect } from 'react';
import ShirtModel from './ShirtModel';

interface DecalItem {
  id: string;
  url: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface CanvasModelProps {
  color: string;
  decals: DecalItem[];
  roughness: number;
  metalness: number;
  selectedDecalId: string | null;
  onSelectDecal: (id: string) => void;
  onUpdateDecalPosition: (id: string, position: { x: number; y: number }) => void;
  isDraggingDecal: boolean;
  setIsDraggingDecal: (dragging: boolean) => void;
  gender?: 'men' | 'women';
}

export default function CanvasModel({ 
  color, 
  decals, 
  roughness, 
  metalness, 
  selectedDecalId, 
  onSelectDecal,
  onUpdateDecalPosition, 
  isDraggingDecal, 
  setIsDraggingDecal,
  gender = 'men'
}: CanvasModelProps) {
  
  // Listen to global pointerup to safely release decal dragging even if mouse leaves canvas
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDraggingDecal) {
        setIsDraggingDecal(false);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDraggingDecal, setIsDraggingDecal]);

  return (
    <div style={{ width: '100%', height: '100%', cursor: isDraggingDecal ? 'move' : 'grab' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* Premium Studio 3-Point Local Lighting Setup */}
        <ambientLight intensity={0.6} />
        
        {/* Key Light */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        {/* Fill Light */}
        <directionalLight 
          position={[-5, 5, 2]} 
          intensity={0.8} 
        />
        
        {/* Back Light */}
        <pointLight 
          position={[0, 10, -5]} 
          intensity={1.2} 
        />

        <Suspense fallback={null}>
          <Center>
            <ShirtModel 
              color={color}
              decals={decals}
              roughness={roughness}
              metalness={metalness}
              selectedDecalId={selectedDecalId}
              onSelectDecal={onSelectDecal}
              onUpdateDecalPosition={onUpdateDecalPosition}
              isDraggingDecal={isDraggingDecal}
              setIsDraggingDecal={setIsDraggingDecal}
              gender={gender}
            />
          </Center>
        </Suspense>

        {/* Orbit Controls (Disabled during decal drag to prevent rotation conflict) */}
        <OrbitControls 
          enableZoom={!isDraggingDecal} 
          enableRotate={!isDraggingDecal} 
          minDistance={1.2} 
          maxDistance={4.0} 
          enablePan={false} 
        />
      </Canvas>
    </div>
  );
}
