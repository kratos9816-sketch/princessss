import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { memoriesData } from '../data/memories';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, MapPin } from 'lucide-react';

export default function MemoryViewer() {
  const activeModal = useGameStore((s) => s.activeModal);
  const selectedMemory = useGameStore((s) => s.selectedMemory);
  const closeModal = useGameStore((s) => s.closeModal);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedMemory) {
      const idx = memoriesData.findIndex((m) => m.id === selectedMemory.id);
      if (idx !== -1) setCurrentIndex(idx);
    }
  }, [selectedMemory]);

  if (activeModal !== 'memory') return null;

  const currentMem = memoriesData[currentIndex] || selectedMemory;
  if (!currentMem) return null;

  const goNext = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % memoriesData.length);
  };

  const goPrev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + memoriesData.length) % memoriesData.length);
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="gothic-frame" onClick={(e) => e.stopPropagation()}>
        <span className="frame-corner-bl">❖</span>
        <span className="frame-corner-br">❖</span>

        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeModal} title="Close [ESC]">
          <X size={18} />
        </button>

        {/* Header Tag */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.78rem',
              letterSpacing: '0.3em',
              color: '#c6a15b',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            The Memory Chamber · {currentIndex + 1} of {memoriesData.length}
          </div>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
              color: '#dfbe7a',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {currentMem.title}
          </h2>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.15rem',
              color: '#c5b9a5',
            }}
          >
            {currentMem.subtitle}
          </div>
        </div>

        {/* Content Layout: Photo on left, Romantic Story on right */}
        <div
          className="memory-grid-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1.2fr)',
            gap: 28,
            alignItems: 'center',
            marginTop: 16,
          }}
        >
          {/* Photograph Container with Antique Gold Border */}
          <div
            className="memory-photo-container"
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.8), 0 0 20px rgba(198, 161, 91, 0.3)',
              border: '2px solid #c6a15b',
              aspectRatio: '4 / 5',
              background: currentMem.fallbackColor || '#260a14',
            }}
          >
            <img
              src={currentMem.image}
              alt={currentMem.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                // If offline or image failed to load, show romantic fallback canvas
                e.target.style.display = 'none';
              }}
            />
            {/* Overlay Gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(14,6,11,0.8) 0%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
            {/* Bottom Photo Metadata */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: '#e8dcc8',
                fontFamily: 'Cormorant Garamond, serif',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} color="#dfbe7a" />
                {currentMem.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} color="#dfbe7a" />
                {currentMem.location}
              </span>
            </div>
          </div>

          {/* Story & Quote Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quote Block */}
            <blockquote
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                lineHeight: 1.5,
                color: '#dfbe7a',
                borderLeft: '2px solid #c6a15b',
                paddingLeft: 18,
                background: 'rgba(38, 10, 20, 0.3)',
                padding: '14px 18px',
                borderRadius: '0 4px 4px 0',
              }}
            >
              {currentMem.quote}
            </blockquote>

            {/* Story Paragraph */}
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '1.15rem',
                lineHeight: 1.8,
                color: '#e8dcc8',
                whiteSpace: 'pre-line',
              }}
            >
              {currentMem.story}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
              {currentMem.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    padding: '4px 10px',
                    borderRadius: 3,
                    background: 'rgba(214, 40, 78, 0.2)',
                    border: '1px solid rgba(214, 40, 78, 0.5)',
                    color: '#ff8da5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Heart size={10} fill="#ff8da5" />
                  {tag}
                </span>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 18,
                paddingTop: 16,
                borderTop: '1px solid rgba(198, 161, 91, 0.25)',
              }}
            >
              <button className="control-btn" onClick={goPrev} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                <ChevronLeft size={16} /> Previous
              </button>
              <button className="control-btn" onClick={goNext} style={{ flex: '1 1 auto', justifyContent: 'center' }}>
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
