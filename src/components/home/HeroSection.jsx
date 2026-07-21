import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import AdjustableImage from '../common/AdjustableImage';
// Hero illustration (vector — scales to any size, no responsive srcset needed)
import heroPicture from '../../hero_picture.svg';

const HeroSection = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language] || translations.ro;

  return (
    <section className="relative bg-[#1e3a8a] min-h-screen flex items-center pt-24 pb-16 lg:pt-20">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] items-center gap-8 lg:gap-12">
          {/* Left: tagline + CTA */}
          <div className="text-center order-2 lg:order-1">
            <h1 className="font-serif font-normal text-white leading-relaxed text-[32px] sm:text-[43px] lg:text-[54px]">
              {t.landing.heroTagline}
            </h1>
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => navigate('/shop')}
                className="bg-[#f7f4ec] text-[#1e3a8a] px-10 py-4 rounded-full text-base font-semibold tracking-wide uppercase hover:opacity-90 transition transform hover:scale-105 shadow-xl"
              >
                {t.landing.orderNow}
              </button>
            </div>
          </div>

          {/* Right: floating product image (cut-out PNG when provided) */}
          <div className="order-1 lg:order-2">
            <AdjustableImage
              elementKey="hero"
              src={heroPicture}
              alt=""
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
