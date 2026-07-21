import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../../data/translations';
import {
  FAQ_TORTURI_IMAGE,
  FAQ_TRANSPORT_IMAGE,
  FAQ_INGREDIENTE_IMAGE,
  FAQ_CANDYBAR_IMAGE,
  FAQ_ARTIZANAL_IMAGE,
} from '../../data/imageConstants';
import AdjustableImage from '../common/AdjustableImage';
import { getScaledImageUrl } from '../../utils/imageOptimizer';

// Images align by index with translations landing.faq
// (Torturi, Transport, Ingrediente, Candybar, Artizanal).
// `key` is the image_settings element_key for the admin positioning tool.
const FAQ_IMAGES = [
  { key: 'faq_torturi', src: FAQ_TORTURI_IMAGE },
  { key: 'faq_transport', src: FAQ_TRANSPORT_IMAGE },
  { key: 'faq_ingrediente', src: FAQ_INGREDIENTE_IMAGE },
  { key: 'faq_candybar', src: FAQ_CANDYBAR_IMAGE },
  { key: 'faq_artizanal', src: FAQ_ARTIZANAL_IMAGE },
];

const VISIBLE = 3; // cards shown at once on desktop

const renderCard = (item, index, key) => {
  const image = FAQ_IMAGES[index];
  return (
    <div
      key={key}
      className="bg-[#f7f4ec] rounded-lg shadow-sm p-6 text-center flex flex-col items-center h-full overflow-hidden"
    >
      {/* Top-aligned (no justify-center) so titles sit at the same height on every card */}
      <h3 className="font-serif font-bold text-[#1e3a8a] text-xl md:text-2xl mb-4">
        {item.title}
      </h3>
      {image.src && (
        <AdjustableImage
          elementKey={image.key}
          src={getScaledImageUrl(image.src, 400, 'auto:good')}
          alt={item.title}
          loading="lazy"
          className="rounded-md mb-4 w-40 h-32 flex-shrink-0"
        />
      )}
      <p className="text-[#1e3a8a] text-sm md:text-base leading-relaxed">
        {item.text}
      </p>
    </div>
  );
};

const FAQ = ({ language }) => {
  const t = translations[language] || translations.ro;
  const items = t.landing.faq || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items.length) return null;

  // Circular window of VISIBLE cards, so the carousel loops.
  const getVisible = () => {
    const visible = [];
    const count = Math.min(VISIBLE, items.length);
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % items.length;
      visible.push(index);
    }
    return visible;
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <section className="bg-[#dce6f5] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif font-bold text-[#1e3a8a] text-3xl md:text-4xl lg:text-5xl mb-12">
          {t.landing.faqTitle}
        </h2>

        {/* Mobile: horizontal scrollable carousel */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          <div className="flex gap-4">
            {items.map((item, index) => (
              <div key={item.title} className="flex-shrink-0 w-[85%] h-[380px] snap-start">
                {renderCard(item, index, item.title)}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-up carousel with navigation */}
        <div className="hidden md:block relative">
          <div className="grid grid-cols-3 gap-6 items-stretch h-[380px]">
            {getVisible().map((index, idx) =>
              renderCard(items[index], index, `${index}-${currentIndex}-${idx}`)
            )}
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-[#1e3a8a]" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-[#1e3a8a]" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
