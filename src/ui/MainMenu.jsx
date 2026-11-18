import React from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../utils/audioSystem';

export default function MainMenu() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const gateOpen = useGameStore((s) => s.gateOpen);
  const enterCastle = useGameStore((s) => s.enterCastle);
  const initAudio = useGameStore((s) => s.initAudio);

  if (currentRoom !== 'exterior') return null;

  const handleEnter = () => {
    // Start audio on user gesture
    soundManager.init();
    soundManager.resume();
    initAudio();
    enterCastle();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'clamp(20px, 4vh, 60px) 16px',
        pointerEvents: gateOpen ? 'none' : 'auto',
        transition: 'opacity 1s ease',
        opacity: gateOpen ? 0 : 1,
        overflowY: 'auto',
      }}
    >
      {/* Top Royal Emblem with Princess Cameo */}
      <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '16px' }}>
        <div
          style={{
            width: 76,
            height: 76,
            margin: '0 auto 12px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid #dfbe7a',
            boxShadow: '0 0 25px rgba(223, 190, 122, 0.6), inset 0 0 10px rgba(0,0,0,0.8)',
            position: 'relative',
          }}
        >
          <img
            src="/images/lovee-Cover.jpg"
            alt="My Princess"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.85rem',
            letterSpacing: '0.45em',
            color: '#c6a15b',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          ✦ Royal Gothic Fantasy Experience ✦
        </div>
        <div
          style={{
            width: 80,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #c6a15b, transparent)',
            margin: '0 auto',
          }}
        />
      </div>

      {/* Center Cinematic Romantic Texts */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: 820,
          width: '94vw',
          background: 'radial-gradient(ellipse at center, rgba(14,6,11,0.75) 0%, rgba(10,5,8,0) 80%)',
          padding: 'clamp(20px, 3.5vh, 40px) 16px',
          borderRadius: 8,
          marginBottom: 'auto',
        }}
      >
        <p
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1.2rem, 3.2vw, 1.85rem)',
            lineHeight: 1.6,
            color: '#dfbe7a',
            marginBottom: 20,
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.9), 0 0 24px rgba(198, 161, 91, 0.4)',
          }}
        >
          "Somewhere between dreams and forever, a kingdom was waiting for you."
        </p>

        <h1
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(2.4rem, 6.5vw, 4.4rem)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#e8dcc8',
            textTransform: 'uppercase',
            marginBottom: 36,
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 40px rgba(223, 190, 122, 0.5)',
          }}
        >
          Welcome, My Princess
        </h1>

        {/* Enter The Castle Button */}
        <div>
          <button className="gold-btn" onClick={handleEnter}>
            Enter The Castle
          </button>
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.72rem',
          letterSpacing: '0.25em',
          color: '#a89a88',
        }}
      >
        FOR MY FOREVER PRINCESS · WITH ALL MY LOVE
      </div>
    </div>
  );
}
