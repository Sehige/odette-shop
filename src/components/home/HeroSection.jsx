import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HERO_IMAGE } from '../../data/imageConstants';

const HeroSection = ({ language }) => {
  const navigate = useNavigate();

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
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
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white max-w-4xl mx-auto px-4">
        <div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
            {language === 'ro' ? 'Patiserie Artizanală, Preparată Zilnic Proaspătă' : 'Artisan Pastries, Made Fresh Daily'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow">
            {language === 'ro' ? 'Descoperă eleganța în fiecare mușcătură. Torturi și prăjituri premium făcute cu dragoste.' : 'Discover elegance in every bite. Premium cakes and pastries made with love.'}
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="text-blue-900 px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-xl"
            style={{ backgroundColor: '#d4af37' }}
          >
            {language === 'ro' ? 'Comandă Acum' : 'Order Now'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;