import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Door from '../components/Door';
import Interactable from '../components/Interactable';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { secretsData } from '../data/messages';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';
import { createGothicStoneTexture } from '../utils/textureGenerator';

export default function EnchantedGarden() {
  const gardenDef = roomDefinitions[ROOMS.ENCHANTED_GARDEN];
  const openSecretModal = useGameStore((s) => s.openSecretModal);

  const stoneTexture = useMemo(() => createGothicStoneTexture(), []);

  // Fireflies particle system
  const fireflyCount = 90;
  const firefliesRef = useRef();
  const fireflyData = useMemo(() => {
    const pos = new Float32Array(fireflyCount * 3);
    const speed = new Float32Array(fireflyCount);
    for (let i = 0; i < fireflyCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = Math.random() * 3.5 + 0.3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 32;
      speed[i] = Math.random() * 1.5 + 0.5;
    }
    return { pos, speed };
  }, []);

  // Water droplets particle system
  const dropCount = 70;
  const dropletsRef = useRef();
  const dropPositions = useMemo(() => {
    const pos = new Float32Array(dropCount * 3);
    for (let i = 0; i < dropCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.8;
      pos[i * 3 + 1] = 2.2 + Math.random() * 1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    // Fireflies floating
    if (firefliesRef.current) {
      const positions = firefliesRef.current.geometry.attributes.position.array;
      const t = state.clock.getElapsedTime();
      for (let i = 0; i < fireflyCount; i++) {
        positions[i * 3 + 1] += Math.sin(t * fireflyData.speed[i] + i) * 0.008;
        positions[i * 3] += Math.cos(t * 0.4 + i) * 0.008;
        positions[i * 3 + 2] += Math.sin(t * 0.4 + i) * 0.008;
      }
      firefliesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Fountain water droplets falling
    if (dropletsRef.current) {
      const positions = dropletsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < dropCount; i++) {
        positions[i * 3 + 1] -= delta * 2.4;
        if (positions[i * 3 + 1] < 1.0) {
          positions[i * 3 + 1] = 3.2;
          positions[i * 3] = (Math.random() - 0.5) * 0.4;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
        }
      }
      dropletsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Night Sky Moonlight */}
      <directionalLight
        position={[18, 35, 12]}
        intensity={0.9}
        color="#c8dbff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <ambientLight color="#0b1626" intensity={0.5} />

      {/* Full Moon overhead */}
      <group position={[28, 38, -35]}>
        <mesh>
          <sphereGeometry args={[5, 24, 24]} />
          <meshBasicMaterial color="#f0e9dd" />
        </mesh>
        <pointLight color="#d7e5ff" intensity={1.5} distance={90} />
      </group>

      {/* Garden Ground (Dark Lush Grass) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#0c1810" roughness={0.95} />
      </mesh>

      {/* Stone Pathways */}
      {/* Main East-West Pathway from Grand Hall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[32, 4]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.8} color="#181a20" />
      </mesh>
      {/* Circular Pathway surrounding Fountain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 0]} receiveShadow>
        <ringGeometry args={[5.2, 9.2, 32]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.8} color="#181a20" />
      </mesh>
      {/* Pathway to Gazebo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]} receiveShadow>
        <planeGeometry args={[3.2, 12]} />
        <meshStandardMaterial map={stoneTexture} roughness={0.8} color="#181a20" />
      </mesh>

      {/* Surrounding Castle Stone Walls with Iron Spikes */}
      <mesh position={[0, 3, -18]} castShadow>
        <boxGeometry args={[40, 6, 1]} />
        <meshStandardMaterial map={stoneTexture} color="#17161e" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3, 18]} castShadow>
        <boxGeometry args={[40, 6, 1]} />
        <meshStandardMaterial map={stoneTexture} color="#17161e" roughness={0.85} />
      </mesh>
      <mesh position={[-18, 3, 0]} castShadow>
        <boxGeometry args={[1, 6, 40]} />
        <meshStandardMaterial map={stoneTexture} color="#17161e" roughness={0.85} />
      </mesh>
      <mesh position={[18, 3, 0]} castShadow>
        <boxGeometry args={[1, 6, 40]} />
        <meshStandardMaterial map={stoneTexture} color="#17161e" roughness={0.85} />
      </mesh>

      {/* MAGNIFICENT CENTRAL GOTHIC FOUNTAIN */}
      <GothicFountain dropletsRef={dropletsRef} dropPositions={dropPositions} />

      {/* EASTER EGG: INTERACTIVE WHISPERING FOUNTAIN */}
      <Interactable
        position={[0, 1.2, 0]}
        promptText={secretsData['garden-fountain-whisper'].promptText}
        onInteract={() => {
          soundManager.playSecretDiscovery();
          openSecretModal(secretsData['garden-fountain-whisper']);
        }}
        interactionDistance={3.8}
        glowColor="#52c8ff"
      >
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.8, 2.8, 0.4, 24]} />
          <meshBasicMaterial color="#52c8ff" transparent opacity={0.15} wireframe />
        </mesh>
      </Interactable>

      {/* ROMANTIC GOTHIC GAZEBO (South end) */}
      <RomanticGazebo position={[0, 0, 13]} />

      {/* RED ROSE BUSHES & ARCHWAYS */}
      {[-8, -5, 5, 8].map((rx) =>
        [-10, -5, 5].map((rz) => (
          <RoseBushCluster key={`${rx}-${rz}`} position={[rx, 0, rz]} />
        ))
      )}

      {/* Ancient Marble Statues */}
      <AncientStatue position={[-9, 0, 8]} rotation={[0, Math.PI / 4, 0]} />
      <AncientStatue position={[9, 0, 8]} rotation={[0, -Math.PI / 4, 0]} />

      {/* Glowing Fireflies */}
      <points ref={firefliesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[fireflyData.pos, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.22}
          color="#dfff75"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Door back to Grand Hall */}
      {gardenDef.doors.map((d) => (
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

function GothicFountain({ dropletsRef, dropPositions }) {
  return (
    <group position={[0, 0, 0]}>
      {/* Lower Stone Basin Rim */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[4.2, 4.4, 0.8, 32]} />
        <meshStandardMaterial color="#1f1e28" roughness={0.8} />
      </mesh>
      {/* Water Surface in lower basin */}
      <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.0, 32]} />
        <meshStandardMaterial
          color="#1a4f66"
          roughness={0.1}
          metalness={0.4}
          emissive="#0d3242"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Mid Column Stem */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.85, 1.4, 16]} />
        <meshStandardMaterial color="#252430" roughness={0.7} />
      </mesh>

      {/* Upper Stone Basin */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[2.1, 1.3, 0.4, 24]} />
        <meshStandardMaterial color="#22212c" roughness={0.7} />
      </mesh>

      {/* Spire Finial Top */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <coneGeometry args={[0.3, 1.1, 12]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Fountain Water Glow */}
      <pointLight position={[0, 2.2, 0]} color="#70d6ff" intensity={1.1} distance={8} decay={2} />

      {/* Falling Water Droplet Particles */}
      <points ref={dropletsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dropPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#a8ecff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function RomanticGazebo({ position }) {
  return (
    <group position={position}>
      {/* Octagonal Stone Floor Base */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.2, 4.4, 0.5, 8]} />
        <meshStandardMaterial color="#201f28" roughness={0.75} />
      </mesh>

      {/* 8 Carved Marble Pillars */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const px = Math.cos(angle) * 3.6;
        const pz = Math.sin(angle) * 3.6;
        return (
          <group key={i} position={[px, 0.5, pz]}>
            <mesh position={[0, 2, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.2, 4.0, 12]} />
              <meshStandardMaterial color="#322f3d" roughness={0.6} />
            </mesh>
            <mesh position={[0, 4.1, 0]}>
              <boxGeometry args={[0.5, 0.2, 0.5]} />
              <meshStandardMaterial color="#c6a15b" metalness={0.7} />
            </mesh>
          </group>
        );
      })}

      {/* Domed Roof */}
      <mesh position={[0, 5.4, 0]} castShadow>
        <coneGeometry args={[4.4, 2.2, 8]} />
        <meshStandardMaterial color="#1a111a" roughness={0.65} />
      </mesh>
      {/* Gold Top Spire */}
      <mesh position={[0, 6.8, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial color="#c6a15b" metalness={0.9} />
      </mesh>

      {/* Romantic Wooden Bench inside Gazebo */}
      <group position={[0, 0.5, 1.4]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.2, 0.1, 0.65]} />
          <meshStandardMaterial color="#3a2216" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.9, 0.3]} castShadow>
          <boxGeometry args={[2.2, 0.8, 0.1]} />
          <meshStandardMaterial color="#3a2216" roughness={0.6} />
        </mesh>
      </group>

      {/* Hanging Warm Gazebo Lantern */}
      <pointLight position={[0, 4.2, 0]} color="#ffa844" intensity={1.4} distance={9} decay={2} />
    </group>
  );
}

