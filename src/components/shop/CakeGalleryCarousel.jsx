import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../../data/translations';
import { getScaledImageUrl } from '../../utils/imageOptimizer';
import AdjustableImage from '../common/AdjustableImage';
import GalleryLightbox from '../common/GalleryLightbox';

// How many photos are visible at once, by breakpoint (5 on desktop).
const getVisibleCount = () => {
  if (typeof window === 'undefined') return 5;
  if (window.matchMedia('(min-width: 1024px)').matches) return 5;
  if (window.matchMedia('(min-width: 768px)').matches) return 4;
  if (window.matchMedia('(min-width: 640px)').matches) return 3;
  return 2;
};

const GAP = 16; // px, matches the `gap-4` between cards
const AUTOPLAY_MS = 4000;

/**
 * CakeGalleryCarousel
 *
 * Draggable, seamlessly-looping carousel of past-work cake photos shown above
 * the product grid on the Shop page. It's a horizontal scroll track:
 *  - touch: native finger-drag scrolling,
 *  - mouse: click-and-drag to scroll,
 *  - arrows (overlaid, shown on hover) + autoplay scroll it.
 * The track is tripled and recentred on scroll, so it loops endlessly in both
 * directions on desktop and mobile. Clicking a photo (without dragging) opens a
 * full-screen lightbox.
 *
 * @param {Array}  images   - gallery rows for the selected category
 * @param {string} language - 'ro' | 'en'
 */
const CakeGalleryCarousel = ({ images, language }) => {
  const t = translations[language] || translations.ro;
  const scrollerRef = useRef(null);
  const dragRef = useRef({ down: false, lastX: 0, dist: 0, moved: false });
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const [paused, setPaused] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const count = images ? images.length : 0;
  const shown = Math.min(visibleCount, count || 1);
  const loop = count > shown;

  // Triple the photos so scrolling can be recentred for a seamless loop.
  const displayImages = loop ? [...images, ...images, ...images] : images;

  // Responsive visible count.
  useEffect(() => {
    const onResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const oneSetWidth = () => {
    const el = scrollerRef.current;
    return el ? el.scrollWidth / 3 : 0;
  };

  // Start centred on the middle copy so there's room to loop either way.
  useLayoutEffect(() => {
    if (!loop) return;
    const el = scrollerRef.current;
    if (el) el.scrollLeft = oneSetWidth();
  }, [loop, shown, count]);

  // Keep the scroll position within the middle copy — jumps are invisible
  // because the copies are identical.
  const onScroll = () => {
    if (!loop) return;
    const el = scrollerRef.current;
    const w = oneSetWidth();
    if (w <= 0) return;
    if (el.scrollLeft >= 2 * w) el.scrollLeft -= w;
    else if (el.scrollLeft < w) el.scrollLeft += w;
  };

  const cardStep = () => {
    const el = scrollerRef.current;
    if (!el) return 0;
    const card = el.querySelector('[data-card]');
    return card ? card.getBoundingClientRect().width + GAP : el.clientWidth / shown;
  };

  const scrollByDir = (dir) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  };

  // Autoplay — pauses on hover / touch / while the lightbox is open.
  useEffect(() => {
    if (!loop || paused || lightboxIndex !== null) return undefined;
    const id = setInterval(() => scrollByDir(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [loop, paused, lightboxIndex, shown, count]);

  // Mouse click-and-drag to scroll (touch uses native scrolling). Pointer
  // capture / preventDefault happen only once a real drag starts, so a plain
  // click still reaches the card button and opens the lightbox.
  const onPointerDown = (e) => {
    setPaused(true);
    if (e.pointerType !== 'mouse') return; // touch scrolls natively
    dragRef.current = { down: true, lastX: e.clientX, dist: 0, moved: false, captured: false };
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.down) return;
    const dx = e.clientX - d.lastX;
    d.lastX = e.clientX;
    d.dist += Math.abs(dx);
    if (d.dist <= 4) return; // ignore sub-threshold jitter so clicks still fire
    d.moved = true;
    if (!d.captured) {
      scrollerRef.current?.setPointerCapture?.(e.pointerId);
      d.captured = true;
    }
    e.preventDefault();
    scrollerRef.current.scrollLeft -= dx;
  };
  const endDrag = (e) => {
    const d = dragRef.current;
    if (d.captured) scrollerRef.current?.releasePointerCapture?.(e.pointerId);
    d.down = false;
    d.captured = false;
    setPaused(false);
  };

  if (!images || count === 0) return null;

  const cardWidth = `calc((100% - ${(shown - 1) * GAP}px) / ${shown})`;

  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="text-left font-serif font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
        {t.shop.galleryTitle}
      </h2>

      {/* Scroll track (drag/swipe); arrows overlay the images, shown on hover. */}
      <div
        className="relative group"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className={`flex gap-4 overflow-x-auto scrollbar-hide select-none ${loop ? 'cursor-grab active:cursor-grabbing' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={(e) => { if (dragRef.current.down) endDrag(e); }}
        >
          {displayImages.map((img, index) => {
            const caption = (language === 'ro' ? img.title_ro : img.title_en) || '';
            return (
              <button
                key={`${img.id}-${index}`}
                data-card
                onClick={() => { if (!dragRef.current.moved) setLightboxIndex(index % count); }}
                className="flex-shrink-0 rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition"
                style={{ width: cardWidth }}
                aria-label={caption || (language === 'ro' ? 'Vezi imaginea' : 'View image')}
              >
                <AdjustableImage
                  elementKey={img.image_url}
                  src={getScaledImageUrl(img.image_url, 600, 'auto:good')}
                  alt={caption}
                  loading="lazy"
                  className="w-full aspect-square"
                />
              </button>
            );
          })}
        </div>

        {loop && (
          <>
            <button
              onClick={() => scrollByDir(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 rounded-full p-2 sm:p-3 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>
            <button
              onClick={() => scrollByDir(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/80 rounded-full p-2 sm:p-3 shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          images={images}
          startIndex={lightboxIndex}
          language={language}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
};

export default CakeGalleryCarousel;
