import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../../data/translations';
import { HERO_IMAGE, CAKE_IMAGE, ECLAIR_IMAGE, MACARON_IMAGE, BERRY_TART_IMAGE } from '../../data/imageConstants';

const HeroSection = ({ language, setCurrentPage }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = translations[language];
  
  const slides = [
    {
      image: HERO_IMAGE,
      title: { ro: 'Patiserie Artizanală, Preparată Zilnic Proaspătă', en: 'Artisan Pastries, Made Fresh Daily' },
      subtitle: { ro: 'Descoperă eleganța în fiecare mușcătură. Torturi și prăjituri premium făcute cu dragoste.', en: 'Discover elegance in every bite. Premium cakes and pastries made with love.' }
    },
    {
      image: CAKE_IMAGE,
      title: { ro: 'Torturi Premium Pentru Orice Ocazie', en: 'Premium Cakes For Any Occasion' },
      subtitle: { ro: 'Creații personalizate care transformă fiecare moment într-o sărbătoare.', en: 'Custom creations that turn every moment into a celebration.' }
    },
    {
      image: ECLAIR_IMAGE,
      title: { ro: 'Prăjituri Fine Franțuzești', en: 'Fine French Pastries' },
      subtitle: { ro: 'Eclere, profiterole și delicatese preparate după rețete tradiționale.', en: 'Eclairs, profiteroles and delicacies made from traditional recipes.' }
    },
    {
      image: MACARON_IMAGE,
      title: { ro: 'Macarons Premium', en: 'Premium Macarons' },
      subtitle: { ro: 'Culori vibrante, arome rafinate, fiecare macaron o mică operă de artă.', en: 'Vibrant colors, refined flavors, each macaron a small work of art.' }
    },
    {
      image: BERRY_TART_IMAGE,
      title: { ro: 'Tarte cu Fructe Proaspete', en: 'Fresh Fruit Tarts' },
      subtitle: { ro: 'Fructe de sezon pe o cremă fină de vanilie, un răsfăț pentru simțuri.', en: 'Seasonal fruits on fine vanilla cream, a treat for the senses.' }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${slide.image})`,
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
                {slide.title[language]}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow">
                {slide.subtitle[language]}
              </p>
              <button 
                onClick={() => setCurrentPage('shop')}
                className="text-blue-900 px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-xl"
                style={{ backgroundColor: '#d4af37' }}
              >
                {language === 'ro' ? 'Comandă Acum' : 'Order Now'}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition"
      >
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 rounded-full p-3 shadow-lg hover:bg-white transition"
      >
        <ChevronRight className="w-6 h-6 text-gray-700" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;