import React from 'react';
import { translations } from '../../data/translations';
import { HERO_IMAGE } from '../../data/imageConstants';

const HeroSection = ({ language, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(30, 58, 138, 0.65)' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
          {t.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow">
          {t.heroSubtitle}
        </p>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="text-blue-900 px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-xl"
          style={{ backgroundColor: '#d4af37' }}
        >
          {t.shopNow}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;