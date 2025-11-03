import React from 'react';
import { Heart } from 'lucide-react';
import { translations } from '../../data/translations';

const ProductCard = ({ product, language, addToCart, setSelectedProduct }) => {
  const t = translations[language];
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name[language]}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {product.description[language]}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold" style={{ color: '#d4af37' }}>
            {product.price} {t.lei}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex-1 border-2 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
          >
            {t.viewDetails}
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            style={{ backgroundColor: '#d4af37' }}
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;