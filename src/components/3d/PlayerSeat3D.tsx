import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import type { Player } from '@/types';

interface PlayerSeat3DProps {
  player: Player;
  position: [number, number, number];
  rotation: [number, number, number];
  isCurrentPlayer: boolean;
  isCurrentTurn: boolean;
  isDealer: boolean;
  delay?: number;
}

// Create avatar texture
function createAvatarTexture(name: string, isBot: boolean) {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  // Background gradient
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  if (isBot) {
    gradient.addColorStop(0, '#4a5568');
    gradient.addColorStop(1, '#2d3748');
  } else {
    gradient.addColorStop(0, '#3182ce');
    gradient.addColorStop(1, '#1a365d');
  }
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();
  
  // Border
  ctx.strokeStyle = isBot ? '#718096' : '#00ff88';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Initials
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  ctx.fillText(initials, 64, 64);
  
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function PlayerSeat3D({
  player,
  position,
  rotation,
  isCurrentPlayer,
  isCurrentTurn,
  isDealer,
  delay = 0
}: PlayerSeat3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const isBot = player.address.startsWith('0x0000') || player.name.toLowerCase().includes('bot');
  
  const avatarTexture = useMemo(() => createAvatarTexture(player.name, isBot), [player.name, isBot]);
  
  // Glow animation for current turn
  useFrame((state) => {
    if (groupRef.current && isCurrentTurn) {
      const glowIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      // Update emissive intensity would go here if using shader material
    }
  });
  
  const { scale } = useSpring({
    scale: isCurrentTurn ? 1.1 : 1,
    config: { tension: 300, friction: 20 },
  });
  
  return (
    <animated.group 
      ref={groupRef}
      position={position} 
      rotation={rotation}
      scale={scale}
    >
      {/* Player avatar circle */}
      <mesh position={[0, 0.5, 0]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial 
          map={avatarTexture}
          color="#ffffff"
          emissive={isCurrentTurn ? '#00ff88' : '#000000'}
          emissiveIntensity={isCurrentTurn ? 0.3 : 0}
        />
      </mesh>
      
      {/* Avatar backing/glow ring */}
      {isCurrentTurn && (
        <mesh position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.48, 32]} />
          <meshBasicMaterial 
            color="#00ff88"
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Dealer button */}
      {isDealer && (
        <group position={[0.5, 0.5, 0]}>
          <mesh>
            <cylinderGeometry args={[0.12, 0.12, 0.02, 32]} />
            <meshStandardMaterial color="#f1c40f" />
          </mesh>
          <Text
            position={[0, 0.02, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.15}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            D
          </Text>
        </group>
      )}
      
      {/* Player name */}
      <Text
        position={[0, 1.1, 0]}
        fontSize={0.2}
        color={isCurrentPlayer ? '#00ff88' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {player.name}
      </Text>
      
      {/* Chip count */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.15}
        color="#f1c40f"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
      >
        {player.chips.toLocaleString()}
      </Text>
      
      {/* Current bet indicator */}
      {player.currentBet > 0 && (
        <group position={[0, 0.2, -0.6]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
            <meshStandardMaterial color="#f1c40f" />
          </mesh>
          <Text
            position={[0, 0.03, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.12}
            color="#000000"
            anchorX="center"
            anchorY="middle"
          >
            {player.currentBet.toLocaleString()}
          </Text>
        </group>
      )}
      
      {/* Folded indicator */}
      {player.hasFolded && (
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.18}
          color="#e74c3c"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          FOLDED
        </Text>
      )}
    </animated.group>
  );
}

// Calculate position around an oval table
export function getPlayerPosition(
  index: number, 
  totalPlayers: number, 
  tableWidth: number = 6, 
  tableDepth: number = 4
): { position: [number, number, number]; rotation: [number, number, number] } {
  // Position players evenly around an oval
  const angleStep = (Math.PI * 2) / totalPlayers;
  const angle = index * angleStep - Math.PI / 2; // Start from bottom
  
  // Oval parametric equation
  const x = Math.cos(angle) * (tableWidth + 1.5);
  const z = Math.sin(angle) * (tableDepth + 1);
  
  // Calculate rotation to face center
  const rotY = -angle - Math.PI / 2;
  
  return {
    position: [x, 0, z],
    rotation: [0, rotY, 0]
  };
}
