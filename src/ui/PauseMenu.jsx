import React from 'react';
import { useGameStore } from '../store/gameStore';
import { roomDefinitions, ROOMS } from '../data/rooms';
import { secretsData } from '../data/messages';
import { X, Volume2, VolumeX, Map, Key, Sparkles, Compass } from 'lucide-react';

export default function PauseMenu() {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const currentRoom = useGameStore((s) => s.currentRoom);
  const startTransition = useGameStore((s) => s.startTransition);
  const isMuted = useGameStore((s) => s.isMuted);
  const toggleMute = useGameStore((s) => s.toggleMute);
  const masterVolume = useGameStore((s) => s.masterVolume);
  const setMasterVolume = useGameStore((s) => s.setMasterVolume);
  const bgmVolume = useGameStore((s) => s.bgmVolume);
  const setBgmVolume = useGameStore((s) => s.setBgmVolume);
  const sfxVolume = useGameStore((s) => s.sfxVolume);
  const setSfxVolume = useGameStore((s) => s.setSfxVolume);
  const discoveredSecrets = useGameStore((s) => s.discoveredSecrets);

  if (activeModal !== 'pause') return null;

  const handleTravel = (roomId) => {
    closeModal();
    if (roomId !== currentRoom) {
      startTransition(roomId);
    }
  };

  const navigableRooms = [
    ROOMS.GRAND_HALL,
    ROOMS.MEMORY_CHAMBER,
    ROOMS.BALLROOM,
    ROOMS.SECRET_LIBRARY,
    ROOMS.ENCHANTED_GARDEN,
    ROOMS.FOREVER_CHAMBER,
  ];

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="gothic-frame"
        style={{ maxWidth: 840 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="frame-corner-bl">❖</span>
        <span className="frame-corner-br">❖</span>

        <button className="modal-close-btn" onClick={closeModal} title="Resume [ESC]">
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: '#c6a15b',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            Castle Codex & Exploration
          </div>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)',
              color: '#dfbe7a',
              letterSpacing: '0.12em',
            }}
          >
            The Royal Realm
          </h2>
        </div>

        {/* 2-Column Grid: Map / Fast Travel on Left, Audio & Controls on Right */}
        <div
          className="pause-grid-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {/* Column 1: Castle Chambers Fast Travel */}
          <div
            style={{
              background: 'rgba(22, 5, 11, 0.65)',
              border: '1px solid rgba(198, 161, 91, 0.3)',
              borderRadius: 4,
              padding: 20,
            }}
          >
            <h3
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.05rem',
                color: '#dfbe7a',
                letterSpacing: '0.15em',
                marginBottom: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Compass size={18} /> Castle Chambers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {navigableRooms.map((roomId) => {
                const room = roomDefinitions[roomId];
                const isCurrent = roomId === currentRoom;
                return (
                  <button
                    key={roomId}
                    onClick={() => handleTravel(roomId)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: isCurrent ? 'rgba(61, 13, 30, 0.85)' : 'rgba(14, 6, 11, 0.7)',
                      border: isCurrent
                        ? '1px solid #dfbe7a'
                        : '1px solid rgba(198, 161, 91, 0.25)',
                      padding: '10px 14px',
                      borderRadius: 3,
                      cursor: 'pointer',
                      color: isCurrent ? '#dfbe7a' : '#e8dcc8',
                      fontFamily: 'Cinzel, serif',
                      fontSize: '0.85rem',
                      letterSpacing: '0.1em',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{room.title}</span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: '#dfbe7a',
                          border: '1px solid #dfbe7a',
                          padding: '2px 6px',
                          borderRadius: 2,
                        }}
                      >
                        CURRENT
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Secrets Discovered Tracker */}
            <div
              style={{
                marginTop: 20,
                padding: '12px 14px',
                background: 'rgba(10, 8, 12, 0.8)',
                border: '1px solid rgba(198, 161, 91, 0.2)',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontFamily: 'Cinzel, serif',
                  fontSize: '0.8rem',
                  color: '#dfbe7a',
                  marginBottom: 8,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} /> Hidden Secrets
                </span>
                <span>{discoveredSecrets.length} / 5 Found</span>
              </div>
              <div
                style={{
                  height: 6,
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(discoveredSecrets.length / 5) * 100}%`,
                    background: 'linear-gradient(90deg, #8c6d32, #dfbe7a)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Column 2: Audio Settings & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Audio Settings */}
            <div
              style={{
                background: 'rgba(22, 5, 11, 0.65)',
                border: '1px solid rgba(198, 161, 91, 0.3)',
                borderRadius: 4,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.05rem',
                    color: '#dfbe7a',
                    letterSpacing: '0.15em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Volume2 size={18} /> Soundscapes
                </h3>
                <button
                  className="control-btn"
                  onClick={toggleMute}
                  style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                >
                  {isMuted ? <VolumeX size={14} color="#ff6b6b" /> : <Volume2 size={14} />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>

              {/* Master Volume Slider */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: 4,
                  }}
                >
                  <span>Master Volume</span>
                  <span style={{ color: '#dfbe7a' }}>{Math.round(masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#dfbe7a' }}
                />
              </div>

              {/* BGM Volume Slider */}
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: 4,
                  }}
                >
                  <span>Romantic Melody</span>
                  <span style={{ color: '#dfbe7a' }}>{Math.round(bgmVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVolume}
                  onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#dfbe7a' }}
                />
              </div>

              {/* SFX Volume Slider */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.85rem',
                    marginBottom: 4,
                  }}
                >
                  <span>Environmental & SFX</span>
                  <span style={{ color: '#dfbe7a' }}>{Math.round(sfxVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVolume}
                  onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#dfbe7a' }}
                />
              </div>
            </div>

            {/* Controls Guide */}
            <div
              style={{
                background: 'rgba(22, 5, 11, 0.65)',
                border: '1px solid rgba(198, 161, 91, 0.3)',
                borderRadius: 4,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '1.05rem',
                  color: '#dfbe7a',
                  letterSpacing: '0.15em',
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Key size={18} /> Controls
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '8px 16px',
                  fontSize: '0.9rem',
                }}
              >
                <kbd style={{ color: '#dfbe7a' }}>W A S D</kbd>
                <span>Walk throughout the rooms</span>
                <kbd style={{ color: '#dfbe7a' }}>Shift</kbd>
                <span>Run / Sprint</span>
                <kbd style={{ color: '#dfbe7a' }}>Mouse</kbd>
                <span>First-person camera view</span>
                <kbd style={{ color: '#dfbe7a' }}>E</kbd>
                <span>Interact with doors, letters, photos</span>
                <kbd style={{ color: '#dfbe7a' }}>ESC</kbd>
                <span>Open this menu / Release mouse pointer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Button */}
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <button className="gold-btn" onClick={closeModal}>
            Resume Exploration
          </button>
        </div>
      </div>
    </div>
  );
}
