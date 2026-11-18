import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen({ onLoaded }) {
  const { progress, active, total } = useProgress();
  const [fadeComplete, setFadeComplete] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth progress simulation that guarantees completion
    const startTime = Date.now();
    const duration = 1200; // 1.2s smooth cinematic intro

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const simulated = Math.min(100, Math.floor((elapsed / duration) * 100));
      
      // Use real progress if active and higher, else use smooth simulation
      const target = total > 0 && active ? Math.max(simulated, progress) : simulated;

      setDisplayProgress((prev) => {
        const next = Math.max(prev, target);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeComplete(true);
            if (onLoaded) onLoaded();
          }, 450);
        }
        return next;
      });
    }, 30);

    // Hard fallback timeout: can never stay stuck beyond 2 seconds
    const fallback = setTimeout(() => {
      setDisplayProgress(100);
      setTimeout(() => {
        setFadeComplete(true);
        if (onLoaded) onLoaded();
      }, 300);
    }, 1800);

    return () => {
      clearInterval(timer);
      clearTimeout(fallback);
    };
  }, [progress, active, total, onLoaded]);

  if (fadeComplete) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#09090c',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: displayProgress >= 100 ? 0 : 1,
        pointerEvents: displayProgress >= 100 ? 'none' : 'all',
      }}
    >
      {/* Gothic Ornament Shield */}
      <div style={{ position: 'relative', width: 90, height: 90, marginBottom: 24 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '2px solid rgba(198, 161, 91, 0.4)',
            transform: 'rotate(45deg)',
            animation: 'promptPulse 2.5s infinite ease-in-out',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 8,
            border: '1px solid rgba(223, 190, 122, 0.7)',
            transform: 'rotate(45deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            color: '#d6284e',
            filter: 'drop-shadow(0 0 14px rgba(214, 40, 78, 0.7))',
          }}
        >
          🌹
        </div>
      </div>

      <h1
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.4rem',
          letterSpacing: '0.28em',
          color: '#e8dcc8',
          textTransform: 'uppercase',
          marginBottom: 8,
          textAlign: 'center',
          textShadow: '0 0 20px rgba(198, 161, 91, 0.4)',
        }}
      >
        The Castle of Our Forever
      </h1>

      <p
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontSize: '1.15rem',
          color: '#c6a15b',
          marginBottom: 28,
          textAlign: 'center',
        }}
      >
        "Where love reigns eternal..."
      </p>

      {/* Progress Bar Frame */}
      <div
        style={{
          width: 260,
          height: 7,
          background: 'rgba(22, 5, 11, 0.9)',
          border: '1px solid rgba(198, 161, 91, 0.6)',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 0 15px rgba(0,0,0,0.8), inset 0 0 8px rgba(0,0,0,0.9)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${displayProgress}%`,
            background: 'linear-gradient(90deg, #8c6d32, #c6a15b, #dfbe7a)',
            transition: 'width 0.15s ease',
            boxShadow: '0 0 10px rgba(223, 190, 122, 0.8)',
          }}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          fontFamily: 'Cinzel, serif',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          color: '#a89c8a',
        }}
      >
        {Math.round(displayProgress)}% PREPARED
      </div>

      {/* Quick enter skip fallback */}
      <button
        onClick={() => {
          setDisplayProgress(100);
          setFadeComplete(true);
          if (onLoaded) onLoaded();
        }}
        style={{
          marginTop: 22,
          background: 'none',
          border: 'none',
          color: 'rgba(198, 161, 91, 0.5)',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        Click to Enter Immediately ✦
      </button>
    </div>
  );
}
