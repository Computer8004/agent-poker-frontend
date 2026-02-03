import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  transitionDuration?: number;
  viewMode?: 'overview' | 'player' | 'action';
}

const VIEW_CONFIGS = {
  overview: {
    position: [0, 8, 8] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
  },
  player: {
    position: [0, 3, 6] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
  },
  action: {
    position: [0, 4, 5] as [number, number, number],
    lookAt: [0, 0, 0] as [number, number, number],
  },
};

export function CameraController({
  targetPosition,
  targetLookAt,
  transitionDuration = 1.5,
  viewMode = 'overview',
}: CameraControllerProps) {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3(...camera.position));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const isTransitioning = useRef(false);
  const transitionStartTime = useRef(0);
  const startPosition = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());

  // Update target based on view mode or explicit targets
  useEffect(() => {
    const config = VIEW_CONFIGS[viewMode];
    targetPos.current.set(
      targetPosition?.[0] ?? config.position[0],
      targetPosition?.[1] ?? config.position[1],
      targetPosition?.[2] ?? config.position[2]
    );
    targetLook.current.set(
      targetLookAt?.[0] ?? config.lookAt[0],
      targetLookAt?.[1] ?? config.lookAt[1],
      targetLookAt?.[2] ?? config.lookAt[2]
    );

    // Start transition
    startPosition.current.copy(camera.position);
    startLookAt.current.copy(currentLookAt.current);
    isTransitioning.current = true;
    transitionStartTime.current = performance.now();
  }, [viewMode, targetPosition, targetLookAt, camera]);

  useFrame(() => {
    if (!isTransitioning.current) {
      // Subtle idle animation
      const time = performance.now() * 0.0005;
      camera.position.y += Math.sin(time) * 0.002;
      return;
    }

    const elapsed = (performance.now() - transitionStartTime.current) / 1000;
    const progress = Math.min(elapsed / transitionDuration, 1);
    
    // Smooth easing function
    const easeInOutCubic = (t: number) => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    
    const easedProgress = easeInOutCubic(progress);

    // Interpolate position
    currentPosition.current.lerpVectors(
      startPosition.current,
      targetPos.current,
      easedProgress
    );

    // Interpolate lookAt
    currentLookAt.current.lerpVectors(
      startLookAt.current,
      targetLook.current,
      easedProgress
    );

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);

    if (progress >= 1) {
      isTransitioning.current = false;
    }
  });

  return null;
}

// Interactive camera controls for user
export function useCameraControls() {
  const [viewMode, setViewMode] = useState<'overview' | 'player' | 'action'>('overview');
  const [customTarget, setCustomTarget] = useState<{
    position?: [number, number, number];
    lookAt?: [number, number, number];
  }>({});

  const switchView = (mode: 'overview' | 'player' | 'action') => {
    setViewMode(mode);
    setCustomTarget({});
  };

  const focusOnPosition = (position: [number, number, number], lookAt?: [number, number, number]) => {
    setCustomTarget({
      position: [position[0], position[1] + 3, position[2] + 4],
      lookAt: lookAt || position,
    });
  };

  return {
    viewMode,
    customTarget,
    switchView,
    focusOnPosition,
  };
}
