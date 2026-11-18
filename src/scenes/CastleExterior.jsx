import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';
import { createGothicStoneTexture, createWoodPlankTexture } from '../utils/textureGenerator';

export default function CastleExterior() {
  const gateOpen = useGameStore((s) => s.gateOpen);
  const leftGateRef = useRef();
  const rightGateRef = useRef();
  const batsGroupRef = useRef();
  const fogParticlesRef = useRef();
  const magicalSparksRef = useRef();
  const spireHaloRef = useRef();
  const interiorLightBeamRef = useRef();

  const stoneTexture = useMemo(() => createGothicStoneTexture(), []);
  const woodTexture = useMemo(() => createWoodPlankTexture(), []);

  // Fog particles data
  const particleCount = 140;
  const particlePositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 65;
      pos[i * 3 + 1] = Math.random() * 3.5 + 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 55;
    }
    return pos;
  }, []);

  // Golden magical stardust embers drifting in front of the castle
  const sparkCount = 120;
  const sparkPositions = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 36;
      pos[i * 3 + 1] = Math.random() * 22 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 + 5;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gate opening animation
    if (leftGateRef.current && rightGateRef.current) {
      const targetAngle = gateOpen ? Math.PI / 2.2 : 0;
      leftGateRef.current.rotation.y = THREE.MathUtils.lerp(
        leftGateRef.current.rotation.y,
        -targetAngle,
        delta * 1.5
      );
      rightGateRef.current.rotation.y = THREE.MathUtils.lerp(
        rightGateRef.current.rotation.y,
        targetAngle,
        delta * 1.5
      );
    }

    // Glowing interior beam when gate opens
    if (interiorLightBeamRef.current) {
      const targetOpacity = gateOpen ? 0.75 : 0.0;
      interiorLightBeamRef.current.material.opacity = THREE.MathUtils.lerp(
        interiorLightBeamRef.current.material.opacity,
        targetOpacity,
        delta * 2
      );
    }

    // Flying bats / birds animation
    if (batsGroupRef.current) {
      batsGroupRef.current.rotation.y += delta * 0.25;
    }

    // Spire halo pulsing
    if (spireHaloRef.current) {
      spireHaloRef.current.rotation.z += delta * 0.3;
      spireHaloRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
    }

    // Mist particle drifting
    if (fogParticlesRef.current) {
      const positions = fogParticlesRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += delta * 0.7;
        if (positions[i * 3] > 32) positions[i * 3] = -32;
      }
      fogParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Golden sparks floating upward
    if (magicalSparksRef.current) {
      const positions = magicalSparksRef.current.geometry.attributes.position.array;
      for (let i = 0; i < sparkCount; i++) {
        positions[i * 3 + 1] += delta * 0.9;
        positions[i * 3] += Math.sin(t + i) * 0.01;
        if (positions[i * 3 + 1] > 26) {
          positions[i * 3 + 1] = 1;
        }
      }
      magicalSparksRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Night Sky Moonlight */}
      <directionalLight
        position={[25, 45, 20]}
        intensity={1.1}
        color="#c8d6ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.45} color="#251636" />

      {/* Radiant Golden Uplighting on Castle Facade */}
      <pointLight position={[0, 3, -1]} color="#ffb042" intensity={3.5} distance={22} decay={1.8} />
      <pointLight position={[-11, 2, 4]} color="#ffa834" intensity={2.8} distance={18} decay={1.8} />
      <pointLight position={[11, 2, 4]} color="#ffa834" intensity={2.8} distance={18} decay={1.8} />
      <pointLight position={[0, 14, -8]} color="#ffcf70" intensity={3.0} distance={25} decay={1.6} />

      {/* Luminous Giant Full Moon with Golden Aura */}
      <group position={[35, 44, -50]}>
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#fff6e3" />
        </mesh>
        {/* Soft Moon Glow Shell */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color="#dfbe7a" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
        </mesh>
        <pointLight color="#f5e7cc" intensity={2.2} distance={140} decay={1.4} />
      </group>

      {/* Mountain Backdrops */}
      <MountainRange />

      {/* Distant Flying Bats Silhouettes */}
      <group ref={batsGroupRef} position={[0, 24, -10]}>
        <BatModel position={[14, 0, 0]} />
        <BatModel position={[-16, 2, 8]} />
        <BatModel position={[8, -3, -12]} />
        <BatModel position={[-10, 4, -15]} />
      </group>

      {/* Ground Stone Courtyard & Mountain Grass */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 130]} />
        <meshStandardMaterial color="#100e16" roughness={0.88} map={stoneTexture} />
      </mesh>

      {/* Central Illuminated Stone Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]} receiveShadow>
        <planeGeometry args={[7.5, 42]} />
        <meshStandardMaterial color="#1f1c28" roughness={0.75} />
      </mesh>

      {/* Pathway Glowing Lantern Posts */}
      {[-4.2, 4.2].map((x) =>
        [24, 17, 10, 3].map((z) => (
          <LanternPost key={`${x}-${z}`} position={[x, 0, z]} />
        ))
      )}

      {/* BLAZING BRAZIERS FLANKING CASTLE ENTRANCE */}
      <CastleBrazier position={[-5.8, 0, 2]} />
      <CastleBrazier position={[5.8, 0, 2]} />

      {/* THE GLOWING GOTHIC CASTLE ARCHITECTURE */}
      <group position={[0, 0, -6]}>
        {/* Central Gatehouse Wall */}
        <mesh position={[0, 6, 0]} castShadow receiveShadow>
          <boxGeometry args={[18, 12, 4]} />
          <meshStandardMaterial map={stoneTexture} color="#211e2b" roughness={0.8} />
        </mesh>

        {/* Arch Gate Opening Cutout */}
        <mesh position={[-5, 3.5, 0.2]} castShadow>
          <boxGeometry args={[2, 7, 4.4]} />
          <meshStandardMaterial color="#16141d" roughness={0.8} />
        </mesh>
        <mesh position={[5, 3.5, 0.2]} castShadow>
          <boxGeometry args={[2, 7, 4.4]} />
          <meshStandardMaterial color="#16141d" roughness={0.8} />
        </mesh>
        <mesh position={[0, 7.5, 0.2]} castShadow>
          <boxGeometry args={[12, 2.5, 4.4]} />
          <meshStandardMaterial color="#16141d" roughness={0.8} />
        </mesh>

        {/* Golden Glowing Arch Border (Gothic Portal Glow) */}
        <mesh position={[0, 7.1, 2.3]}>
          <boxGeometry args={[8.4, 0.22, 0.12]} />
          <meshStandardMaterial
            color="#dfbe7a"
            emissive="#c6a15b"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[-4.1, 3.5, 2.3]}>
          <boxGeometry args={[0.22, 7.2, 0.12]} />
          <meshStandardMaterial
            color="#dfbe7a"
            emissive="#c6a15b"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[4.1, 3.5, 2.3]}>
          <boxGeometry args={[0.22, 7.2, 0.12]} />
          <meshStandardMaterial
            color="#dfbe7a"
            emissive="#c6a15b"
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Glowing Gatehouse Arched Stained-Glass Windows */}
        {[-2.8, 2.8].map((wx, i) => (
          <group key={i} position={[wx, 7.8, 2.1]}>
            <mesh>
              <boxGeometry args={[1.2, 2.2, 0.1]} />
              <meshStandardMaterial
                color="#ff8c26"
                emissive="#ff7700"
                emissiveIntensity={1.4}
                roughness={0.1}
              />
            </mesh>
            <pointLight color="#ffa844" intensity={1.5} distance={6} decay={2} />
          </group>
        ))}

        {/* Battlements along gatehouse top with glowing torch lights */}
        {[-7, -4.5, -2, 0.5, 3, 5.5, 8].map((bx, i) => (
          <group key={i} position={[bx, 12.6, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.4, 1.2, 4.2]} />
              <meshStandardMaterial color="#211e2a" roughness={0.85} />
            </mesh>
            {/* Small glowing torch on top of battlements */}
            {i % 2 === 0 && (
              <pointLight position={[0, 1.2, 2.1]} color="#ffa336" intensity={0.9} distance={5} decay={2} />
            )}
          </group>
        ))}

        {/* Radiant Royal Crest / Shield above gate */}
        <group position={[0, 9.6, 2.15]}>
          <mesh>
            <boxGeometry args={[2.4, 3.0, 0.2]} />
            <meshStandardMaterial
              color="#260a14"
              emissive="#3d0d1e"
              emissiveIntensity={0.5}
              metalness={0.6}
            />
          </mesh>
          <mesh position={[0, 0, 0.12]}>
            <torusGeometry args={[0.75, 0.09, 8, 24]} />
            <meshStandardMaterial
              color="#dfbe7a"
              emissive="#c6a15b"
              emissiveIntensity={0.9}
              metalness={0.9}
            />
          </mesh>
          <mesh position={[0, 0, 0.16]}>
            <coneGeometry args={[0.42, 0.65, 3]} />
            <meshStandardMaterial
              color="#dfbe7a"
              emissive="#dfbe7a"
              emissiveIntensity={1.2}
              metalness={0.9}
            />
          </mesh>
          <pointLight position={[0, 0, 0.6]} color="#ffe082" intensity={1.8} distance={7} decay={2} />
        </group>

        {/* Glowing Left Tower */}
        <GlowingCastleTower position={[-11, 0, 0]} height={23} radius={3.9} />
        {/* Glowing Right Tower */}
        <GlowingCastleTower position={[11, 0, 0]} height={23} radius={3.9} />

        {/* High Central Spire (The Forever Chamber Observatory Tower in backdrop) */}
        <GlowingCastleTower position={[0, 8, -14]} height={36} radius={4.6} isSpire spireHaloRef={spireHaloRef} />

        {/* Back Castle Wings with Warm Glowing Windows */}
        <CastleWing position={[-18, 7, -6]} />
        <CastleWing position={[18, 7, -6]} />

        {/* RADIANT GOLDEN LIGHT BEAM SHOOTING OUT FROM THE OPEN GATE */}
        <mesh ref={interiorLightBeamRef} position={[0, 3.4, 4.5]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[3.8, 9, 16, 1, true]} />
          <meshBasicMaterial
            color="#ffc168"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* LARGE ANIMATED CASTLE GATES */}
        {/* Left Gate Leaf (pivots at x = -3.8) */}
        <group position={[-3.8, 0, 0.5]}>
          <group ref={leftGateRef} position={[0, 0, 0]}>
            <mesh position={[1.9, 3.4, 0]} castShadow>
              <boxGeometry args={[3.8, 6.8, 0.25]} />
              <meshStandardMaterial
                map={woodTexture}
                color="#331c14"
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            {/* Iron Bands & Gold Studs */}
            <mesh position={[1.9, 5.2, 0.15]}>
              <boxGeometry args={[3.7, 0.18, 0.08]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[1.9, 1.6, 0.15]}>
              <boxGeometry args={[3.7, 0.18, 0.08]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.9} roughness={0.3} />
            </mesh>
            {[0.8, 1.8, 2.8].map((sx, idx) => (
              <mesh key={idx} position={[sx, 3.4, 0.16]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial
                  color="#dfbe7a"
                  emissive="#c6a15b"
                  emissiveIntensity={0.6}
                  metalness={0.9}
                />
              </mesh>
            ))}
          </group>
        </group>

        {/* Right Gate Leaf (pivots at x = 3.8) */}
        <group position={[3.8, 0, 0.5]}>
          <group ref={rightGateRef} position={[0, 0, 0]}>
            <mesh position={[-1.9, 3.4, 0]} castShadow>
              <boxGeometry args={[3.8, 6.8, 0.25]} />
              <meshStandardMaterial
                map={woodTexture}
                color="#331c14"
                roughness={0.7}
                metalness={0.3}
              />
            </mesh>
            <mesh position={[-1.9, 5.2, 0.15]}>
              <boxGeometry args={[3.7, 0.18, 0.08]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.9} roughness={0.3} />
            </mesh>
            <mesh position={[-1.9, 1.6, 0.15]}>
              <boxGeometry args={[3.7, 0.18, 0.08]} />
              <meshStandardMaterial color="#0c0c0e" metalness={0.9} roughness={0.3} />
            </mesh>
            {[-0.8, -1.8, -2.8].map((sx, idx) => (
              <mesh key={idx} position={[sx, 3.4, 0.16]}>
                <sphereGeometry args={[0.09, 8, 8]} />
                <meshStandardMaterial
                  color="#dfbe7a"
                  emissive="#c6a15b"
                  emissiveIntensity={0.6}
                  metalness={0.9}
                />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* Atmospheric Mist Particles on ground */}
      <points ref={fogParticlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={3.2}
          color="#90a2c0"
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Floating Golden Sparks / Stardust Embers */}
      <points ref={magicalSparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.28}
          color="#ffd57a"
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function GlowingCastleTower({ position, height, radius, isSpire = false, spireHaloRef }) {
  return (
    <group position={position}>
      {/* Tower cylinder */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.15, height, 16]} />
        <meshStandardMaterial color="#1e1b29" roughness={0.8} />
      </mesh>

      {/* Balcony / Corbel rings */}
      <mesh position={[0, height - 0.2, 0]} castShadow>
        <cylinderGeometry args={[radius * 1.25, radius, 1.2, 16]} />
        <meshStandardMaterial color="#282536" roughness={0.75} />
      </mesh>

      {/* Conical Gothic Steeple Roof */}
      <mesh position={[0, height + (isSpire ? 6.8 : 4.6), 0]} castShadow>
        <coneGeometry args={[radius * 1.28, isSpire ? 13.6 : 9.2, 16]} />
        <meshStandardMaterial color="#1c0919" roughness={0.65} />
      </mesh>

      {/* Radiant Gold Finial on roof tip */}
      <mesh position={[0, height + (isSpire ? 13.8 : 9.5), 0]}>
        <sphereGeometry args={[0.38, 16, 16]} />
        <meshStandardMaterial
          color="#dfbe7a"
          emissive="#ffd77a"
          emissiveIntensity={1.2}
          metalness={0.9}
        />
      </mesh>
      <pointLight
        position={[0, height + (isSpire ? 14.2 : 9.8), 0]}
        color="#ffd77a"
        intensity={1.2}
        distance={10}
        decay={2}
      />

      {/* Magical Glowing Light Ring around the High Spire */}
      {isSpire && (
        <mesh ref={spireHaloRef} position={[0, height + 4.5, 0]} rotation={[Math.PI / 2.8, 0, 0]}>
          <ringGeometry args={[radius * 1.45, radius * 1.75, 32]} />
          <meshBasicMaterial
            color="#dfbe7a"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Multiple Tiers of Warm Glowing Stained Glass Windows */}
      {[height * 0.28, height * 0.52, height * 0.74, height * 0.9].map((y, idx) => (
        <group key={idx}>
          {/* Front window */}
          <group position={[0, y, radius + 0.08]}>
            <mesh>
              <boxGeometry args={[0.85, 1.6, 0.12]} />
              <meshStandardMaterial
                color="#ff9933"
                emissive="#ff7700"
                emissiveIntensity={1.6}
                roughness={0.1}
              />
            </mesh>
            <pointLight color="#ffa844" intensity={1.1} distance={6} decay={2} />
          </group>
          {/* Side angled windows */}
          <group
            position={[Math.cos(0.9) * (radius + 0.08), y, Math.sin(0.9) * (radius + 0.08)]}
            rotation={[0, -0.9, 0]}
          >
            <mesh>
              <boxGeometry args={[0.75, 1.4, 0.12]} />
              <meshStandardMaterial
                color="#ff9933"
                emissive="#ff7700"
                emissiveIntensity={1.4}
                roughness={0.1}
              />
            </mesh>
          </group>
          <group
            position={[Math.cos(-0.9) * (radius + 0.08), y, Math.sin(-0.9) * (radius + 0.08)]}
            rotation={[0, 0.9, 0]}
          >
            <mesh>
              <boxGeometry args={[0.75, 1.4, 0.12]} />
              <meshStandardMaterial
                color="#ff9933"
                emissive="#ff7700"
                emissiveIntensity={1.4}
                roughness={0.1}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function CastleWing({ position }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[16, 14, 8]} />
        <meshStandardMaterial color="#1a1824" roughness={0.88} />
      </mesh>
      {/* Rows of warm glowing castle windows */}
      {[-5, 0, 5].map((wx, i) =>
        [-3, 2].map((wy, j) => (
          <group key={`${i}-${j}`} position={[wx, wy, 4.08]}>
            <mesh>
              <boxGeometry args={[1.0, 1.8, 0.1]} />
              <meshStandardMaterial
                color="#ff8c26"
                emissive="#ff6e00"
                emissiveIntensity={1.3}
              />
            </mesh>
            <pointLight color="#ffa844" intensity={0.6} distance={4.5} decay={2} />
          </group>
        ))
      )}
    </group>
  );
}

function CastleBrazier({ position }) {
  const flameLightRef = useRef();

  useFrame(({ clock }) => {
    if (flameLightRef.current) {
      const t = clock.getElapsedTime() * 10;
      flameLightRef.current.intensity = 2.4 + Math.sin(t) * 0.4 + Math.sin(t * 2.3) * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.65, 1.2, 8]} />
        <meshStandardMaterial color="#1a1822" roughness={0.8} />
      </mesh>
      {/* Wrought Iron Fire Bowl */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.75, 0.4, 0.5, 8]} />
        <meshStandardMaterial color="#0e0e11" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Blazing Flame Core */}
      <mesh position={[0, 1.8, 0]}>
        <coneGeometry args={[0.55, 1.2, 8]} />
        <meshBasicMaterial color="#ff7a18" />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <coneGeometry args={[0.35, 0.9, 8]} />
        <meshBasicMaterial color="#ffea75" />
      </mesh>
      {/* Glowing Fire Halo */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.75, 12, 12]} />
        <meshBasicMaterial
          color="#ff8c26"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Dynamic Flickering Firelight */}
      <pointLight
        ref={flameLightRef}
        position={[0, 2.1, 0]}
        color="#ff7f1a"
        intensity={2.8}
        distance={12}
        decay={1.8}
      />
    </group>
  );
}

function LanternPost({ position }) {
  return (
    <group position={position}>
      {/* Stone Pedestal Base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.7, 0.8, 0.7]} />
        <meshStandardMaterial color="#1c1b22" roughness={0.85} />
      </mesh>
      {/* Iron Pole */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.09, 2.2, 8]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Lantern Lamp */}
      <group position={[0, 3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.45, 0.7, 0.45]} />
          <meshStandardMaterial color="#0a0a0c" metalness={0.9} roughness={0.2} wireframe />
        </mesh>
        {/* Radiant Flame Core */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 0.32, 8]} />
          <meshBasicMaterial color="#ffe8aa" />
        </mesh>
        {/* Soft Golden Halo */}
        <mesh>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshBasicMaterial
            color="#ffbb44"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <pointLight color="#ffab3d" intensity={1.8} distance={9.0} decay={1.8} />
      </group>
    </group>
  );
}

function BatModel({ position }) {
  const batRef = useRef();
  useFrame(({ clock }) => {
    if (batRef.current) {
      const t = clock.getElapsedTime() * 12;
      batRef.current.position.y += Math.sin(t) * 0.015;
    }
  });

  return (
    <group ref={batRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 6, 6]} />
        <meshBasicMaterial color="#050508" />
      </mesh>
      <mesh position={[-0.35, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.55, 0.05, 0.2]} />
        <meshBasicMaterial color="#050508" />
      </mesh>
      <mesh position={[0.35, 0.05, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.55, 0.05, 0.2]} />
        <meshBasicMaterial color="#050508" />
      </mesh>
    </group>
  );
}

function MountainRange() {
  return (
    <group position={[0, -2, -60]}>
      {[-45, -25, 0, 25, 45].map((x, i) => (
        <mesh key={i} position={[x, i % 2 === 0 ? 18 : 26, (i % 3) * -5]}>
          <coneGeometry args={[26, 42, 5]} />
          <meshStandardMaterial color="#080710" roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}
