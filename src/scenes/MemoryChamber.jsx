import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { memoriesData } from '../data/memories';
import { secretsData } from '../data/messages';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import {
  createWoodPlankTexture,
  createRedCarpetTexture,
  createGothicStoneTexture,
} from '../utils/textureGenerator';

export default function MemoryChamber() {
  const openMemoryModal = useGameStore((s) => s.openMemoryModal);
  const openSecretModal = useGameStore((s) => s.openSecretModal);
  const chamberDef = roomDefinitions[ROOMS.MEMORY_CHAMBER];

  const woodTexture = useMemo(() => createWoodPlankTexture(), []);
  const carpetTexture = useMemo(() => createRedCarpetTexture(), []);
  const stoneTexture = useMemo(() => createGothicStoneTexture(), []);

  return (
    <group>
      {/* Warm Ambient Romantic Lighting */}
      <ambientLight color="#4a1525" intensity={0.7} />
      <directionalLight position={[5, 12, 5]} intensity={0.5} color="#ffd4a3" />

      {/* Room Floor - Dark Walnut Wood Planks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial map={woodTexture} roughness={0.6} color="#2b1a13" />
      </mesh>

      {/* Ornate Red Carpet Centerpiece */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[11, 13]} />
        <meshStandardMaterial map={carpetTexture} roughness={0.7} />
      </mesh>

      {/* Chamber Walls - Deep Burgundy Velvet & Dark Wainscoting */}
      {/* North Wall (Fireplace Wall) */}
      <mesh position={[0, 5, -9.5]} receiveShadow>
        <boxGeometry args={[20, 10, 1]} />
        <meshStandardMaterial color="#240713" roughness={0.8} />
      </mesh>
      {/* South Wall */}
      <mesh position={[0, 5, 9.5]} receiveShadow>
        <boxGeometry args={[20, 10, 1]} />
        <meshStandardMaterial color="#240713" roughness={0.8} />
      </mesh>
      {/* West Wall (Memory Gallery Wall) */}
      <mesh position={[-9.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 20]} />
        <meshStandardMaterial color="#240713" roughness={0.8} />
      </mesh>
      {/* East Wall (Entrance & Gallery Wall) */}
      <mesh position={[9.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 20]} />
        <meshStandardMaterial color="#240713" roughness={0.8} />
      </mesh>

      {/* Wooden Ceiling */}
      <mesh position={[0, 9.5, 0]}>
        <boxGeometry args={[20, 1, 20]} />
        <meshStandardMaterial color="#140b08" roughness={0.8} />
      </mesh>

      {/* ROARING STONE FIREPLACE (North Wall) */}
      <FireplaceHearth position={[0, 0, -8.8]} stoneTexture={stoneTexture} />

      {/* CENTRAL ANTIQUE TABLE & COUCH */}
      <AntiqueFurnitureSet />

      {/* EASTER EGG: THE EVER-BLOOMING CRIMSON ROSE ON THE TABLE */}
      <Interactable
        position={[0, 1.25, 0]}
        promptText={secretsData['memory-glowing-rose'].promptText}
        onInteract={() => {
          soundManager.playSecretDiscovery();
          openSecretModal(secretsData['memory-glowing-rose']);
        }}
        glowColor="#ff2a5f"
      >
        <GlowingRoseCloche position={[0, 0, 0]} />
      </Interactable>

      {/* INTERACTIVE PHOTOGRAPHS (THE MEMORY GALLERY) */}
      {memoriesData.map((memory) => (
        <Interactable
          key={memory.id}
          position={memory.framePosition}
          promptText={`View: "${memory.title}"`}
          onInteract={() => {
            soundManager.playHarpNote(440, soundManager.ctx?.currentTime || 0);
            openMemoryModal(memory);
          }}
          glowColor="#dfbe7a"
        >
          <InteractivePhotoFrame
            position={[0, 0, 0]}
            rotation={memory.frameRotation}
            memory={memory}
          />
        </Interactable>
      ))}

      {/* Candles & Warm Lamps along walls */}
      <WallCandleSconce position={[-9, 3.2, -7]} />
      <WallCandleSconce position={[-9, 3.2, 7]} />
      <WallCandleSconce position={[9, 3.2, -7]} />
      <WallCandleSconce position={[9, 3.2, 7]} />

      {/* Door back to Grand Hall */}
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

function FireplaceHearth({ position, stoneTexture }) {
  const flameLightRef = useRef();

  useFrame(({ clock }) => {
    if (flameLightRef.current) {
      const t = clock.getElapsedTime() * 9;
      // Flickering hearth light
      flameLightRef.current.intensity = 1.8 + Math.sin(t) * 0.3 + Math.sin(t * 2.3) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Outer Stone Chimney Breast */}
      <mesh position={[0, 3.8, 0]} castShadow>
        <boxGeometry args={[5.2, 7.6, 1.2]} />
        <meshStandardMaterial map={stoneTexture} color="#1c1820" roughness={0.9} />
      </mesh>
      {/* Firebox Alcove Opening */}
      <mesh position={[0, 1.3, 0.2]}>
        <boxGeometry args={[3.2, 2.6, 1.1]} />
        <meshStandardMaterial color="#080709" roughness={0.95} />
      </mesh>
      {/* Ornate Mantel Shelf */}
      <mesh position={[0, 2.8, 0.4]} castShadow>
        <boxGeometry args={[5.6, 0.35, 1.4]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.5} />
      </mesh>

      {/* Glowing Fire Logs & Coals */}
      <mesh position={[0, 0.3, 0.2]}>
        <cylinderGeometry args={[0.2, 0.2, 2.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#221108" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, 0.2]}>
        <coneGeometry args={[0.7, 1.2, 8]} />
        <meshBasicMaterial color="#ff6e26" />
      </mesh>
      <mesh position={[0, 0.6, 0.2]}>
        <coneGeometry args={[0.4, 0.9, 8]} />
        <meshBasicMaterial color="#ffea75" />
      </mesh>

      {/* Flickering Warm Fireplace Light */}
      <pointLight
        ref={flameLightRef}
        position={[0, 1.2, 0.8]}
        color="#ff792e"
        intensity={2.0}
        distance={9}
        decay={2}
      />

      {/* Candles and Clock on Mantel */}
      <mesh position={[-1.8, 3.2, 0.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshBasicMaterial color="#ffdeb0" />
      </mesh>
      <mesh position={[1.8, 3.2, 0.4]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshBasicMaterial color="#ffdeb0" />
      </mesh>
    </group>
  );
}

function InteractivePhotoFrame({ position, rotation, memory }) {
  const [texture, setTexture] = React.useState(null);

  React.useEffect(() => {
    if (!memory.image) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      memory.image,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.warn('Memory texture load fallback:', memory.image, err)
    );
  }, [memory.image]);

  return (
    <group position={position} rotation={rotation}>
      {/* Heavy Ornate Antique Gold Frame with Warm Glow */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 2.7, 0.12]} />
        <meshStandardMaterial
          color="#dfbe7a"
          metalness={0.85}
          roughness={0.2}
          emissive="#c6a15b"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Ivory Mat Border */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.72, 2.42, 0.02]} />
        <meshStandardMaterial color="#f0e6d6" roughness={0.8} />
      </mesh>
      {/* Real Photograph Canvas Texture */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[1.45, 2.15]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color={memory.fallbackColor || '#3d0d1e'} roughness={0.4} />
        )}
      </mesh>
      {/* Small Brass Title Plaque beneath */}
      <mesh position={[0, -1.2, 0.08]}>
        <boxGeometry args={[1.2, 0.18, 0.02]} />
        <meshStandardMaterial
          color="#dfbe7a"
          metalness={0.9}
          roughness={0.2}
          emissive="#c6a15b"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Warm Dedicated Picture Light */}
      <pointLight position={[0, 1.3, 0.5]} color="#ffe0a6" intensity={0.9} distance={4} decay={2} />
    </group>
  );
}

function GlowingRoseCloche({ position }) {
  const roseRef = useRef();

  useFrame(({ clock }) => {
    if (roseRef.current) {
      const t = clock.getElapsedTime() * 2;
      roseRef.current.position.y = 0.35 + Math.sin(t) * 0.03;
    }
  });

  return (
    <group position={position}>
      {/* Polished Mahogany Pedestal Base */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.16, 24]} />
        <meshStandardMaterial color="#241209" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Glass Bell Jar Cloche */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.32, 0.32, 0.9, 24, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          opacity={0.3}
          transparent
          roughness={0.05}
          ior={1.5}
        />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.32, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.92}
          opacity={0.3}
          transparent
          roughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Floating Glowing Crimson Rose inside */}
      <group ref={roseRef} position={[0, 0.35, 0]}>
        {/* Rose Stem */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
          <meshStandardMaterial color="#1a472a" />
        </mesh>
        {/* Crimson Rose Petals */}
        <mesh>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color="#ff1e56"
            emissive="#ff1e56"
            emissiveIntensity={1.4}
            roughness={0.2}
          />
        </mesh>
        {/* Soft Glowing Rose Aura Shell */}
        <mesh>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshBasicMaterial
            color="#ff2a5f"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Radiant Glow light */}
        <pointLight color="#ff2a5f" intensity={2.6} distance={7} decay={1.8} />
      </group>
    </group>
  );
}

