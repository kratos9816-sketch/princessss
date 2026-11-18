import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { secretsData } from '../data/messages';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import { createBlackMarbleTexture } from '../utils/textureGenerator';

export default function ForeverChamber() {
  const chamberDef = roomDefinitions[ROOMS.FOREVER_CHAMBER];
  const openForeverLetter = useGameStore((s) => s.openForeverLetter);
  const openSecretModal = useGameStore((s) => s.openSecretModal);
  const foreverCinematicTriggered = useGameStore((s) => s.foreverCinematicTriggered);

  const marbleTexture = useMemo(() => createBlackMarbleTexture(), []);

  // Celestial golden stardust particles
  const starParticleCount = 220;
  const starsRef = useRef();
  const starData = useMemo(() => {
    const pos = new Float32Array(starParticleCount * 3);
    const speed = new Float32Array(starParticleCount);
    for (let i = 0; i < starParticleCount; i++) {
      const radius = Math.random() * 11;
      const angle = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.random() * 8 + 0.2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      speed[i] = Math.random() * 0.4 + 0.2;
    }
    return { pos, speed };
  }, []);

  useFrame((state, delta) => {
    // Celestial stardust drifting upward
    if (starsRef.current) {
      const positions = starsRef.current.geometry.attributes.position.array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < starParticleCount; i++) {
        positions[i * 3 + 1] += delta * starData.speed[i];
        positions[i * 3] += Math.sin(t * 0.5 + i) * 0.005;
        positions[i * 3 + 2] += Math.cos(t * 0.5 + i) * 0.005;

        if (positions[i * 3 + 1] > 9.5) {
          positions[i * 3 + 1] = 0.2;
        }
      }
      starsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Emotional climax auto-intro
  useEffect(() => {
    if (!foreverCinematicTriggered) {
      const timer = setTimeout(() => {
        soundManager.playSecretDiscovery();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [foreverCinematicTriggered]);

  return (
    <group>
      {/* Mystical Celestial Lighting */}
      <ambientLight color="#251640" intensity={0.8} />
      <directionalLight position={[0, 18, -10]} intensity={1.1} color="#e0d4ff" />

      {/* Infinite Starfield Sphere (Cosmic Night Sky Backdrop) */}
      <mesh>
        <sphereGeometry args={[70, 32, 32]} />
        <meshBasicMaterial color="#07040e" side={THREE.BackSide} />
      </mesh>

      {/* Luminous Giant Silver Moon just outside the observatory windows */}
      <group position={[0, 18, -38]}>
        <mesh>
          <sphereGeometry args={[9, 32, 32]} />
          <meshBasicMaterial color="#f7f3e9" />
        </mesh>
        {/* Soft Moon Halo */}
        <pointLight color="#eae0ff" intensity={2.2} distance={80} decay={1.5} />
      </group>

      {/* Circular Tower Floor - Polished Onyx / Black Marble */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[12, 48]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughness={0.12}
          metalness={0.4}
          color="#0f0c18"
        />
      </mesh>

      {/* Concentric Gold Inlay Rings */}
      <group position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[11.5, 11.8, 64]} />
          <meshStandardMaterial color="#c6a15b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh>
          <ringGeometry args={[4.8, 5.1, 64]} />
          <meshStandardMaterial color="#dfbe7a" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* OBSERVATORY WALLS: TALL GOTHIC ARCHED GLASS WINDOWS OVERLOOKING THE COSMOS */}
      {Array.from({ length: 16 }).map((_, i) => {
        // Skip door exit angle at z > 10
        const angle = (i * Math.PI * 2) / 16;
        const wx = Math.cos(angle) * 11.8;
        const wz = Math.sin(angle) * 11.8;
        if (wz > 9.5) return null; // Leave doorway opening

        return (
          <group key={i} position={[wx, 0, wz]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* Gothic Window Stone Mullion Pillar */}
            <mesh position={[0, 4.5, 0]} castShadow>
              <boxGeometry args={[0.45, 9, 0.5]} />
              <meshStandardMaterial color="#1a1424" roughness={0.7} />
            </mesh>
            {/* Translucent Cosmic Glass Window Pane */}
            <mesh position={[1.15, 4.5, 0]}>
              <boxGeometry args={[1.9, 8.4, 0.04]} />
              <meshPhysicalMaterial
                color="#8899cc"
                transmission={0.88}
                opacity={0.35}
                transparent
                roughness={0.05}
                ior={1.45}
              />
            </mesh>
          </group>
        );
      })}

      {/* Observatory High Domed Glass & Ribbed Steel Ceiling */}
      <mesh position={[0, 9.5, 0]}>
        <cylinderGeometry args={[12, 12, 0.6, 32]} />
        <meshStandardMaterial color="#181122" roughness={0.7} />
      </mesh>
      <mesh position={[0, 11.8, 0]}>
        <coneGeometry args={[12.2, 4.5, 16]} />
        <meshStandardMaterial color="#0c0714" roughness={0.6} />
      </mesh>

      {/* THE SACRED FOREVER ALTAR & DISPLAY (CENTERPIECE) */}
      <group position={[0, 0, 0]}>
        {/* Tiered Marble Altar Base */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[2.0, 2.3, 0.4, 32]} />
          <meshStandardMaterial color="#191326" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 0.4, 32]} />
          <meshStandardMaterial color="#191326" roughness={0.3} metalness={0.3} />
        </mesh>
        {/* Ornate Gold Trim */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[1.52, 1.52, 0.05, 32]} />
          <meshStandardMaterial color="#c6a15b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Deep Red Velvet Cushion */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <cylinderGeometry args={[1.2, 1.35, 0.22, 24]} />
          <meshStandardMaterial color="#5e0b20" roughness={0.8} />
        </mesh>

        {/* INTERACTIVE LOVE LETTER PEDESTAL / COVENANT SCROLL */}
        <Interactable
          position={[0, 1.25, 0]}
          promptText="Open The Forever Letter (Our Vow)"
          onInteract={() => {
            soundManager.playSecretDiscovery();
            openForeverLetter();
          }}
          interactionDistance={3.2}
          glowColor="#dfbe7a"
        >
          <group position={[0, 0, 0]}>
            {/* Golden Box / Parchment Display */}
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.16, 0.6]} />
              <meshStandardMaterial
                color="#c6a15b"
                metalness={0.9}
                roughness={0.2}
                emissive="#c6a15b"
                emissiveIntensity={0.4}
              />
            </mesh>
            {/* Glowing Royal Seal Emblem */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.05, 16]} />
              <meshStandardMaterial color="#d6284e" emissive="#ff1a53" emissiveIntensity={0.6} />
            </mesh>
            {/* Radiant Altar Aura Light */}
            <pointLight color="#ffe082" intensity={2.0} distance={7} decay={2} />
          </group>
        </Interactable>

        {/* Red Roses scattered around altar base */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 12;
          const rx = Math.cos(angle) * 1.8;
          const rz = Math.sin(angle) * 1.8;
          return (
            <mesh key={i} position={[rx, 0.45, rz]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color="#d6284e" roughness={0.6} />
            </mesh>
          );
        })}
      </group>

      {/* GLOWING COUPLE PORTRAIT EASEL BEHIND THE ALTAR */}
      <ForeverPortraitEasel position={[0, 2.4, -3.5]} imageSrc="/images/lovee-Cover.jpg" />

      {/* EASTER EGG: BALCONY OBSERVATORY OVERLOOK */}
      <group position={[0, 0, -11]}>
        <Interactable
          position={[0, 1.4, 0]}
          promptText={secretsData['forever-balcony-view'].promptText}
          onInteract={() => {
            soundManager.playSecretDiscovery();
            openSecretModal(secretsData['forever-balcony-view']);
          }}
          glowColor="#c6a15b"
        >
          {/* Antique Brass Telescope on Tripod */}
          <group position={[0, 0, 0]}>
            {/* Tripod legs */}
            <mesh position={[-0.2, -0.6, 0]} rotation={[0, 0, 0.2]}>
              <cylinderGeometry args={[0.02, 0.03, 1.3, 6]} />
              <meshStandardMaterial color="#c6a15b" metalness={0.8} />
            </mesh>
            <mesh position={[0.2, -0.6, 0]} rotation={[0, 0, -0.2]}>
              <cylinderGeometry args={[0.02, 0.03, 1.3, 6]} />
              <meshStandardMaterial color="#c6a15b" metalness={0.8} />
            </mesh>
            {/* Scope Tube pointing up toward moon */}
            <mesh position={[0, 0.1, -0.2]} rotation={[-0.45, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.09, 1.1, 12]} />
              <meshStandardMaterial color="#dfbe7a" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        </Interactable>
      </group>

      {/* Floating Golden Stardust Particles */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starData.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.18}
          color="#ffea9f"
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Door descending back to Grand Hall */}
      {chamberDef.doors.map((d) => (
        <Door
          key={d.id}
          position={d.position}
          rotation={d.rotation}
          targetRoom={d.targetRoom}
          label={d.label}
          signText={d.signText}
          glowColor={d.color}
        />
      ))}
    </group>
  );
}

