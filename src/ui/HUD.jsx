import React from 'react';
import { useGameStore } from '../store/gameStore';
import { roomDefinitions, ROOMS } from '../data/rooms';
import InteractionPrompt from '../components/InteractionPrompt';
import { Volume2, VolumeX, Menu, Sparkles } from 'lucide-react';

export default function HUD() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const activeModal = useGameStore((s) => s.activeModal);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const togglePauseMenu = useGameStore((s) => s.togglePauseMenu);
  const ballroomDanceActive = useGameStore((s) => s.ballroomDanceActive);
  const discoveredSecrets = useGameStore((s) => s.discoveredSecrets);
  const isTouchDevice = useGameStore((s) => s.isTouchDevice);

  // If in title screen or modals, hide HUD elements
  if (currentRoom === ROOMS.EXTERIOR) return null;

  const room = roomDefinitions[currentRoom];

  return (
    <>
      {/* Center FPS Crosshair Reticle */}
      {!activeModal && !isTransitioning && (
        <div className={`fps-crosshair ${interactionPrompt ? 'active' : ''}`} />
      )}

      {/* Top Bar Controls */}
      <div className="top-bar-controls hud-interactive">
        {/* Secrets Counter Badge */}
        <div
          style={{
            background: 'rgba(22, 5, 11, 0.75)',
            border: '1px solid rgba(198, 161, 91, 0.35)',
            color: '#dfbe7a',
            padding: '8px 14px',
            borderRadius: 4,
            fontFamily: 'Cinzel, serif',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Sparkles size={14} />
          <span>{discoveredSecrets.length} / 5 Secrets</span>
        </div>

        {/* Audio Mute/Unmute */}
        <button
          className="control-btn"
          onClick={toggleMute}
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={15} color="#ff6b6b" /> : <Volume2 size={15} />}
        </button>

        {/* Menu / Map Button */}
        <button className="control-btn" onClick={togglePauseMenu} title="Pause / Map [ESC]">
          <Menu size={15} />
          <span>REALM</span>
        </button>
      </div>

      {/* Top Center Room Banner */}
      {!activeModal && !isTransitioning && room && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 40,
            animation: 'fadeInDown 1s ease',
          }}
        >
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              color: '#c6a15b',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            {room.subtitle}
          </div>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.35rem',
              letterSpacing: '0.18em',
              color: '#f4ede1',
              fontWeight: 600,
              textShadow: '0 2px 14px rgba(198, 161, 91, 0.4)',
            }}
          >
            {room.title}
          </div>
        </div>
      )}

      {/* Special Ballroom Dance Romantic Quote Banner */}
      {ballroomDanceActive && !activeModal && (
        <div
          style={{
            position: 'fixed',
            top: '25%',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 700,
            width: '90%',
            textAlign: 'center',
            background: 'radial-gradient(ellipse at center, rgba(38,10,20,0.85) 0%, rgba(14,6,11,0.5) 80%)',
            borderTop: '1px solid #dfbe7a',
            borderBottom: '1px solid #dfbe7a',
            padding: '24px 30px',
            pointerEvents: 'none',
            zIndex: 60,
            animation: 'fadeIn 1.2s ease',
          }}
        >
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.2rem, 3.2vw, 1.8rem)',
              color: '#dfbe7a',
              lineHeight: 1.5,
              textShadow: '0 0 20px rgba(223, 190, 122, 0.6)',
            }}
          >
            "If I could choose one place to stay forever, it would be wherever you are."
          </p>
        </div>
      )}

      {/* Interaction Prompt Pill */}
      <InteractionPrompt />

      {/* Bottom Exploration Controls Hint (Desktop only) */}
      {!activeModal && !isTouchDevice && (
        <div className="controls-hint">
          <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> Move</span>
          <span><kbd>SHIFT</kbd> Run</span>
          <span><kbd>MOUSE</kbd> Look</span>
          <span><kbd>E</kbd> Interact</span>
          <span><kbd>ESC</kbd> Realm Menu</span>
        </div>
      )}
    </>
  );
}
