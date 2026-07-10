'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';

interface ShirtModelProps {
  color: string;
  graphicUrl: string | null;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  roughness: number;
  metalness: number;
}

export default function ShirtModel({ color, graphicUrl, position, scale, rotation, roughness, metalness }: ShirtModelProps) {
  const { nodes, materials } = useGLTF('/shirt_baked.glb') as any;
  const group = useRef<THREE.Group>(null);
  const DecalComponent = Decal as any;
  
  // Load texture if url is provided
  const decalTexture = useTexture(graphicUrl || '/next.svg'); // Fallback if no URL, though we only render Decal if graphicUrl exists
  if (decalTexture) {
    decalTexture.anisotropy = 16;
  }

  useFrame((state, delta) => {
    // Smoothly interpolate color
    if (materials.lambert1) {
       easing.dampC(materials.lambert1.color, color, 0.25, delta);
    }
  });

  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={roughness}
        material-metalness={metalness}
        dispose={null}
      >
        {graphicUrl && decalTexture && (
          <DecalComponent 
            position={[
               (position.x - 50) * 0.003, // mapping 0-100% to approximate 3D world space coordinates
               -(position.y - 50) * 0.008, 
               0.15 // z position slightly forward
            ]}
            rotation={[0, 0, rotation * Math.PI / 180]}
            scale={0.15 * scale}
            map={decalTexture}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
}

useGLTF.preload('/shirt_baked.glb');