function RoseBushCluster({ position }) {
  return (
    <group position={position}>
      {/* Green foliage bush */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.9, 8, 8]} />
        <meshStandardMaterial color="#0e2613" roughness={0.8} />
      </mesh>
      {/* Crimson rose blooms */}
      {[
        [-0.4, 0.85, 0.3],
        [0.4, 0.9, -0.2],
        [0, 1.1, 0.1],
        [-0.3, 0.6, -0.4],
        [0.5, 0.6, 0.3],
      ].map((bp, i) => (
        <mesh key={i} position={bp}>
          <sphereGeometry args={[0.13, 8, 8]} />
          <meshStandardMaterial
            color="#d6284e"
            emissive="#ff1e56"
            emissiveIntensity={0.3}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

function AncientStatue({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stone Pedestal */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[1.2, 1.6, 1.2]} />
        <meshStandardMaterial color="#1a1922" roughness={0.8} />
      </mesh>
      {/* Statue Figure (Classic Gothic marble silhouette) */}
      <mesh position={[0, 2.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, 1.8, 12]} />
        <meshStandardMaterial color="#32303c" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 3.4, 0]} castShadow>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial color="#32303c" roughness={0.5} />
      </mesh>
      {/* Wings */}
      <mesh position={[-0.45, 2.8, -0.2]} rotation={[0, 0.4, 0.6]}>
        <boxGeometry args={[0.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#2d2b38" roughness={0.6} />
      </mesh>
      <mesh position={[0.45, 2.8, -0.2]} rotation={[0, -0.4, -0.6]}>
        <boxGeometry args={[0.8, 1.4, 0.08]} />
        <meshStandardMaterial color="#2d2b38" roughness={0.6} />
      </mesh>
    </group>
  );
}
