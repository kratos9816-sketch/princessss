import React, { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import { createWoodPlankTexture } from '../utils/textureGenerator';

export default function Door({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  targetRoom,
  label = 'Enter Chamber',
  signText = 'Chamber',
  glowColor = '#c6a15b',
}) {
  const { camera } = useThree();
  const startTransition = useGameStore((s) => s.startTransition);
  const setInteractionPrompt = useGameStore((s) => s.setInteractionPrompt);
  const clearInteractionPrompt = useGameStore((s) => s.clearInteractionPrompt);
  const activePrompt = useGameStore((s) => s.interactionPrompt);

  const [isOpen, setIsOpen] = useState(false);
  const leftDoorRef = useRef();
  const rightDoorRef = useRef();
  const doorGroup = useRef();

  const woodTexture = useMemo(() => createWoodPlankTexture(), []);

  const openDoor = () => {
    if (isOpen) return;
    setIsOpen(true);
    soundManager.playDoorOpen();
    clearInteractionPrompt();

    setTimeout(() => {
      startTransition(targetRoom, `Entering ${label}...`);
    }, 450);
  };

  useFrame((_, delta) => {
    // Proximity check to player camera
    if (!doorGroup.current) return;
    const doorWorldPos = new THREE.Vector3();
    doorGroup.current.getWorldPosition(doorWorldPos);

    const dist = camera.position.distanceTo(doorWorldPos);

    if (dist < 3.2 && !isOpen) {
      if (!activePrompt || activePrompt.text !== `Enter ${label}`) {
        setInteractionPrompt({
          text: `Enter ${label}`,
          action: openDoor,
        });
      }
    } else if (dist >= 3.2 && activePrompt && activePrompt.text === `Enter ${label}`) {
      clearInteractionPrompt();
    }

    // Door swing animation
    if (leftDoorRef.current && rightDoorRef.current) {
      const targetAngle = isOpen ? Math.PI / 2.2 : 0;
      leftDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        leftDoorRef.current.rotation.y,
        -targetAngle,
        delta * 6
      );
      rightDoorRef.current.rotation.y = THREE.MathUtils.lerp(
        rightDoorRef.current.rotation.y,
        targetAngle,
        delta * 6
      );
    }
  });

  return (
    <group ref={doorGroup} position={position} rotation={rotation}>
      {/* Gothic Arch Stone Doorway Frame */}
      <mesh position={[-1.6, 2.2, 0]}>
        <boxGeometry args={[0.35, 4.4, 0.45]} />
        <meshStandardMaterial color="#1a1820" roughness={0.8} />
      </mesh>
      <mesh position={[1.6, 2.2, 0]}>
        <boxGeometry args={[0.35, 4.4, 0.45]} />
        <meshStandardMaterial color="#1a1820" roughness={0.8} />
      </mesh>
      {/* Arch Top Lintels */}
      <mesh position={[0, 4.4, 0]}>
        <boxGeometry args={[3.55, 0.4, 0.48]} />
        <meshStandardMaterial color="#1a1820" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.8, 0]}>
        <coneGeometry args={[1.78, 0.6, 4]} />
        <meshStandardMaterial color="#221e28" roughness={0.8} />
      </mesh>

      {/* Ornate Gold Trim on Arch */}
      <mesh position={[0, 4.25, 0.2]}>
        <boxGeometry args={[3.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Door Plaque / Header Sign */}
      <group position={[0, 3.8, 0.25]}>
        <mesh>
          <boxGeometry args={[2.5, 0.42, 0.06]} />
          <meshStandardMaterial color="#11050a" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[2.42, 0.36, 0.04]} />
          <meshStandardMaterial
            color="#260a14"
            emissive={glowColor}
            emissiveIntensity={0.25}
            roughness={0.5}
          />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.16}
          color="#dfbe7a"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.14}
        >
          {signText.toUpperCase()}
        </Text>
      </group>

      {/* Left Door Leaf (pivots on left hinge) */}
      <group position={[-1.4, 0, 0]}>
        <group ref={leftDoorRef} position={[0, 0, 0]}>
          <mesh position={[0.7, 2, 0]} castShadow>
            <boxGeometry args={[1.38, 4, 0.12]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#3a2216"
              roughness={0.65}
              metalness={0.2}
            />
          </mesh>
          {/* Iron decorative bands & studs */}
          <mesh position={[0.7, 3.2, 0.07]}>
            <boxGeometry args={[1.34, 0.08, 0.03]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0.7, 0.8, 0.07]}>
            <boxGeometry args={[1.34, 0.08, 0.03]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Golden Handle Ring */}
          <mesh position={[1.2, 1.9, 0.1]}>
            <torusGeometry args={[0.07, 0.02, 8, 16]} />
            <meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Right Door Leaf (pivots on right hinge) */}
      <group position={[1.4, 0, 0]}>
        <group ref={rightDoorRef} position={[0, 0, 0]}>
          <mesh position={[-0.7, 2, 0]} castShadow>
            <boxGeometry args={[1.38, 4, 0.12]} />
            <meshStandardMaterial
              map={woodTexture}
              color="#3a2216"
              roughness={0.65}
              metalness={0.2}
            />
          </mesh>
          {/* Iron decorative bands */}
          <mesh position={[-0.7, 3.2, 0.07]}>
            <boxGeometry args={[1.34, 0.08, 0.03]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[-0.7, 0.8, 0.07]}>
            <boxGeometry args={[1.34, 0.08, 0.03]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Golden Handle Ring */}
          <mesh position={[-1.2, 1.9, 0.1]}>
            <torusGeometry args={[0.07, 0.02, 8, 16]} />
            <meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Warm Sconce Lanterns flanking the door */}
      <LanternSconce position={[-1.9, 2.6, 0.3]} />
      <LanternSconce position={[1.9, 2.6, 0.3]} />
    </group>
  );
}

function LanternSconce({ position }) {
  return (
    <group position={position}>
      {/* Iron mount bracket */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[0.06, 0.3, 0.3]} />
        <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Lantern housing */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.07, 0.28, 6]} />
        <meshStandardMaterial color="#222" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* Glowing candle core */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 8]} />
        <meshBasicMaterial color="#ffc168" />
      </mesh>
      {/* Warm point light */}
      <pointLight color="#ffab40" intensity={0.9} distance={6} decay={2} />
    </group>
  );
}
