import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export default function BookViewer() {
  const activeModal = useGameStore((s) => s.activeModal);
  const selectedBook = useGameStore((s) => s.selectedBook);
  const closeModal = useGameStore((s) => s.closeModal);

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [selectedBook]);

  if (activeModal !== 'book' || !selectedBook) return null;

  const pages = selectedBook.pages || [];
  const currentPage = pages[pageIndex] || { heading: '', content: '' };

  const goNext = () => {
    if (pageIndex < pages.length - 1) {
      setPageIndex((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div
        className="gothic-frame"
        style={{ maxWidth: 780 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="frame-corner-bl">❖</span>
        <span className="frame-corner-br">❖</span>

        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeModal} title="Close [ESC]">
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              color: '#c6a15b',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 6,
            }}
          >
            <BookOpen size={14} />
            {selectedBook.category || 'Secret Library'}
          </div>
          <h2
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: 'clamp(1.4rem, 3vw, 2.0rem)',
              color: '#dfbe7a',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            {selectedBook.title}
          </h2>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: '#a89d8b',
            }}
          >
            Penmanship of {selectedBook.author}
          </div>
        </div>

        {/* Parchment Page Frame */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1f140e 0%, #150c07 100%)',
            border: '1px solid rgba(198, 161, 91, 0.4)',
            borderRadius: 4,
            padding: '36px 40px',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8)',
            position: 'relative',
          }}
        >
          {/* Subtle Page Watermark */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontFamily: 'Cinzel, serif',
              fontSize: '6rem',
              color: 'rgba(198, 161, 91, 0.03)',
              pointerEvents: 'none',
            }}
          >
            👑
          </div>

          <h3
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '1.25rem',
              color: '#dfbe7a',
              letterSpacing: '0.15em',
              marginBottom: 20,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(198, 161, 91, 0.25)',
              textAlign: 'center',
            }}
          >
            {currentPage.heading}
          </h3>

          <p
            style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '1.2rem',
              lineHeight: 1.85,
              color: '#f0e6d6',
              whiteSpace: 'pre-line',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {currentPage.content}
          </p>

          {/* Page Number indicator */}
          <div
            style={{
              marginTop: 30,
              textAlign: 'center',
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              letterSpacing: '0.25em',
              color: '#8c6d32',
            }}
          >
            — PAGE {pageIndex + 1} OF {pages.length} —
          </div>
        </div>

        {/* Page Nav */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          <button
            className="control-btn"
            onClick={goPrev}
            disabled={pageIndex === 0}
            style={{ opacity: pageIndex === 0 ? 0.35 : 1 }}
          >
            <ChevronLeft size={16} /> Previous Page
          </button>
          <button
            className="control-btn"
            onClick={goNext}
            disabled={pageIndex >= pages.length - 1}
            style={{ opacity: pageIndex >= pages.length - 1 ? 0.35 : 1 }}
          >
            Next Page <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
