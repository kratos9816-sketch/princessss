import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { foreverLetterData } from '../data/messages';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Crown } from 'lucide-react';

export default function LoveLetter() {
  const activeModal = useGameStore((s) => s.activeModal);
  const closeModal = useGameStore((s) => s.closeModal);
  const [hasVowed, setHasVowed] = useState(false);

  useEffect(() => {
    if (activeModal === 'forever') {
      // Launch romantic golden & rose confetti burst!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#c6a15b', '#dfbe7a', '#d6284e', '#ffffff', '#ff758c'],
      });
    }
  }, [activeModal]);

  if (activeModal !== 'forever') return null;

  const handleVow = (response) => {
    setHasVowed(true);
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#dfbe7a', '#d6284e', '#ffe082', '#ff4d6d'],
    });
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="gothic-frame"
        style={{
          maxWidth: 820,
          background: 'linear-gradient(150deg, #1b0712 0%, #0d080e 60%, #1e0914 100%)',
          border: '2px solid #dfbe7a',
          boxShadow: '0 0 50px rgba(223, 190, 122, 0.4), inset 0 0 40px rgba(90, 17, 39, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="frame-corner-bl">❖</span>
        <span className="frame-corner-br">❖</span>

        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeModal} title="Close [ESC]">
          <X size={18} />
        </button>

        {/* Royal Crest Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#c6a15b',
              fontSize: '1.2rem',
              marginBottom: 8,
            }}
          >
            <Crown size={24} color="#dfbe7a" />
          </div>

          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.6rem, 3.8vw, 2.5rem)',
              color: '#dfbe7a',
              letterSpacing: '0.18em',
              fontWeight: 700,
              textTransform: 'uppercase',
              textShadow: '0 0 24px rgba(223, 190, 122, 0.5)',
            }}
          >
            {foreverLetterData.royalHeading}
          </h2>

          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.2rem',
              color: '#d1c3b0',
              marginTop: 4,
            }}
          >
            {foreverLetterData.subheading}
          </div>
        </div>

        {/* Real Couple Keepsake Photograph */}
        <div
          style={{
            margin: '0 auto 24px',
            maxWidth: 240,
            borderRadius: 6,
            overflow: 'hidden',
            border: '2px solid #dfbe7a',
            boxShadow: '0 0 25px rgba(223, 190, 122, 0.4)',
          }}
        >
          <img
            src="/images/lovee-Cover.jpg"
            alt="Our Forever"
            style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
          />
        </div>

        {/* Illuminated Opening Quote */}
        <div
          style={{
            background: 'rgba(38, 10, 20, 0.5)',
            borderLeft: '3px solid #dfbe7a',
            borderRight: '3px solid #dfbe7a',
            padding: '18px 24px',
            marginBottom: 28,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 'clamp(1.15rem, 2.4vw, 1.45rem)',
              lineHeight: 1.6,
              color: '#dfbe7a',
            }}
          >
            {foreverLetterData.openingQuote}
          </p>
        </div>

        {/* Parchment Body Paragraphs */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '1.22rem',
            lineHeight: 1.85,
            color: '#f4ede1',
            padding: '0 10px',
          }}
        >
          {foreverLetterData.bodyParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Royal Closing Signature */}
        <div
          style={{
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid rgba(198, 161, 91, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'Great Vibes, cursive',
              fontSize: '2.5rem',
              color: '#dfbe7a',
              marginBottom: 10,
              textShadow: '0 0 16px rgba(223, 190, 122, 0.4)',
            }}
          >
            {foreverLetterData.signature}
          </div>

          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.85rem',
              letterSpacing: '0.25em',
              color: '#a89d8c',
              textTransform: 'uppercase',
            }}
          >
            THE CASTLE OF OUR FOREVER · ETERNAL ARCHIVES
          </div>
        </div>

        {/* Romantic Interactive Response */}
        <div
          style={{
            marginTop: 32,
            padding: '24px',
            background: 'rgba(22, 5, 11, 0.8)',
            border: '1px solid rgba(214, 40, 78, 0.5)',
            borderRadius: 6,
            textAlign: 'center',
          }}
        >
          {!hasVowed ? (
            <>
              <p
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontSize: '1.35rem',
                  color: '#dfbe7a',
                  marginBottom: 18,
                }}
              >
                {foreverLetterData.proposalNote}
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 14,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  className="gold-btn"
                  onClick={() => handleVow('Forever')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    flex: '1 1 220px',
                    minHeight: 48,
                  }}
                >
                  <Heart size={16} fill="#120904" />
                  Forever & Always, My Prince
                </button>
                <button
                  className="control-btn"
                  onClick={() => handleVow('Yes')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    borderColor: '#dfbe7a',
                    color: '#dfbe7a',
                    flex: '1 1 220px',
                    minHeight: 48,
                  }}
                >
                  <Sparkles size={16} />
                  With All My Heart, Yes
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '1.25rem',
                color: '#dfbe7a',
                letterSpacing: '0.15em',
                animation: 'fadeIn 0.6s ease',
              }}
            >
              🌹 Our kingdom is sealed for eternity. I love you more than words could ever say. 🌹
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
