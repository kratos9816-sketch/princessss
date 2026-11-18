import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import {
  createBlackMarbleTexture,
  createRedCarpetTexture,
  createStainedGlassTexture,
} from '../utils/textureGenerator';

export default function Ballroom() {
  const ballroomDef = roomDefinitions[ROOMS.BALLROOM];
  const { camera } = useThree();
  const ballroomDanceActive = useGameStore((s) => s.ballroomDanceActive);
  const ballroomCinematicTriggered = useGameStore((s) => s.ballroomCinematicTriggered);
  const triggerBallroomDance = useGameStore((s) => s.triggerBallroomDance);

  const marbleTexture = useMemo(() => createBlackMarbleTexture(), []);
  const carpetTexture = useMemo(() => createRedCarpetTexture(), []);
  const stainedGlassTexture = useMemo(() => createStainedGlassTexture(), []);

  // Floating rose petals particle system
  const petalCount = 180;
  const petalsRef = useRef();
  const petalData = useMemo(() => {
    const pos = new Float32Array(petalCount * 3);
    const speed = new Float32Array(petalCount);
    const spin = new Float32Array(petalCount);

    for (let i = 0; i < petalCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 12 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      speed[i] = Math.random() * 0.8 + 0.4;
      spin[i] = Math.random() * 2;
    }
    return { pos, speed, spin };
  }, []);

  // Dance cinematic camera rotation
  useFrame((state, delta) => {
    // Animate falling petals
    if (petalsRef.current) {
      const positions = petalsRef.current.geometry.attributes.position.array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < petalCount; i++) {
        // Fall down
        positions[i * 3 + 1] -= delta * petalData.speed[i];
        // Drift sway
        positions[i * 3] += Math.sin(t + petalData.spin[i]) * 0.015;
        positions[i * 3 + 2] += Math.cos(t + petalData.spin[i]) * 0.015;

        // Reset to top
        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 12 + Math.random() * 2;
          positions[i * 3] = (Math.random() - 0.5) * 22;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
        }
      }
      petalsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Cinematic ballroom dance sweep when triggered
    if (ballroomDanceActive) {
      const t = state.clock.getElapsedTime();
      const radius = 6.0;
      camera.position.x = Math.sin(t * 0.6) * radius;
      camera.position.z = Math.cos(t * 0.6) * radius;
      camera.position.y = 2.4 + Math.sin(t * 1.2) * 0.4;
      camera.lookAt(0, 1.2, 0);
    }
  });

  // Auto trigger dance on first entry into center area
  useEffect(() => {
    if (!ballroomCinematicTriggered) {
      const timer = setTimeout(() => {
        triggerBallroomDance();
        soundManager.playBallroomWaltzFlourish();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [ballroomCinematicTriggered, triggerBallroomDance]);

  return (
    <group>
      {/* Lighting */}
      <ambientLight color="#381023" intensity={0.7} />
      <directionalLight position={[0, 16, 0]} intensity={0.9} color="#ffd4a8" />

      {/* Main Polished Marble Dance Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 28]} />
        <meshStandardMaterial
          map={marbleTexture}
          roughness={0.15}
          metalness={0.3}
          color="#120c15"
        />
      </mesh>

      {/* Golden Circular Dance Floor Medallion Inlay */}
      <group position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <ringGeometry args={[6.8, 7.2, 64]} />
          <meshStandardMaterial color="#c6a15b" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh receiveShadow>
          <ringGeometry args={[3.8, 4.1, 64]} />
          <meshStandardMaterial color="#dfbe7a" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh receiveShadow>
          <circleGeometry args={[2.5, 32]} />
          <meshStandardMaterial color="#350716" roughness={0.4} />
        </mesh>
      </group>

      {/* Walls */}
      {/* Back Wall */}
      <mesh position={[0, 7, -14]} receiveShadow>
        <boxGeometry args={[24, 14, 1]} />
        <meshStandardMaterial color="#1f0914" roughness={0.8} />
      </mesh>
      {/* Front Entrance Wall */}
      <mesh position={[0, 7, 14]} receiveShadow>
        <boxGeometry args={[24, 14, 1]} />
        <meshStandardMaterial color="#1f0914" roughness={0.8} />
      </mesh>
      {/* Left Wall (with Grand Arched Windows & Velvet Curtains) */}
      <mesh position={[-12, 7, 0]} receiveShadow>
        <boxGeometry args={[1, 14, 28]} />
        <meshStandardMaterial color="#1f0914" roughness={0.8} />
      </mesh>
      {/* Right Wall (with Grand Arched Windows & Velvet Curtains) */}
      <mesh position={[12, 7, 0]} receiveShadow>
        <boxGeometry args={[1, 14, 28]} />
        <meshStandardMaterial color="#1f0914" roughness={0.8} />
      </mesh>

      {/* High Arched Ceiling */}
      <mesh position={[0, 14, 0]}>
        <boxGeometry args={[24, 1, 28]} />
        <meshStandardMaterial color="#0c070f" roughness={0.85} />
      </mesh>

      {/* Cascading Dark Red Velvet Curtains framing Windows */}
      {[-8, 0, 8].map((wz) => (
        <React.Fragment key={wz}>
          {/* Left Window Curtains */}
          <VelvetCurtain position={[-11.4, 7, wz - 1.8]} />
          <VelvetCurtain position={[-11.4, 7, wz + 1.8]} />
          <StainedGlassWindow position={[-11.45, 7, wz]} rotation={[0, Math.PI / 2, 0]} texture={stainedGlassTexture} />

          {/* Right Window Curtains */}
          <VelvetCurtain position={[11.4, 7, wz - 1.8]} />
          <VelvetCurtain position={[11.4, 7, wz + 1.8]} />
          <StainedGlassWindow position={[11.45, 7, wz]} rotation={[0, -Math.PI / 2, 0]} texture={stainedGlassTexture} />
        </React.Fragment>
      ))}

      {/* Massive Central Golden Chandeliers */}
      <BallroomChandelier position={[0, 10.5, 0]} isGrand />
      <BallroomChandelier position={[0, 10.5, -8]} />
      <BallroomChandelier position={[0, 10.5, 8]} />

      {/* INTERACTIVE CENTRAL DANCE STAGE */}
      <Interactable
        position={[0, 0, 0]}
        promptText="Step onto Dance Stage (Waltz with Me)"
        onInteract={() => {
          soundManager.playBallroomWaltzFlourish();
          triggerBallroomDance();
        }}
        interactionDistance={3.8}
        glowColor="#dfbe7a"
        showBeacon={false}
      >
        <group position={[0, 0.05, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 1.8, 32]} />
            <meshBasicMaterial color="#dfbe7a" transparent opacity={0.35} />
          </mesh>
        </group>
      </Interactable>

      {/* Floating Rose Petals Particle System */}
      <points ref={petalsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[petalData.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#d6284e"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>

      {/* Pedestals with Vases of Red Roses around perimeter */}
      {[-9, 9].map((rx) =>
        [-10, 0, 10].map((rz) => (
          <RoseUrnPedestal key={`${rx}-${rz}`} position={[rx, 0, rz]} />
        ))
      )}

      {/* Physical Door back to Grand Hall */}
      {ballroomDef.doors.map((d) => (
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

function BallroomChandelier({ position, isGrand = false }) {
  const scale = isGrand ? 1.35 : 1.0;
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3.6, 8]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.8} />
      </mesh>
      {/* Tiers */}
      <mesh>
        <torusGeometry args={[2.5, 0.08, 12, 32]} />
        <meshStandardMaterial color="#dfbe7a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.7, 0]}>
        <torusGeometry args={[1.6, 0.07, 12, 24]} />
        <meshStandardMaterial color="#dfbe7a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -1.3, 0]}>
        <torusGeometry args={[0.8, 0.06, 12, 16]} />
        <meshStandardMaterial color="#dfbe7a" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Glowing Warm Light */}
      <pointLight color="#ffab3d" intensity={isGrand ? 2.2 : 1.4} distance={20} decay={1.8} />
    </group>
  );
}

function VelvetCurtain({ position }) {
  return (
    <group position={position}>
      {/* Gathered pleated velvet drape */}
      <mesh castShadow>
        <boxGeometry args={[0.3, 10, 1.1]} />
        <meshStandardMaterial color="#4a0817" roughness={0.8} />
      </mesh>
      {/* Gold tie-back cord */}
      <mesh position={[0.1, -1.5, 0]}>
        <torusGeometry args={[0.6, 0.04, 8, 16]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.8} />
      </mesh>
    </group>
  );
}

function StainedGlassWindow({ position, rotation, texture }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Window Arch Frame */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2.4, 7.5]} />
        <meshStandardMaterial
          map={texture}
          emissive="#c6a15b"
          emissiveIntensity={0.35}
          roughness={0.1}
        />
      </mesh>
      <pointLight position={[0, 0, 0.5]} color="#ff9244" intensity={0.6} distance={6} />
    </group>
  );
}

function RoseUrnPedestal({ position }) {
  return (
    <group position={position}>
      {/* Marble Pedestal */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.42, 1.3, 12]} />
        <meshStandardMaterial color="#1a1820" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Antique Gold Urn */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.36, 16, 16]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Rose Bouquet Cluster */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.32, 12, 12]} />
        <meshStandardMaterial color="#d6284e" roughness={0.6} />
      </mesh>
    </group>
  );
}
