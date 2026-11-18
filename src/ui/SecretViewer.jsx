import React from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Sparkles } from 'lucide-react';

export default function SecretViewer() {
  const activeModal = useGameStore((s) => s.activeModal);
  const selectedSecret = useGameStore((s) => s.selectedSecret);
  const discoveredSecrets = useGameStore((s) => s.discoveredSecrets);
  const closeModal = useGameStore((s) => s.closeModal);

  if (activeModal !== 'secret' || !selectedSecret) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="gothic-frame"
        style={{ maxWidth: 650 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="frame-corner-bl">❖</span>
        <span className="frame-corner-br">❖</span>

        <button className="modal-close-btn" onClick={closeModal} title="Close [ESC]">
          <X size={18} />
        </button>

        {/* Secret Discovered Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(198, 161, 91, 0.15)',
              border: '1px solid #c6a15b',
              padding: '6px 14px',
              borderRadius: 20,
              fontFamily: 'Cinzel, serif',
              fontSize: '0.78rem',
              letterSpacing: '0.25em',
              color: '#dfbe7a',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            <Sparkles size={14} color="#dfbe7a" />
            Hidden Secret Discovered · {discoveredSecrets.length} / 5 Found
          </div>

          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
              color: '#f3e8d6',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {selectedSecret.title}
          </h2>

          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: '#c5b9a5',
              marginTop: 4,
            }}
          >
            Discovered in {selectedSecret.room}
          </div>
        </div>

        {/* Parchment Message Box */}
        <div
          style={{
            background: 'linear-gradient(145deg, #1b0c13 0%, #10060b 100%)',
            border: '1px solid rgba(214, 40, 78, 0.4)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8), 0 0 20px rgba(214, 40, 78, 0.2)',
            borderRadius: 4,
            padding: '30px 32px',
            position: 'relative',
          }}
        >
          <p
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: 1.8,
              color: '#f0e6d6',
              whiteSpace: 'pre-line',
            }}
          >
            {selectedSecret.message}
          </p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button className="control-btn" style={{ margin: '0 auto' }} onClick={closeModal}>
            Keep Exploring Castle
          </button>
        </div>
      </div>
    </div>
  );
}
