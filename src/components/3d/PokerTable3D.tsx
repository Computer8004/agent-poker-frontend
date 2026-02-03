import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural felt texture generator
function createFeltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Base green
  ctx.fillStyle = '#0d4a28';
  ctx.fillRect(0, 0, 512, 512);
  
  // Add noise for felt texture
  for (let i = 0; i < 50000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const opacity = Math.random() * 0.1;
    ctx.fillStyle = Math.random() > 0.5 
      ? `rgba(0, 100, 40, ${opacity})` 
      : `rgba(20, 80, 30, ${opacity})`;
    ctx.fillRect(x, y, 2, 2);
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Procedural wood texture generator
function createWoodTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  
  // Base dark wood
  ctx.fillStyle = '#2a1810';
  ctx.fillRect(0, 0, 512, 512);
  
  // Wood grain
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * 512;
    const width = Math.random() * 3 + 1;
    ctx.strokeStyle = `rgba(60, 35, 20, ${Math.random() * 0.3 + 0.1})`;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(
      x + Math.random() * 20 - 10, 170,
      x + Math.random() * 20 - 10, 340,
      x + Math.random() * 40 - 20, 512
    );
    ctx.stroke();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function PokerTable3D() {
  const tableRef = useRef<THREE.Group>(null);
  
  const feltTexture = useMemo(() => createFeltTexture(), []);
  const woodTexture = useMemo(() => createWoodTexture(), []);
  
  useFrame((state) => {
    if (tableRef.current) {
      // Subtle breathing animation
      tableRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={tableRef}>
      {/* Table Top - Main playing surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ellipseGeometry args={[6, 4, 64]} />
        <meshStandardMaterial 
          map={feltTexture}
          color="#0d4a28"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Inner racetrack border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[4.8, 5.2, 64]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>
      
      {/* Wood trim - Outer edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ellipseGeometry args={[6.3, 4.3, 64]} />
        <meshStandardMaterial 
          map={woodTexture}
          color="#3d2314"
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      
      {/* Table edge thickness */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[6.3, 6.3, 0.2, 64, 1, false, 0, Math.PI * 2]} />
        <meshStandardMaterial 
          map={woodTexture}
          color="#2a1810"
          roughness={0.7}
        />
      </mesh>
      
      {/* Table legs */}
      {[-4, 4].map((x, i) => (
        <group key={i}>
          {/* Front legs */}
          <mesh position={[x, -1.5, 2.5]}>
            <cylinderGeometry args={[0.3, 0.2, 3, 16]} />
            <meshStandardMaterial 
              map={woodTexture}
              color="#2a1810"
              roughness={0.7}
            />
          </mesh>
          {/* Back legs */}
          <mesh position={[x, -1.5, -2.5]}>
            <cylinderGeometry args={[0.3, 0.2, 3, 16]} />
            <meshStandardMaterial 
              map={woodTexture}
              color="#2a1810"
              roughness={0.7}
            />
          </mesh>
        </group>
      ))}
      
      {/* Chip tray area */}
      <mesh position={[0, 0.02, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <boxGeometry args={[3, 0.8, 0.05]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
      
      {/* Chip tray dividers */}
      {[-1, -0.33, 0.33, 1].map((x, i) => (
        <mesh key={i} position={[x, 0.03, -3.2]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.02, 0.8, 0.08]} />
          <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      ))}
      
      {/* Decorative neon strip under table edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]}>
        <ellipseGeometry args={[6.35, 4.35, 64]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}
