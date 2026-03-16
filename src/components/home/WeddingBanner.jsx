import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { getResponsiveBannerProps } from '../../utils/imageOptimizer';

const WeddingBanner = ({ language }) => {
  // Wedding offer URL
  const weddingOfferUrl = 'https://www.canva.com/design/DAG9eAIoAiU/4Wzi004UggxTwSxsU1Wp8Q/view';

  // Wedding image
  const weddingImage = 'https://ovajkmagjddlujgegcon.supabase.co/storage/v1/object/public/product-images/candy_bar_GHI.jpg';

  const translations = {
    ro: {
      badge: 'NOU',
      title: 'Ofertă Specială Nunți 2026',
      subtitle: 'Descoperiți pachetele noastre exclusive pentru nunta visurilor voastre',
      description: 'De la dulciuri artizanale până la torturi personalizate - facem fiecare moment special să fie și mai dulce',
      cta: 'Vezi Oferta Completă',
      feature1: 'Pachete personalizate',
      feature2: 'Animale 3D',
      feature3: 'Mărturii moderne',
      andMore: '...și multe altele',
      brandName: 'Odette',
      collectionName: 'Colecția Nunți',
    },
    en: {
      badge: 'NEW',
      title: 'Special Wedding Offer 2026',
      subtitle: 'Discover our exclusive packages for your dream wedding',
      description: 'From artisan sweets to personalized cakes - we make every special moment even sweeter',
      cta: 'View Full Offer',
      feature1: 'Customized packages',
      feature2: '3D Animals',
      feature3: 'Modern favors',
      andMore: '...and much more',
      brandName: 'Odette',
      collectionName: 'Wedding Collection',
    },
  };

  const t = translations[language] || translations.ro;

  // Get responsive image props for the wedding banner
  const bannerImageProps = getResponsiveBannerProps(weddingImage);

  return (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-blue-50 py-16 md:py-20 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#d4af37] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1e3a8a] opacity-5 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side - Image/Visual */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              {/* Background image */}
              <img
                src={bannerImageProps.src}
                srcSet={bannerImageProps.srcSet}
                sizes={bannerImageProps.sizes}
                alt={t.collectionName}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to gradient if image not found
                  e.target.style.display = 'none';
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/80 to-blue-900/70"></div>
              {/* Text content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="text-3xl font-serif font-bold mb-2">{t.brandName}</h3>
                  <p className="text-blue-200 text-lg">{t.collectionName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left lg:min-h-[420px]">
            {/* New Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4af37] text-white rounded-full text-sm font-semibold mb-4 shadow-lg min-w-[80px] justify-center">
              <Sparkles size={16} />
              {t.badge}
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e3a8a] mb-4 font-serif min-h-[60px] md:min-h-[120px]">
              {t.title}
            </h2>

            {/* Subtitle */}
            <p className="text-xl text-gray-700 mb-4 font-medium min-h-[56px]">
              {t.subtitle}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed min-h-[48px]">
              {t.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8 items-center min-h-[44px]">
              {[t.feature1, t.feature2, t.feature3].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-100"
                >
                  <div className="w-2 h-2 rounded-full bg-[#d4af37]"></div>
                  <span className="text-sm font-medium text-gray-700">{feature}</span>
                </div>
              ))}
              <a
                href={weddingOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[#1e3a8a] italic hover:text-[#d4af37] hover:underline transition-colors cursor-pointer"
              >
                {t.andMore}
              </a>
            </div>

            {/* CTA Button */}
            <a
              href={weddingOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1e3a8a] hover:bg-blue-900 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Heart size={20} />
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingBanner;
