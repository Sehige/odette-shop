import React from 'react';
import { Heart, Check } from 'lucide-react';
import { translations } from '../../data/translations';
import { getProductCardImageUrl } from '../../utils/imageOptimizer';

const ProductCard = ({ product, language, setSelectedProduct, priority = false }) => {
  const t = translations[language];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group cursor-pointer"
    >
      {/* Image - Clickable */}
      <div
        className="relative overflow-hidden aspect-square"
        onClick={() => setSelectedProduct(product)}
      >
        <img
          src={getProductCardImageUrl(product.image_url)}
          alt={product.name_ro}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        {/* Easter Special Badge */}
        {product.isEasterFeatured && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md flex items-center gap-1">
              <span className="text-sm sm:text-base">🐰</span>
              <span className="hidden sm:inline">{language === 'ro' ? 'Paște' : 'Easter'}</span>
            </span>
          </div>
        )}
        {/* Add to Favorites Button (future feature) */}
        {/*<button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition"
        >
          <Heart className="w-5 h-5 text-gray-600" />
        </button>*/}
      </div>
      
      {/* Product Info - Clickable */}
      <div
        className="p-3 sm:p-6"
        onClick={() => setSelectedProduct(product)}
      >
        <div className="flex flex-col items-center mb-2 sm:mb-3 min-h-[2rem] sm:min-h-[3rem]">
          <h3 className="text-sm sm:text-xl font-semibold text-gray-900 line-clamp-2 text-center">
            {language === 'ro' ? product.name_ro : product.name_en}
          </h3>
          {/* Vegan/Vegetarian Indicators - hidden on mobile */}
          {product.isVegetarian && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full mt-1">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                {language === 'ro' ? 'Vegan' : 'Vegan'}
              </span>
            </div>
          )}
        </div>
        <div className="mb-2 sm:mb-4 hidden sm:block h-10">
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-lg sm:text-2xl font-bold" style={{ color: '#1e40af' }}>
            {product.price} {t.lei}{product.price_unit && `/${product.price_unit}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;