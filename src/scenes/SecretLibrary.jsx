import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { libraryBooks, secretsData } from '../data/messages';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import {
  createWoodPlankTexture,
  createRedCarpetTexture,
  createGothicStoneTexture,
} from '../utils/textureGenerator';

export default function SecretLibrary() {
  const libraryDef = roomDefinitions[ROOMS.SECRET_LIBRARY];
  const openBookModal = useGameStore((s) => s.openBookModal);
  const openSecretModal = useGameStore((s) => s.openSecretModal);

  const woodTexture = useMemo(() => createWoodPlankTexture(), []);
  const carpetTexture = useMemo(() => createRedCarpetTexture(), []);
  const stoneTexture = useMemo(() => createGothicStoneTexture(), []);

  // Floating dust motes
  const dustCount = 150;
  const dustRef = useRef();
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 8 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (dustRef.current) {
      const positions = dustRef.current.geometry.attributes.position.array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < dustCount; i++) {
        positions[i * 3 + 1] += Math.sin(t * 0.5 + i) * 0.003;
        positions[i * 3] += Math.cos(t * 0.3 + i) * 0.002;
        if (positions[i * 3 + 1] > 9) positions[i * 3 + 1] = 0.5;
      }
      dustRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Warm Ambient Library Lighting */}
      <ambientLight color="#241712" intensity={0.7} />
      <directionalLight position={[0, 14, 0]} intensity={0.6} color="#ffe2b3" />

      {/* Dark Walnut Plank Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 22]} />
        <meshStandardMaterial map={woodTexture} roughness={0.7} color="#20130d" />
      </mesh>

      {/* Persian Gothic Area Rug under study desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[9, 12]} />
        <meshStandardMaterial map={carpetTexture} roughness={0.75} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 5, -10.5]} receiveShadow>
        <boxGeometry args={[18, 10, 1]} />
        <meshStandardMaterial color="#1a120e" roughness={0.8} />
      </mesh>
      <mesh position={[0, 5, 10.5]} receiveShadow>
        <boxGeometry args={[18, 10, 1]} />
        <meshStandardMaterial color="#1a120e" roughness={0.8} />
      </mesh>
      <mesh position={[-8.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 22]} />
        <meshStandardMaterial color="#1a120e" roughness={0.8} />
      </mesh>
      <mesh position={[8.5, 5, 0]} receiveShadow>
        <boxGeometry args={[1, 10, 22]} />
        <meshStandardMaterial color="#1a120e" roughness={0.8} />
      </mesh>

      {/* High Beamed Wooden Ceiling */}
      <mesh position={[0, 9.8, 0]}>
        <boxGeometry args={[18, 0.8, 22]} />
        <meshStandardMaterial color="#110a07" roughness={0.9} />
      </mesh>

      {/* TOWERING BOOKSHELVES LINING THE WALLS */}
      {/* North Bookshelves */}
      <BookshelfUnit position={[-4.5, 0, -9.8]} rotation={[0, 0, 0]} />
      <BookshelfUnit position={[4.5, 0, -9.8]} rotation={[0, 0, 0]} />
      {/* West Bookshelves */}
      <BookshelfUnit position={[-7.8, 0, -5]} rotation={[0, Math.PI / 2, 0]} />
      <BookshelfUnit position={[-7.8, 0, 5]} rotation={[0, Math.PI / 2, 0]} />
      {/* East Bookshelves */}
      <BookshelfUnit position={[7.8, 0, -5]} rotation={[0, -Math.PI / 2, 0]} />
      <BookshelfUnit position={[7.8, 0, 5]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Rolling Antique Wooden Library Ladders */}
      <LibraryLadder position={[-7.0, 0, -3.5]} rotation={[0, Math.PI / 2, -0.22]} />
      <LibraryLadder position={[7.0, 0, 3.5]} rotation={[0, -Math.PI / 2, 0.22]} />

      {/* Stone Fireplace in North Wall Center */}
      <LibraryFireplace position={[0, 0, -9.8]} stoneTexture={stoneTexture} />

      {/* CENTRAL SCHOLAR'S DESK */}
      <group position={[0, 0, 0]}>
        {/* Desk Table */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[3.2, 0.16, 1.8]} />
          <meshStandardMaterial color="#2d170f" roughness={0.4} metalness={0.15} />
        </mesh>
        {/* Drawers Pedestals */}
        <mesh position={[-1.2, 0.35, 0]} castShadow>
          <boxGeometry args={[0.7, 0.7, 1.6]} />
          <meshStandardMaterial color="#22110a" roughness={0.5} />
        </mesh>
        <mesh position={[1.2, 0.35, 0]} castShadow>
          <boxGeometry args={[0.7, 0.7, 1.6]} />
          <meshStandardMaterial color="#22110a" roughness={0.5} />
        </mesh>

        {/* Banker's Green Brass Desk Lamp */}
        <group position={[0.9, 0.85, -0.4]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.05, 12]} />
            <meshStandardMaterial color="#c6a15b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
            <meshStandardMaterial color="#c6a15b" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[0.3, 0.12, 0.16]} />
            <meshStandardMaterial color="#1a4d2e" roughness={0.2} metalness={0.3} />
          </mesh>
          <pointLight position={[0, 0.45, 0]} color="#ffdd88" intensity={1.2} distance={4.5} />
        </group>

        {/* Stack of Leatherbound Books on desk */}
        <mesh position={[-0.8, 0.9, 0.3]} castShadow>
          <boxGeometry args={[0.45, 0.14, 0.6]} />
          <meshStandardMaterial color="#501822" roughness={0.6} />
        </mesh>
        <mesh position={[-0.8, 1.02, 0.3]} castShadow>
          <boxGeometry args={[0.4, 0.1, 0.55]} />
          <meshStandardMaterial color="#1f3248" roughness={0.6} />
        </mesh>

        {/* EASTER EGG: INTERACTIVE SECRET DRAWER IN THE DESK */}
        <Interactable
          position={[0, 0.55, 0.85]}
          promptText={secretsData['library-hidden-compartment'].promptText}
          onInteract={() => {
            soundManager.playSecretDiscovery();
            openSecretModal(secretsData['library-hidden-compartment']);
          }}
          glowColor="#dfbe7a"
        >
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.22, 0.1]} />
            <meshStandardMaterial color="#3a1d12" roughness={0.4} />
          </mesh>
        </Interactable>

        {/* Antique Tufted Leather Chair */}
        <group position={[0, 0, -1.3]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.9, 0.12, 0.9]} />
            <meshStandardMaterial color="#421d15" roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.1, -0.4]} castShadow>
            <boxGeometry args={[0.9, 1.1, 0.14]} />
            <meshStandardMaterial color="#421d15" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* GLOWING INTERACTIVE BOOKS ON PEDESTALS & STANDS */}
      {libraryBooks.map((book) => (
        <Interactable
          key={book.id}
          position={book.position}
          promptText={`Read: "${book.title}"`}
          onInteract={() => {
            soundManager.playHarpNote(523.25, soundManager.ctx?.currentTime || 0);
            openBookModal(book);
          }}
          glowColor={book.color}
        >
          <BookPedestalStand book={book} />
        </Interactable>
      ))}

      {/* Floating Dust Motes */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          color="#dfbe7a"
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Door back to Grand Hall */}
      {libraryDef.doors.map((d) => (
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

function BookshelfUnit({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Massive Outer Frame */}
      <mesh position={[0, 4.5, 0]} castShadow>
        <boxGeometry args={[6.8, 9, 1.2]} />
        <meshStandardMaterial color="#1e100a" roughness={0.6} />
      </mesh>

      {/* Shelves and Rows of Colorful Bound Tomes */}
      {[1.2, 2.6, 4.0, 5.4, 6.8, 8.2].map((sy, rowIdx) => (
        <React.Fragment key={sy}>
          {/* Wooden Shelf Plank */}
          <mesh position={[0, sy, 0.1]} castShadow>
            <boxGeometry args={[6.4, 0.12, 1.0]} />
            <meshStandardMaterial color="#2d170f" roughness={0.5} />
          </mesh>
          {/* Row of Books on shelf */}
          <mesh position={[0, sy + 0.5, 0.15]}>
            <boxGeometry args={[6.1, 0.85, 0.65]} />
            <meshStandardMaterial
              color={['#581622', '#182b42', '#1b3b28', '#422814', '#381636'][rowIdx % 5]}
              roughness={0.7}
            />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

function LibraryLadder({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left Rail */}
      <mesh position={[-0.24, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 8.5, 8]} />
        <meshStandardMaterial color="#2b160e" roughness={0.5} />
      </mesh>
      {/* Right Rail */}
      <mesh position={[0.24, 4.2, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 8.5, 8]} />
        <meshStandardMaterial color="#2b160e" roughness={0.5} />
      </mesh>
      {/* Rungs */}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.5, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.48, 8]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#c6a15b" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function LibraryFireplace({ position, stoneTexture }) {
  return (
    <group position={position}>
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[4.2, 5.0, 1.2]} />
        <meshStandardMaterial map={stoneTexture} color="#18151c" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.2, 0.2]}>
        <boxGeometry args={[2.5, 2.0, 0.9]} />
        <meshStandardMaterial color="#09080b" />
      </mesh>
      <mesh position={[0, 0.4, 0.3]}>
        <coneGeometry args={[0.5, 0.9, 8]} />
        <meshBasicMaterial color="#ff7a2b" />
      </mesh>
      <pointLight position={[0, 1.2, 0.8]} color="#ff8636" intensity={1.5} distance={8} decay={2} />
    </group>
  );
}

function BookPedestalStand({ book }) {
  return (
    <group>
      {/* Wooden Carved Lectern / Pedestal */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.38, 1.3, 12]} />
        <meshStandardMaterial color="#24130a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.35, 0]} rotation={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.85, 0.08, 0.65]} />
        <meshStandardMaterial color="#2d170f" roughness={0.4} />
      </mesh>

      {/* The Glowing Antique Tome */}
      <group position={[0, 1.45, 0]} rotation={[0.4, 0, 0]}>
        {/* Leather Cover */}
        <mesh castShadow>
          <boxGeometry args={[0.7, 0.09, 0.52]} />
          <meshStandardMaterial
            color={book.color || '#80182a'}
            emissive={book.color || '#80182a'}
            emissiveIntensity={0.35}
            roughness={0.4}
          />
        </mesh>
        {/* Gold Filigree Spine & Corners */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.66, 0.02, 0.48]} />
          <meshStandardMaterial color="#e8dcc8" roughness={0.8} />
        </mesh>
        {/* Magical Glow */}
        <pointLight color={book.color || '#dfbe7a'} intensity={0.9} distance={3.5} decay={2} />
      </group>
    </group>
  );
}
