import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { secretsData } from '../data/messages';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import {
  createBlackMarbleTexture,
  createRedCarpetTexture,
  createGothicStoneTexture,
  createStainedGlassTexture,
} from '../utils/textureGenerator';

export default function GrandHall() {
  const openSecretModal = useGameStore((s) => s.openSecretModal);
  const hallDef = roomDefinitions[ROOMS.GRAND_HALL];

  const marbleTexture = useMemo(() => createBlackMarbleTexture(), []);
  const carpetTexture = useMemo(() => createRedCarpetTexture(), []);
  const stoneTexture = useMemo(() => createGothicStoneTexture(), []);
  const stainedGlassTexture = useMemo(() => createStainedGlassTexture(), []);

  return (
    <group>
      {/* Warm Ambient Romantic Illumination */}
      <ambientLight color="#451829" intensity={0.75} />
      <directionalLight position={[0, 18, 5]} intensity={1.1} color="#ffe2b8" castShadow />

      {/* Radiant Golden Chandeliers */}
      <GothicChandelier position={[0, 11, 4]} />
      <GothicChandelier position={[0, 11, -8]} />

      {/* Main Floor - Polished Black Marble with Gold Reflections */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 36]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughness={0.15}
          metalness={0.3}
          color="#14111a"
        />
      </mesh>

      {/* Red Velvet Carpet Runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]} receiveShadow>
        <planeGeometry args={[4.4, 26]} />
        <meshStandardMaterial map={carpetTexture} roughness={0.7} />
      </mesh>

      {/* Hall Walls - Gothic Stone with Warm Golden Sconce Lighting */}
      {/* Back Wall */}
      <mesh position={[0, 8, -17]} receiveShadow>
        <boxGeometry args={[26, 16, 1]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.85} color="#211e2b" />
      </mesh>
      {/* Front Entrance Wall */}
      <mesh position={[0, 8, 17]} receiveShadow>
        <boxGeometry args={[26, 16, 1]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.85} color="#211e2b" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-12.5, 8, 0]} receiveShadow>
        <boxGeometry args={[1, 16, 35]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.85} color="#211e2b" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[12.5, 8, 0]} receiveShadow>
        <boxGeometry args={[1, 16, 35]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.85} color="#211e2b" />
      </mesh>

      {/* High Gothic Vaulted Ceiling */}
      <mesh position={[0, 15.5, 0]}>
        <boxGeometry args={[26, 1, 35]} />
        <meshStandardMaterial color="#110d16" roughness={0.9} />
      </mesh>

      {/* Huge Rose Stained Glass Windows Glowing with Rich Amber Light */}
      <mesh position={[0, 11, -16.4]} rotation={[0, 0, 0]}>
        <circleGeometry args={[3.4, 32]} />
        <meshStandardMaterial
          map={stainedGlassTexture}
          emissive="#dfbe7a"
          emissiveIntensity={0.65}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 11, -15.2]} color="#ff9e54" intensity={2.2} distance={18} />

      <mesh position={[0, 11, 16.4]} rotation={[0, Math.PI, 0]}>
        <circleGeometry args={[3.4, 32]} />
        <meshStandardMaterial
          map={stainedGlassTexture}
          emissive="#dfbe7a"
          emissiveIntensity={0.65}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 11, 15.2]} color="#ff9e54" intensity={2.2} distance={18} />

      {/* Gothic Fluted Pillars with Golden Light Rings */}
      {[-8, 8].map((px) =>
        [-10, -3, 4, 11].map((pz) => (
          <GothicPillar key={`${px}-${pz}`} position={[px, 0, pz]} />
        ))
      )}

      {/* GRAND DOUBLE STAIRCASE */}
      <GrandDoubleStaircase carpetTexture={carpetTexture} marbleTexture={marbleTexture} />

      {/* PHYSICAL INTERACTIVE DOORS */}
      {hallDef.doors.map((d) => (
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

      {/* PORTRAIT PAINTINGS ON WALLS (USING OUR REAL PHOTOGRAPHS!) */}
      {/* Left Wall Paintings */}
      <PaintingFrame
        position={[-11.9, 3.2, -3]}
        rotation={[0, Math.PI / 2, 0]}
        title="Royal Majesty"
        imageSrc="/images/lovee-Cover.jpg"
      />
      <PaintingFrame
        position={[-11.9, 3.2, 7]}
        rotation={[0, Math.PI / 2, 0]}
        title="The Golden Sunset"
        imageSrc="/images/Snapchat-1832497266.jpg"
      />

      {/* Right Wall Paintings */}
      <PaintingFrame
        position={[11.9, 3.2, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        title="Symphony of Smiles"
        imageSrc="/images/IMG_20260923_111207.jpg"
      />

      {/* EASTER EGG: INTERACTIVE SECRET PAINTING ON RIGHT WALL */}
      <Interactable
        position={[11.9, 3.2, 7]}
        promptText={secretsData['grand-hall-painting'].promptText}
        onInteract={() => {
          soundManager.playSecretDiscovery();
          openSecretModal(secretsData['grand-hall-painting']);
        }}
        glowColor="#dfbe7a"
      >
        <PaintingFrame
          position={[0, 0, 0]}
          rotation={[0, -Math.PI / 2, 0]}
          title="The Royal Crest (Secret Note)"
          imageSrc="/images/Snapchat-977776601.jpg"
          isGlowing
        />
      </Interactable>

      {/* Decorative Glowing Candelabras around the hall */}
      <CandelabraStand position={[-4, 0, 10]} />
      <CandelabraStand position={[4, 0, 10]} />
      <CandelabraStand position={[-4.5, 5.2, -13]} />
      <CandelabraStand position={[4.5, 5.2, -13]} />
    </group>
  );
}

function GothicPillar({ position }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.6, 0.8, 1.6]} />
        <meshStandardMaterial color="#1a1824" roughness={0.8} />
      </mesh>
      {/* Column shaft */}
      <mesh position={[0, 7.5, 0]} castShadow>
        <cylinderGeometry args={[0.65, 0.72, 13.5, 16]} />
        <meshStandardMaterial color="#24202e" roughness={0.7} />
      </mesh>
      {/* Capital top */}
      <mesh position={[0, 14.5, 0]} castShadow>
        <boxGeometry args={[1.7, 0.8, 1.7]} />
        <meshStandardMaterial color="#282433" roughness={0.8} />
      </mesh>
      {/* Gold Glowing Trim Band */}
      <mesh position={[0, 14.1, 0]}>
        <cylinderGeometry args={[0.76, 0.76, 0.22, 16]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <pointLight position={[0, 7.5, 0.9]} color="#ffb854" intensity={0.6} distance={6} decay={2} />
    </group>
  );
}

function GothicChandelier({ position }) {
  return (
    <group position={position}>
      {/* Ceiling Chain */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 4, 8]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Main Gold Crown Ring */}
      <mesh>
        <torusGeometry args={[2.3, 0.1, 12, 32]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Inner Tier Ring */}
      <mesh position={[0, -0.65, 0]}>
        <torusGeometry args={[1.4, 0.08, 12, 24]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Glowing Crystal Finial Bottom */}
      <mesh position={[0, -1.3, 0]}>
        <coneGeometry args={[0.32, 0.8, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffe082"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>

      {/* Candles and Glowing Flame Cores on outer ring */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI * 2) / 8;
        const cx = Math.cos(angle) * 2.3;
        const cz = Math.sin(angle) * 2.3;
        return (
          <group key={i} position={[cx, 0.15, cz]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
              <meshStandardMaterial color="#f0e6d6" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.26, 0]}>
              <coneGeometry args={[0.045, 0.18, 8]} />
              <meshBasicMaterial color="#ffc168" />
            </mesh>
          </group>
        );
      })}

      {/* Radiant Chandelier Light */}
      <pointLight color="#ffab38" intensity={2.4} distance={22} decay={1.7} />
    </group>
  );
}