function ForeverPortraitEasel({ position, imageSrc }) {
  const [texture, setTexture] = React.useState(null);

  React.useEffect(() => {
    if (!imageSrc) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageSrc,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.warn('Forever portrait texture load error:', err)
    );
  }, [imageSrc]);

  return (
    <group position={position}>
      {/* Wooden Easel Legs */}
      <mesh position={[-0.6, -1.0, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.03, 0.04, 2.5, 8]} />
        <meshStandardMaterial color="#2d1911" roughness={0.6} />
      </mesh>
      <mesh position={[0.6, -1.0, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.03, 0.04, 2.5, 8]} />
        <meshStandardMaterial color="#2d1911" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.9, -0.5]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 2.4, 8]} />
        <meshStandardMaterial color="#2d1911" roughness={0.6} />
      </mesh>

      {/* Ornate Glowing Gold Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.5, 3.4, 0.14]} />
        <meshStandardMaterial
          color="#dfbe7a"
          metalness={0.9}
          roughness={0.2}
          emissive="#c6a15b"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Ivory Mat Border */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.1, 3.0, 0.02]} />
        <meshStandardMaterial color="#f4ede1" roughness={0.8} />
      </mesh>
      {/* Real Couple Photo */}
      <mesh position={[0, 0, 0.1]}>
        <planeGeometry args={[1.8, 2.7]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#3d0d1e" roughness={0.5} />
        )}
      </mesh>
      {/* Radiant Golden Glow Halo */}
      <pointLight position={[0, 0.5, 0.8]} color="#ffe082" intensity={2.2} distance={6} decay={1.8} />
    </group>
  );
}