function AntiqueFurnitureSet() {
  return (
    <group position={[0, 0, 0]}>
      {/* Antique Carved Coffee Table */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.4, 0.12, 1.4]} />
        <meshStandardMaterial color="#2d1911" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Table Legs with gold caps */}
      {[-1.0, 1.0].map((tx) =>
        [-0.55, 0.55].map((tz) => (
          <mesh key={`${tx}-${tz}`} position={[tx, 0.22, tz]} castShadow>
            <cylinderGeometry args={[0.05, 0.04, 0.44, 8]} />
            <meshStandardMaterial color="#1c0f0a" roughness={0.4} />
          </mesh>
        ))
      )}

      {/* Red Velvet Chesterfield Couch behind table */}
      <group position={[0, 0, 2.6]}>
        {/* Cushion Base */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[3.2, 0.45, 1.2]} />
          <meshStandardMaterial color="#500b1a" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 1.1, 0.45]} castShadow>
          <boxGeometry args={[3.2, 0.9, 0.35]} />
          <meshStandardMaterial color="#500b1a" roughness={0.7} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-1.7, 0.8, 0]} castShadow>
          <boxGeometry args={[0.35, 0.7, 1.2]} />
          <meshStandardMaterial color="#500b1a" roughness={0.7} />
        </mesh>
        <mesh position={[1.7, 0.8, 0]} castShadow>
          <boxGeometry args={[0.35, 0.7, 1.2]} />
          <meshStandardMaterial color="#500b1a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

function WallCandleSconce({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.1, 0.35, 0.2]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0.15]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
        <meshStandardMaterial color="#fdfbf7" />
      </mesh>
      <mesh position={[0, 0.3, 0.15]}>
        <coneGeometry args={[0.03, 0.1, 6]} />
        <meshBasicMaterial color="#ffbd59" />
      </mesh>
      <pointLight position={[0, 0.35, 0.2]} color="#ffaa3b" intensity={0.6} distance={4} decay={2} />
    </group>
  );
}
