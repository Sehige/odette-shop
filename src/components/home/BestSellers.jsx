import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../../data/translations';
import ProductCard from '../products/ProductCard';
import { useBestSellers } from '../../hooks/useProducts';

const BestSellers = ({ language, addToCart, setSelectedProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(true);
  const t = translations[language];
  
  const { bestSellers, loading, error } = useBestSellers();

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading best sellers...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Failed to load best sellers</p>
          </div>
        </div>
      </section>
    );
  }

  if (!bestSellers || bestSellers.length === 0) {
    return null; // Don't show section if no best sellers
  }
  
  // Create infinite carousel effect by getting products in a circular manner
  const getVisibleProducts = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % bestSellers.length;
      visible.push(bestSellers[index]);
    }
    return visible;
  };
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + bestSellers.length) % bestSellers.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.bestSellers}
          </h2>
          <p className="text-xl text-gray-600">{t.bestSellersSubtitle}</p>
        </div>

        <div className="relative">
          {/* Carousel - Always shows 4 products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {getVisibleProducts().map((product, idx) => (
              <ProductCard 
                key={`${product.id}-${currentIndex}-${idx}`}
                product={product}
                language={language}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {bestSellers.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === currentIndex ? 'w-8' : ''
              }`}
              style={{ 
                backgroundColor: index === currentIndex ? '#d4af37' : '#d1d5db' 
              }}
              aria-label={`Go to product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;