import React, { useRef, useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { Compass, Sparkles } from 'lucide-react';

export default function TouchControls() {
  const currentRoom = useGameStore((s) => s.currentRoom);
  const activeModal = useGameStore((s) => s.activeModal);
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const interactionPrompt = useGameStore((s) => s.interactionPrompt);
  const setIsTouchDevice = useGameStore((s) => s.setIsTouchDevice);
  const isTouchDevice = useGameStore((s) => s.isTouchDevice);
  const setTouchMoveVector = useGameStore((s) => s.setTouchMoveVector);
  const setTouchLookDelta = useGameStore((s) => s.setTouchLookDelta);
  const togglePauseMenu = useGameStore((s) => s.togglePauseMenu);

  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });

  const joystickTouchId = useRef(null);
  const joystickCenter = useRef({ x: 0, y: 0 });
  const lookTouchId = useRef(null);
  const lastLookPos = useRef({ x: 0, y: 0 });

  // Detect Touch screen capability
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      setIsTouchDevice(true);
    }
  }, [setIsTouchDevice]);

  // Don't render touch controls if not a touch device, or on title screen, or when modal is open
  if (!isTouchDevice || currentRoom === 'exterior' || activeModal || isTransitioning) {
    return null;
  }

  // --- VIRTUAL JOYSTICK (LEFT SIDE) ---
  const handleJoystickStart = (e) => {
    e.stopPropagation();
    const touch = e.changedTouches[0];
    joystickTouchId.current = touch.identifier;

    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    joystickCenter.current = { x: cx, y: cy };

    setJoystickActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const updateJoystick = (clientX, clientY) => {
    const dx = clientX - joystickCenter.current.x;
    const dy = clientY - joystickCenter.current.y;
    const maxRadius = 45;

    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const kx = Math.cos(angle) * clampedDist;
    const ky = Math.sin(angle) * clampedDist;

    setKnobPos({ x: kx, y: ky });

    // Normalized move vector (-1 to 1)
    // In Three.js: forward is negative Z, right is positive X
    const normX = kx / maxRadius;
    const normY = ky / maxRadius; // positive is backward, negative is forward
    setTouchMoveVector({ x: normX, y: -normY });
  };

  const handleJoystickMove = (e) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === joystickTouchId.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickEnd = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        setJoystickActive(false);
        setKnobPos({ x: 0, y: 0 });
        setTouchMoveVector({ x: 0, y: 0 });
        break;
      }
    }
  };

  // --- TOUCH CAMERA LOOK (RIGHT HALF OF SCREEN) ---
  const handleLookStart = (e) => {
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lastLookPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchId.current) {
        const dx = touch.clientX - lastLookPos.current.x;
        const dy = touch.clientY - lastLookPos.current.y;
        lastLookPos.current = { x: touch.clientX, y: touch.clientY };

        // Pass delta to store
        setTouchLookDelta({ x: dx, y: dy });
        break;
      }
    }
  };

  const handleLookEnd = (e) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchId.current) {
        lookTouchId.current = null;
        setTouchLookDelta({ x: 0, y: 0 });
        break;
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 55,
        touchAction: 'none',
      }}
    >
      {/* Touch Look Area (Right 60% of screen) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '62vw',
          height: '100vh',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
        onTouchCancel={handleLookEnd}
      />

      {/* Virtual Joystick (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '24px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(38, 10, 20, 0.75) 0%, rgba(14, 6, 11, 0.9) 100%)',
          border: '1.5px solid rgba(198, 161, 91, 0.5)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.8), inset 0 0 15px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          backdropFilter: 'blur(8px)',
        }}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onTouchCancel={handleJoystickEnd}
      >
        {/* Subtle Cross Marks */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            height: '24px',
            background: 'rgba(198, 161, 91, 0.3)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '24px',
            height: '2px',
            background: 'rgba(198, 161, 91, 0.3)',
          }}
        />

        {/* Movable Thumb Knob */}
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c6a15b, #dfbe7a)',
            border: '2px solid #fff',
            boxShadow: '0 0 16px rgba(223, 190, 122, 0.8)',
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            transition: joystickActive ? 'none' : 'transform 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#120904',
            fontSize: '1rem',
            fontWeight: 800,
          }}
        >
          ✦
        </div>
      </div>

      {/* Floating Action / Interact Button (Bottom Right) */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          right: '24px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <button
          onClick={() => {
            if (interactionPrompt && interactionPrompt.action) {
              interactionPrompt.action();
            }
          }}
          disabled={!interactionPrompt}
          style={{
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: interactionPrompt
              ? 'linear-gradient(135deg, #d6284e 0%, #ff4d6d 100%)'
              : 'rgba(22, 5, 11, 0.75)',
            border: interactionPrompt ? '2px solid #ffd7e0' : '1.5px solid rgba(198, 161, 91, 0.4)',
            color: interactionPrompt ? '#fff' : '#c5b9a5',
            boxShadow: interactionPrompt
              ? '0 0 25px rgba(214, 40, 78, 0.8), 0 4px 15px rgba(0,0,0,0.6)'
              : '0 4px 15px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Cinzel, serif',
            cursor: interactionPrompt ? 'pointer' : 'default',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(8px)',
            opacity: interactionPrompt ? 1 : 0.45,
            transform: interactionPrompt ? 'scale(1.05)' : 'scale(1)',
          }}
        >
          <span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }}>E</span>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.12em', marginTop: '2px' }}>
            {interactionPrompt ? 'INTERACT' : 'WAIT'}
          </span>
        </button>

        {interactionPrompt && (
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.72rem',
              color: '#dfbe7a',
              textAlign: 'center',
              maxWidth: '120px',
              textShadow: '0 2px 6px rgba(0,0,0,0.9)',
              letterSpacing: '0.08em',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {interactionPrompt.text}
          </div>
        )}
      </div>

      {/* Floating Realm / Pause Button (Top Left on Mobile) */}
      <button
        onClick={togglePauseMenu}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          pointerEvents: 'auto',
          background: 'rgba(22, 5, 11, 0.85)',
          border: '1px solid rgba(198, 161, 91, 0.5)',
          color: '#dfbe7a',
          padding: '8px 12px',
          borderRadius: '4px',
          fontFamily: 'Cinzel, serif',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Compass size={14} />
        <span>MAP</span>
      </button>
    </div>
  );
}
