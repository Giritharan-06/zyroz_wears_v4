'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Center, PresentationControls } from '@react-three/drei';
import ShirtModel from './ShirtModel';

interface CanvasModelProps {
  color: string;
  graphicUrl: string | null;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
  roughness: number;
  metalness: number;
  environment: any;
}

export default function CanvasModel({ color, graphicUrl, position, scale, rotation, roughness, metalness, environment }: CanvasModelProps) {
  const Controls = PresentationControls as any;
  
  return (
    <div style={{ width: '100%', height: '100%', cursor: 'grab' }}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 2.5], fov: 25 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.5} />
        <Environment preset={environment} />

        <Controls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 150 }}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <Center>
            <ShirtModel 
              color={color}
              graphicUrl={graphicUrl}
              position={position}
              scale={scale}
              rotation={rotation}
              roughness={roughness}
              metalness={metalness}
            />
          </Center>
        </Controls>
      </Canvas>
    </div>
  );
}
