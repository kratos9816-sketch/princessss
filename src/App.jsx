import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGameStore } from './store/gameStore';
import { ROOMS, roomDefinitions } from './data/rooms';

// Components
import Player from './components/Player';
import AudioManager from './components/AudioManager';
import LoadingScreen from './components/LoadingScreen';
import RoomTransition from './components/RoomTransition';
import TouchControls from './components/TouchControls';

// Scenes
import CastleExterior from './scenes/CastleExterior';
import GrandHall from './scenes/GrandHall';
import MemoryChamber from './scenes/MemoryChamber';
import Ballroom from './scenes/Ballroom';
import SecretLibrary from './scenes/SecretLibrary';
import EnchantedGarden from './scenes/EnchantedGarden';
import ForeverChamber from './scenes/ForeverChamber';

// UI
import MainMenu from './ui/MainMenu';
import HUD from './ui/HUD';
import MemoryViewer from './ui/MemoryViewer';
import BookViewer from './ui/BookViewer';
import SecretViewer from './ui/SecretViewer';
import LoveLetter from './ui/LoveLetter';
import PauseMenu from './ui/PauseMenu';

export default function App() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const togglePauseMenu = useGameStore((s) => s.togglePauseMenu);
  const isTransitioning = useGameStore((s) => s.isTransitioning);

  const canvasRef = useRef();

  // Escape key global listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape') {
        if (activeModal && activeModal !== 'pause') {
          closeModal();
        } else if (currentRoom !== ROOMS.EXTERIOR) {
          togglePauseMenu();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, currentRoom, closeModal, togglePauseMenu]);

  // Click on canvas to engage pointer lock
  const handleCanvasClick = (e) => {
    if (currentRoom === ROOMS.EXTERIOR || activeModal || isTransitioning) return;
    const dom = canvasRef.current;
    if (dom && document.pointerLockElement !== dom) {
      dom.requestPointerLock?.();
    }
  };

  const roomDef = roomDefinitions[currentRoom] || roomDefinitions[ROOMS.EXTERIOR];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div className="canvas-container" onClick={handleCanvasClick}>
        <Canvas
          ref={canvasRef}
          shadows
          dpr={[1, 1.75]}
          camera={{ fov: 68, near: 0.1, far: 1000, position: [0, 1.7, 24] }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          {/* Dynamic Gothic Room Fog & Color */}
          <color attach="background" args={[roomDef.fogColor]} />
          <fog attach="fog" args={[roomDef.fogColor, roomDef.fogNear, roomDef.fogFar]} />

          <Suspense fallback={null}>
            {/* RENDER CURRENT ACTIVE SCENE */}
            {currentRoom === ROOMS.EXTERIOR && <CastleExterior />}

            {currentRoom === ROOMS.GRAND_HALL && (
              <>
                <GrandHall />
                <Player
                  roomBounds={{ minX: -11.5, maxX: 11.5, minZ: -16, maxZ: 16 }}
                  obstacles={[
                    { minX: -9.5, maxX: -6.5, minZ: -11.5, maxZ: -8.5 }, // Pillar L1
                    { minX: 6.5, maxX: 9.5, minZ: -11.5, maxZ: -8.5 },   // Pillar R1
                    { minX: -9.5, maxX: -6.5, minZ: 2.5, maxZ: 5.5 },     // Pillar L2
                    { minX: 6.5, maxX: 9.5, minZ: 2.5, maxZ: 5.5 },       // Pillar R2
                  ]}
                />
              </>
            )}

            {currentRoom === ROOMS.MEMORY_CHAMBER && (
              <>
                <MemoryChamber />
                <Player
                  roomBounds={{ minX: -8.5, maxX: 8.5, minZ: -8.5, maxZ: 8.5 }}
                  obstacles={[
                    { minX: -2.8, maxX: 2.8, minZ: -9.5, maxZ: -7.5 },  // Fireplace
                    { minX: -1.5, maxX: 1.5, minZ: -1.0, maxZ: 1.0 },   // Coffee table
                    { minX: -2.0, maxX: 2.0, minZ: 1.8, maxZ: 3.4 },    // Couch
                  ]}
                />
              </>
            )}

            {currentRoom === ROOMS.BALLROOM && (
              <>
                <Ballroom />
                <Player
                  roomBounds={{ minX: -11.0, maxX: 11.0, minZ: -13.0, maxZ: 13.0 }}
                  obstacles={[]}
                />
              </>
            )}

            {currentRoom === ROOMS.SECRET_LIBRARY && (
              <>
                <SecretLibrary />
                <Player
                  roomBounds={{ minX: -7.2, maxX: 7.2, minZ: -9.0, maxZ: 9.0 }}
                  obstacles={[
                    { minX: -2.0, maxX: 2.0, minZ: -1.2, maxZ: 1.2 }, // Study Desk
                    { minX: -2.5, maxX: 2.5, minZ: -10.2, maxZ: -8.5 }, // Fireplace
                  ]}
                />
              </>
            )}

            {currentRoom === ROOMS.ENCHANTED_GARDEN && (
              <>
                <EnchantedGarden />
                <Player
                  roomBounds={{ minX: -16.5, maxX: 16.5, minZ: -16.5, maxZ: 16.5 }}
                  obstacles={[
                    { minX: -4.5, maxX: 4.5, minZ: -4.5, maxZ: 4.5 },   // Fountain basin
                    { minX: -4.5, maxX: 4.5, minZ: 8.5, maxZ: 17.0 },   // Gazebo
                  ]}
                />
              </>
            )}

            {currentRoom === ROOMS.FOREVER_CHAMBER && (
              <>
                <ForeverChamber />
                <Player
                  roomBounds={{ minX: -10.5, maxX: 10.5, minZ: -10.5, maxZ: 10.5 }}
                  obstacles={[
                    { minX: -2.5, maxX: 2.5, minZ: -2.5, maxZ: 2.5 }, // Central Altar
                  ]}
                />
              </>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* Atmospheric Overlays */}
      <div className="vignette-overlay" />
      <div className="film-grain" />

      {/* Audio Engine Manager */}
      <AudioManager />

      {/* Loading Screen */}
      <LoadingScreen />

      {/* Room Transition Curtain */}
      <RoomTransition />

      {/* UI LAYERS */}
      <TouchControls />
      <MainMenu />
      <HUD />
      <MemoryViewer />
      <BookViewer />
      <SecretViewer />
      <LoveLetter />
      <PauseMenu />
    </div>
  );
}
