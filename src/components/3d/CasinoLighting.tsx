import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CasinoLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const neonRef = useRef<THREE.PointLight>(null);
  
  // Subtle pulsing for neon effect
  useFrame((state) => {
    if (neonRef.current) {
      const pulse = 0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      neonRef.current.intensity = pulse;
    }
  });

  return (
    <>
      {/* Ambient light - soft base illumination */}
      <ambientLight 
        ref={ambientRef}
        intensity={0.3} 
        color="#1a1a2e"
      />
      
      {/* Main overhead spotlight - like casino ceiling lights */}
      <spotLight
        ref={spotLightRef}
        position={[0, 12, 0]}
        target-position={[0, 0, 0]}
        intensity={1.5}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2}
        distance={30}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      
      {/* Warm fill light from front */}
      <pointLight
        position={[0, 5, 8]}
        intensity={0.4}
        color="#ffd4a3"
        distance={20}
        decay={2}
      />
      
      {/* Cool rim light from back */}
      <pointLight
        position={[0, 4, -8]}
        intensity={0.3}
        color="#4a90d9"
        distance={20}
        decay={2}
      />
      
      {/* Side accent lights */}
      <pointLight
        position={[-8, 3, 0]}
        intensity={0.25}
        color="#9b59b6"
        distance={15}
        decay={2}
      />
      
      <pointLight
        position={[8, 3, 0]}
        intensity={0.25}
        color="#9b59b6"
        distance={15}
        decay={2}
      />
      
      {/* Neon accent light under table */}
      <pointLight
        ref={neonRef}
        position={[0, -2, 0]}
        intensity={0.8}
        color="#00ff88"
        distance={10}
        decay={2}
      />
      
      {/* Table surface spotlight for dramatic effect */}
      <spotLight
        position={[0, 8, 4]}
        target-position={[0, 0, 0]}
        intensity={0.8}
        angle={Math.PI / 4}
        penumbra={0.7}
        color="#ffffff"
        distance={20}
        decay={2}
      />
      
      {/* Directional light for shadows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

// Environment fog for atmosphere
export function CasinoEnvironment() {
  return (
    <>
      {/* Fog for depth */}
      <fog 
        attach="fog" 
        args={['#0a0a15', 10, 30]} 
      />
      
      {/* Dark background */}
      <color attach="background" args={['#0a0a15']} />
      
      {/* Floor plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0d0d1a"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </>
  );
}
