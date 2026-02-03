import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

interface Chip3DProps {
  value: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  isStacked?: boolean;
  delay?: number;
}

const CHIP_COLORS: Record<number, { color: string; stripe: string }> = {
  1: { color: '#ffffff', stripe: '#3498db' },
  5: { color: '#e74c3c', stripe: '#ffffff' },
  10: { color: '#3498db', stripe: '#ffffff' },
  25: { color: '#2ecc71', stripe: '#f1c40f' },
  50: { color: '#9b59b6', stripe: '#ffffff' },
  100: { color: '#1a1a1a', stripe: '#f1c40f' },
  500: { color: '#e67e22', stripe: '#ffffff' },
  1000: { color: '#f1c40f', stripe: '#e74c3c' },
  5000: { color: '#e91e63', stripe: '#ffffff' },
  10000: { color: '#00bcd4', stripe: '#ffffff' },
};

// Create chip texture
function createChipTexture(value: number) {
  const colors = CHIP_COLORS[value] || { color: '#95a5a6', stripe: '#ffffff' };
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  const centerX = 128;
  const centerY = 128;
  const radius = 120;
  
  // Main chip body
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = colors.color;
  ctx.fill();
  
  // Outer stripe ring
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 10, 0, Math.PI * 2);
  ctx.strokeStyle = colors.stripe;
  ctx.lineWidth = 15;
  ctx.stroke();
  
  // Inner circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius - 35, 0, Math.PI * 2);
  ctx.fillStyle = colors.color;
  ctx.fill();
  ctx.strokeStyle = colors.stripe;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Value text
  ctx.fillStyle = colors.stripe;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toString(), centerX, centerY);
  
  // Edge details (rectangles around edge)
  const numRects = 8;
  for (let i = 0; i < numRects; i++) {
    const angle = (i / numRects) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * (radius - 5);
    const y = centerY + Math.sin(angle) * (radius - 5);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = colors.stripe;
    ctx.fillRect(-8, -4, 16, 8);
    ctx.restore();
  }
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function Chip3D({ 
  value, 
  position = [0, 0, 0], 
  rotation = [Math.PI / 2, 0, 0],
  scale = 1,
  delay = 0
}: Chip3DProps) {
  const texture = useMemo(() => createChipTexture(value), [value]);
  
  const { posY } = useSpring({
    posY: position[1],
    from: { posY: position[1] + 3 },
    config: { tension: 200, friction: 20 },
    delay: delay * 1000,
  });
  
  return (
    <animated.mesh position={[position[0], posY, position[2]]} rotation={rotation} scale={scale}>
      <cylinderGeometry args={[0.25, 0.25, 0.04, 32]} />
      <meshStandardMaterial 
        map={texture}
        color="#ffffff"
        roughness={0.3}
        metalness={0.1}
      />
    </animated.mesh>
  );
}

// Chip stack
interface ChipStackProps {
  values: number[];
  position?: [number, number, number];
  delay?: number;
}

export function ChipStack({ values, position = [0, 0, 0], delay = 0 }: ChipStackProps) {
  return (
    <group position={position}>
      {values.map((value, i) => (
        <Chip3D
          key={i}
          value={value}
          position={[0, i * 0.04, 0]}
          rotation={[Math.PI / 2, 0, Math.random() * 0.1]}
          delay={delay + i * 0.05}
        />
      ))}
    </group>
  );
}

// Pot display with multiple stacks
interface Pot3DProps {
  total: number;
  position?: [number, number, number];
}

export function Pot3D({ total, position = [0, 0, 0] }: Pot3DProps) {
  // Break down total into chip denominations
  const getChipStack = (amount: number): number[] => {
    const denominations = [1000, 500, 100, 50, 25, 10, 5, 1];
    const chips: number[] = [];
    let remaining = amount;
    
    for (const denom of denominations) {
      while (remaining >= denom && chips.length < 20) {
        chips.push(denom);
        remaining -= denom;
      }
    }
    
    return chips;
  };
  
  const chips = getChipStack(total);
  const numStacks = Math.ceil(chips.length / 10);
  
  return (
    <group position={position}>
      {Array.from({ length: numStacks }).map((_, stackIndex) => {
        const stackChips = chips.slice(stackIndex * 10, (stackIndex + 1) * 10);
        const angle = (stackIndex / numStacks) * Math.PI * 2;
        const radius = 0.8;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <ChipStack
            key={stackIndex}
            values={stackChips}
            position={[x, 0, z]}
            delay={stackIndex * 0.1}
          />
        );
      })}
    </group>
  );
}
