import React from 'react';
import { translations } from '../../data/translations';
import ProductCard from '../product/ProductCard';

const ShopPage = ({ language, products, filter, setFilter, addToCart, setSelectedProduct }) => {
  const t = translations[language];
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.shop}</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'all'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'all' ? { backgroundColor: '#d4af37' } : {}}
            >
              All
            </button>
            <button
              onClick={() => setFilter('cakes')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'cakes'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'cakes' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.cakes}
            </button>
            <button
              onClick={() => setFilter('pastries')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'pastries'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'pastries' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.pastries}
            </button>
            <button
              onClick={() => setFilter('cookies')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'cookies'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'cookies' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.cookies}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;