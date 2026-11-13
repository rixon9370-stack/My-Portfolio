import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function extractYouTubeId(w) {
  if (!w) return '';
  if (typeof w === 'string') {
    const m = w.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
    return m ? m[1] : (/^[\w-]{11}$/.test(w.trim()) ? w.trim() : '');
  }
  if (w.youtubeId && typeof w.youtubeId === 'string' && w.youtubeId.trim()) {
    return w.youtubeId.trim();
  }
  if (w.youtubeUrl && typeof w.youtubeUrl === 'string') {
    const m = w.youtubeUrl.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
    if (m) return m[1];
  }
  return '';
}

export default function Lightbox({ isOpen, works, currentIndex, onClose, onPrev, onNext }) {
  const currentWork = works && currentIndex >= 0 && currentIndex < works.length ? works[currentIndex] : null;
  const yId = currentWork ? extractYouTubeId(currentWork) : '';
  const isVertical = currentWork?.orientation === 'vertical';

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    },
    [isOpen, onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentWork || !yId) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Video Player"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {works.length > 1 && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 sm:left-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Previous video"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {works.length > 1 && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 sm:right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          aria-label="Next video"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Video Container */}
      <div
        className={`relative overflow-hidden rounded-lg bg-black shadow-2xl transition-all duration-300 ${
          isVertical
            ? 'h-[85vh] max-h-[820px] aspect-[9/16]'
            : 'w-full max-w-5xl aspect-video'
        }`}
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={currentWork.title || 'Video Player'}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
