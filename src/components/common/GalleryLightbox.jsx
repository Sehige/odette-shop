import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProductDetailImageUrl } from '../../utils/imageOptimizer';

/**
 * GalleryLightbox
 *
 * Full-screen viewer for the cake gallery. Shows one photo at a time with
 * prev/next, a counter, ESC-to-close, backdrop click, and browser-back
 * handling (same UX as the product image carousel, without product coupling).
 *
 * @param {Array}  images     - gallery rows ({ image_url, title_ro, title_en })
 * @param {number} startIndex - index to open at
 * @param {string} language   - 'ro' | 'en' (for alt text)
 * @param {Function} onClose  - close handler
 */
const GalleryLightbox = ({ images, startIndex = 0, language = 'ro', onClose }) => {
  const [index, setIndex] = useState(startIndex);

  const count = images.length;
  const current = images[index];

  const next = useCallback(
    () => setIndex((prev) => (prev + 1) % count),
    [count]
  );
  const prev = useCallback(
    () => setIndex((prev) => (prev - 1 + count) % count),
    [count]
  );

  // Keyboard: ESC closes, arrows navigate.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, next, prev]);

  // Browser back closes the lightbox instead of leaving the shop page.
  useEffect(() => {
    window.history.pushState({ modal: 'gallery' }, '');
    const onPop = () => onClose();
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [onClose]);

  if (!current) return null;

  const alt = (language === 'ro' ? current.title_ro : current.title_en) || '';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
        aria-label="Close"
      >
        <X className="w-7 h-7 text-white" />
      </button>

      {/* Image (stop propagation so clicking it doesn't close) */}
      <figure
        className="max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getProductDetailImageUrl(current.image_url)}
          alt={alt}
          className="max-h-[85vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
        />
        {alt && (
          <figcaption className="mt-3 text-white/90 text-center text-sm sm:text-base">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* Prev / next / counter — only when more than one photo */}
      {count > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-full">
            {index + 1} / {count}
          </div>
        </>
      )}
    </div>
  );
};

export default GalleryLightbox;
