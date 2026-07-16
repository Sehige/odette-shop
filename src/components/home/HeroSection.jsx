import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_IMAGE } from '../../data/imageConstants';
import { getHeroImageProps } from '../../utils/imageOptimizer';
import { translations } from '../../data/translations';
import AdjustableImage from '../common/AdjustableImage';

// Gold ornamental flourish (mirrors the Canva divider above/below the tagline)
const GoldFlourish = ({ className = '' }) => (
  <svg
    viewBox="0 0 240 24"
    className={className}
    fill="none"
    stroke="#d4af37"
    strokeWidth="1.5"
    aria-hidden="true"
  >
    <path d="M10 12 H95" strokeLinecap="round" />
    <path d="M230 12 H145" strokeLinecap="round" />
    <path d="M95 12 c8 -9 18 -9 25 0 c7 9 17 9 25 0" strokeLinecap="round" />
    <circle cx="120" cy="12" r="2.5" fill="#d4af37" stroke="none" />
  </svg>
);

const HeroSection = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language] || translations.ro;

  const heroImageProps = getHeroImageProps(HERO_IMAGE);

  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[600px] lg:min-h-screen">
      {/* Left: dessert photo (50%) */}
      <AdjustableImage
        elementKey="hero"
        src={heroImageProps.src}
        srcSet={heroImageProps.srcSet}
        sizes={heroImageProps.sizes}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="h-64 sm:h-80 lg:h-auto"
      />

      {/* Right: navy panel (50%) */}
      <div className="relative bg-[#1e3a8a] flex flex-col justify-center px-8 py-16 sm:px-12 lg:px-16">
        <div className="max-w-xl mx-auto text-center w-full">
          <GoldFlourish className="w-48 h-6 mx-auto mb-8" />

          <h1 className="font-script text-white leading-relaxed text-4xl sm:text-5xl md:text-6xl">
            {t.landing.heroTagline}
          </h1>

          <GoldFlourish className="w-48 h-6 mx-auto mt-8" />
        </div>

        {/* Cream pill CTA, bottom-right */}
        <div className="mt-12 flex justify-center lg:justify-end lg:absolute lg:bottom-12 lg:right-16">
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#f7f4ec] text-[#1e3a8a] px-10 py-4 rounded-full text-base font-semibold tracking-wide uppercase hover:opacity-90 transition transform hover:scale-105 shadow-xl"
          >
            {t.landing.orderNow}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
