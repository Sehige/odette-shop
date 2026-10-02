import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../data/translations';
import AdjustableImage from '../common/AdjustableImage';
// Hero cut-out (transparent WebP) at 1x / 1.5x / 2x of its 744px layout width.
// Rendered from the former hero_picture.svg (1.4 MB), which wrapped the same photo.
import hero744 from '../../assets/hero/hero-744.webp';
import hero1116 from '../../assets/hero/hero-1116.webp';
import hero1488 from '../../assets/hero/hero-1488.webp';

const HeroSection = ({ language }) => {
  const t = translations[language] || translations.ro;

  return (
    <section className="relative bg-[#1e3a8a] min-h-screen flex items-center pt-24 pb-16 lg:pt-20">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] items-center gap-8 lg:gap-12">
          {/* Left: tagline + CTA */}
          <div className="text-center order-2 lg:order-1">
            <h1 className="font-serif font-medium text-white leading-relaxed text-[32px] sm:text-[43px] lg:text-[54px]">
              {t.landing.heroTagline}
            </h1>
            <div className="mt-10 flex justify-center">
              <Link
                to="/shop"
                className="inline-block bg-[#f7f4ec] text-[#1e3a8a] px-10 py-4 rounded-full text-base font-semibold tracking-wide uppercase hover:opacity-90 transition transform hover:scale-105 shadow-xl"
              >
                {t.landing.orderNow}
              </Link>
            </div>
          </div>

          {/* Right: floating product image (transparent cut-out) */}
          <div className="order-1 lg:order-2">
            <AdjustableImage
              elementKey="hero"
              src={hero1116}
              srcSet={`${hero744} 744w, ${hero1116} 1116w, ${hero1488} 1488w`}
              sizes="(min-width: 1024px) 60vw, 100vw"
              width={1488}
              height={1104}
              alt={t.landing.heroImageAlt}
              fit="contain"
              fetchPriority="high"
              decoding="async"
              className="w-full h-80 sm:h-[30rem] lg:h-[44rem] drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
