import React from 'react';
import { useGameStore } from '../store/gameStore';

export default function RoomTransition() {
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const transitionMessage = useGameStore((s) => s.transitionMessage);

  if (!isTransitioning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#070509',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.4s ease forwards',
        pointerEvents: 'all',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 500, padding: 24 }}>
        <div
          style={{
            color: '#c6a15b',
            fontSize: '1.8rem',
            marginBottom: 16,
            animation: 'promptPulse 1.5s infinite ease-in-out',
          }}
        >
          ✦ 🏰 ✦
        </div>
        <div
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '1.25rem',
            letterSpacing: '0.25em',
            color: '#e8dcc8',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}
        >
          {transitionMessage || 'Entering Chamber...'}
        </div>
        <div
          style={{
            width: 140,
            height: 1.5,
            background: 'linear-gradient(90deg, transparent, #c6a15b, transparent)',
            margin: '0 auto',
          }}
        />
      </div>
    </div>
  );
}