function GrandDoubleStaircase({ carpetTexture, marbleTexture }) {
  const steps = 18;
  const riser = 0.29;
  const tread = 0.45;

  return (
    <group position={[0, 0, -8]}>
      {/* Central Upper Balcony Platform (leads to Forever Chamber door at y = 5.2, z = -15.5) */}
      <mesh position={[0, 5.0, -5]} receiveShadow>
        <boxGeometry args={[11, 0.4, 5]} />
        <meshStandardMaterial map={marbleTexture} roughness={0.2} color="#181520" />
      </mesh>
      {/* Carpet on balcony */}
      <mesh position={[0, 5.21, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.4, 5]} />
        <meshStandardMaterial map={carpetTexture} roughness={0.7} />
      </mesh>
      {/* Glowing Gold Balcony Railings */}
      <mesh position={[-5.3, 5.7, -4]}>
        <boxGeometry args={[0.2, 1.0, 4.8]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[5.3, 5.7, -4]}>
        <boxGeometry args={[0.2, 1.0, 4.8]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[0, 5.7, -2.6]}>
        <boxGeometry args={[4, 1.0, 0.2]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#c6a15b"
          emissiveIntensity={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Left Stair Flight */}
      {Array.from({ length: steps }).map((_, i) => {
        const stepY = i * riser + 0.14;
        const stepZ = 1.5 - i * tread * 0.45;
        const stepX = -7.5 + i * 0.24;
        return (
          <group key={`l-${i}`} position={[stepX, stepY, stepZ]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.2, riser, tread]} />
              <meshStandardMaterial map={marbleTexture} roughness={0.2} color="#1b1826" />
            </mesh>
            <mesh position={[0, riser / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.2, tread * 0.95]} />
              <meshStandardMaterial map={carpetTexture} roughness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Right Stair Flight */}
      {Array.from({ length: steps }).map((_, i) => {
        const stepY = i * riser + 0.14;
        const stepZ = 1.5 - i * tread * 0.45;
        const stepX = 7.5 - i * 0.24;
        return (
          <group key={`r-${i}`} position={[stepX, stepY, stepZ]}>
            <mesh receiveShadow>
              <boxGeometry args={[3.2, riser, tread]} />
              <meshStandardMaterial map={marbleTexture} roughness={0.2} color="#1b1826" />
            </mesh>
            <mesh position={[0, riser / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.2, tread * 0.95]} />
              <meshStandardMaterial map={carpetTexture} roughness={0.7} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function PaintingFrame({ position, rotation, title, imageSrc, isGlowing = false }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!imageSrc) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      imageSrc,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      (err) => console.warn('Texture failed to load:', imageSrc, err)
    );
  }, [imageSrc]);

  return (
    <group position={position} rotation={rotation}>
      {/* Gold Ornate Outer Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.3, 3.3, 0.14]} />
        <meshStandardMaterial
          color="#dfbe7a"
          metalness={0.85}
          roughness={0.2}
          emissive={isGlowing ? '#c6a15b' : '#33200a'}
          emissiveIntensity={isGlowing ? 0.6 : 0.15}
        />
      </mesh>
      {/* Ivory Mat Border */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[1.9, 2.9, 0.02]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.8} />
      </mesh>
      {/* Canvas with our Real Photo Texture */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[1.6, 2.6]} />
        {texture ? (
          <meshBasicMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#3d1421" roughness={0.5} />
        )}
      </mesh>
      {/* Warm Golden Spotlight on Picture */}
      <pointLight position={[0, 1.6, 0.6]} color="#ffe4b0" intensity={1.1} distance={4.5} decay={2} />
    </group>
  );
}

function CandelabraStand({ position }) {
  return (
    <group position={position}>
      {/* Ornate Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.45, 0.8, 8]} />
        <meshStandardMaterial color="#dfbe7a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#dfbe7a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Three Candle Branches */}
      {[-0.3, 0, 0.3].map((cx, idx) => (
        <group key={idx} position={[cx, 2.05, 0]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
            <meshStandardMaterial color="#fffaed" />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <coneGeometry args={[0.04, 0.16, 6]} />
            <meshBasicMaterial color="#ffc168" />
          </mesh>
        </group>
      ))}
      <pointLight position={[0, 2.3, 0]} color="#ffa836" intensity={1.4} distance={6.5} decay={2} />
    </group>
  );
}
