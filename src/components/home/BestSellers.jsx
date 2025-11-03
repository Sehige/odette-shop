import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from '../../data/translations';
import ProductCard from '../product/ProductCard';

const BestSellers = ({ language, products, addToCart, setSelectedProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[language];
  
  const bestSellers = products.filter(p => p.bestseller);
  
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
          {/* Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestSellers.slice(currentIndex, currentIndex + 3).map((product, idx) => (
              <ProductCard 
                key={product.id}
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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;