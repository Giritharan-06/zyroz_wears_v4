'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

interface DecalItem {
  id: string;
  url: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

interface ShirtModelProps {
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

function IndividualDecal({ 
  decal, 
  onSelect, 
  setIsDraggingDecal 
}: { 
  decal: DecalItem; 
  onSelect: () => void;
  setIsDraggingDecal: (dragging: boolean) => void;
}) {
  const decalTexture = useTexture(decal.url);
  if (decalTexture) {
    decalTexture.anisotropy = 16;
  }
  const DecalComponent = Decal as any;
  
  return (
    <DecalComponent 
      position={[
         (decal.position.x - 50) * 0.003, // mapping 0-100% to approximate 3D world space coordinates
         -(decal.position.y - 50) * 0.008, 
         0.15 // z position slightly forward
      ]}
      rotation={[0, 0, decal.rotation * Math.PI / 180]}
      scale={[0.15 * decal.scale, 0.15 * decal.scale, 0.5]}
      map={decalTexture}
      depthTest={false}
      depthWrite={true}
      onPointerDown={(e: any) => {
        e.stopPropagation();
        onSelect();
        setIsDraggingDecal(true);
      }}
    />
  );
}

export default function ShirtModel({ 
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
}: ShirtModelProps) {
  const { nodes, materials } = useGLTF('/shirt_baked.glb') as any;
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    // Smoothly interpolate color
    if (materials.lambert1) {
       easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  const handlePointerMove = (e: any) => {
    if (isDraggingDecal && selectedDecalId && e.uv) {
      e.stopPropagation();
      const newX = Math.round(e.uv.x * 100);
      const newY = Math.round((1 - e.uv.y) * 100);
      onUpdateDecalPosition(selectedDecalId, { x: newX, y: newY });
    }
  };

  const modelScale: [number, number, number] = gender === 'women' ? [0.88, 0.92, 0.8] : [1, 1, 1];
  const modelPosition: [number, number, number] = gender === 'women' ? [0, 0.05, 0] : [0, 0, 0];

  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        scale={modelScale}
        position={modelPosition}
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={roughness}
        material-metalness={metalness}
        dispose={null}
        onPointerMove={handlePointerMove}
      >
        {decals.map((decal) => (
          <IndividualDecal 
            key={decal.id} 
            decal={decal} 
            onSelect={() => onSelectDecal(decal.id)}
            setIsDraggingDecal={setIsDraggingDecal}
          />
        ))}
      </mesh>
    </group>
  );
}

useGLTF.preload('/shirt_baked.glb');
