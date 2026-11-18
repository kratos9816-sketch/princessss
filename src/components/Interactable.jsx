import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

export default function Interactable({
  children,
  position = [0, 0, 0],
  promptText = 'Inspect',
  onInteract,
  interactionDistance = 2.8,
  glowColor = '#c6a15b',
  showBeacon = true,
}) {
  const groupRef = useRef();
  const auraRef = useRef();
  const { camera } = useThree();

  const setInteractionPrompt = useGameStore((s) => s.setInteractionPrompt);
  const clearInteractionPrompt = useGameStore((s) => s.clearInteractionPrompt);
  const activePrompt = useGameStore((s) => s.interactionPrompt);

  const [isNear, setIsNear] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    const dist = camera.position.distanceTo(worldPos);

    if (dist < interactionDistance) {
      if (!isNear) {
        setIsNear(true);
      }
      if (!activePrompt || activePrompt.text !== promptText) {
        setInteractionPrompt({
          text: promptText,
          action: () => {
            if (onInteract) onInteract();
          },
        });
      }
    } else {
      if (isNear) {
        setIsNear(false);
      }
      if (activePrompt && activePrompt.text === promptText) {
        clearInteractionPrompt();
      }
    }

    // Gentle floating pulsing aura animation
    if (auraRef.current) {
      const t = state.clock.getElapsedTime();
      auraRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      auraRef.current.material.opacity = 0.25 + Math.sin(t * 3) * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (isNear && onInteract) onInteract();
      }}
    >
      {children}

      {/* Romantic Golden Proximity Beacon / Aura */}
      {showBeacon && isNear && (
        <mesh ref={auraRef} position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial
            color={glowColor}
            transparent
            opacity={0.3}
            wireframe
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}
