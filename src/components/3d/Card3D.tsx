import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

interface Card3DProps {
  rank: string;
  suit: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  isFlipped?: boolean;
  onFlipComplete?: () => void;
  delay?: number;
}

const SUIT_COLORS: Record<string, string> = {
  hearts: '#e74c3c',
  diamonds: '#e74c3c',
  clubs: '#2c3e50',
  spades: '#2c3e50',
};

const SUIT_SYMBOLS: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

// Create card face texture
function createCardTexture(rank: string, suit: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 356;
  const ctx = canvas.getContext('2d')!;
  
  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 356);
  
  // Subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, 256, 356);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#f0f0f0');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 356);
  
  // Border
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, 4, 248, 348);
  
  const color = SUIT_COLORS[suit];
  ctx.fillStyle = color;
  
  // Top left rank and suit
  ctx.font = 'bold 32px Arial';
  ctx.fillText(rank, 15, 40);
  ctx.font = '28px Arial';
  ctx.fillText(SUIT_SYMBOLS[suit], 15, 70);
  
  // Bottom right (inverted)
  ctx.save();
  ctx.translate(241, 316);
  ctx.rotate(Math.PI);
  ctx.font = 'bold 32px Arial';
  ctx.fillText(rank, 0, 0);
  ctx.font = '28px Arial';
  ctx.fillText(SUIT_SYMBOLS[suit], 0, 30);
  ctx.restore();
  
  // Center suit
  ctx.font = '120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(SUIT_SYMBOLS[suit], 128, 178);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Create card back texture
function createCardBackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 356;
  const ctx = canvas.getContext('2d')!;
  
  // Dark blue gradient background
  const gradient = ctx.createLinearGradient(0, 0, 256, 356);
  gradient.addColorStop(0, '#1e3a5f');
  gradient.addColorStop(1, '#0d1f33');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 356);
  
  // Pattern
  ctx.strokeStyle = '#2d5a87';
  ctx.lineWidth = 2;
  for (let i = 0; i < 256; i += 20) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 356);
    ctx.stroke();
  }
  for (let i = 0; i < 356; i += 20) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(256, i);
    ctx.stroke();
  }
  
  // Border
  ctx.strokeStyle = '#4a7fb5';
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, 236, 336);
  
  // Center pattern
  ctx.fillStyle = '#2d5a87';
  ctx.beginPath();
  ctx.arc(128, 178, 40, 0, Math.PI * 2);
  ctx.fill();
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function Card3D({ 
  rank, 
  suit, 
  position = [0, 0, 0], 
  rotation = [0, 0, 0],
  isFlipped = false,
  onFlipComplete,
  delay = 0
}: Card3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const frontTexture = useMemo(() => createCardTexture(rank, suit), [rank, suit]);
  const backTexture = useMemo(() => createCardBackTexture(), []);
  
  // Card dimensions (standard poker card ratio)
  const width = 0.8;
  const height = 1.12;
  const depth = 0.02;
  
  // Spring animation for flip
  const { rotationY } = useSpring({
    rotationY: isFlipped ? Math.PI : 0,
    config: { tension: 200, friction: 20 },
    delay: delay * 1000,
    onRest: () => {
      if (isFlipped && !hasAnimated) {
        setHasAnimated(true);
        onFlipComplete?.();
      }
    }
  });
  
  // Deal animation
  const { posY } = useSpring({
    posY: position[1],
    from: { posY: position[1] + 5 },
    config: { tension: 100, friction: 15 },
    delay: delay * 1000,
  });
  
  return (
    <animated.mesh
      ref={meshRef}
      position={[position[0], posY, position[2]]}
      rotation={rotation}
    >
      <boxGeometry args={[width, height, depth]} />
      <animated.meshStandardMaterial
        attach="material-0"
        map={backTexture}
        transparent
      />
      <animated.meshStandardMaterial
        attach="material-1"
        map={backTexture}
        transparent
      />
      <animated.meshStandardMaterial
        attach="material-2"
        map={frontTexture}
        transparent
        rotation-y={rotationY}
      />
      <animated.meshStandardMaterial
        attach="material-3"
        map={backTexture}
        transparent
        rotation-y={rotationY}
      />
      <animated.meshStandardMaterial
        attach="material-4"
        map={backTexture}
        transparent
      />
      <animated.meshStandardMaterial
        attach="material-5"
        map={backTexture}
        transparent
      />
    </animated.mesh>
  );
}

// Card deck stack
export function CardDeck({ position = [0, 0, 0], count = 52 }: { position?: [number, number, number], count?: number }) {
  return (
    <group position={position}>
      {Array.from({ length: Math.min(count, 10) }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.003, 0]} rotation={[0, i * 0.02, 0]}>
          <boxGeometry args={[0.8, 1.12, 0.02]} />
          <meshStandardMaterial 
            map={createCardBackTexture()}
            color="#ffffff"
          />
        </mesh>
      ))}
    </group>
  );
}
