import React from 'react';
import { Heart, Check } from 'lucide-react';
import { translations } from '../../data/translations';

const ProductCard = ({ product, language, setSelectedProduct }) => {
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
          src={product.image_url}
          alt={product.name_ro}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
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
        className="p-6"
        onClick={() => setSelectedProduct(product)}
      >
        <div className="flex items-center gap-2 mb-3 h-12">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {language === 'ro' ? product.name_ro : product.name_en}
          </h3>
          {/* Vegan/Vegetarian Indicators */}
          {product.isVegetarian && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                {language === 'ro' ? 'Vegan' : 'Vegan'}
              </span>
            </div>
          )}
          {product.isVegetarian && !product.isVegetarian && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs font-medium text-green-600">
                {language === 'ro' ? 'Vegetarian' : 'Vegetarian'}
              </span>
            </div>
          )}
        </div>
        <div className="mb-4 h-10">
          <p className="text-gray-600 text-sm line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: '#1e40af' }}>
            {product.price} {t.lei}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;