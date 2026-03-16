import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { translations } from '../../data/translations';
import ProductCard from '../products/ProductCard';
import TrustBadges from '../home/TrustBadges';

import { useAllProducts, useCategories } from '../../hooks/useProducts';

const ShopPage = ({ language, setSelectedProduct }) => {
  const t = translations[language];
  const shopT = translations[language].shop;
  const [searchParams, setSearchParams] = useSearchParams();

  const { products: allProducts, loading: productsLoading, error: productsError } = useAllProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    if (filterParam) {
      setSelectedCategory(filterParam);
    }
  }, [searchParams]);

  console.log('Categories in ShopPage:', categories);
  
  const filteredProducts = selectedCategory === 'all' 
    ? allProducts 
    : allProducts.filter(p => p.category === selectedCategory);

  // Loading state - use skeleton that matches final layout to prevent CLS
  if (productsLoading || categoriesLoading) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton Header */}
          <div className="text-center mb-12 min-h-[120px]">
            <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-3 min-h-[44px]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {shopT.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            {shopT.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - min-height matches skeleton to prevent CLS */}
        <div className="text-center mb-12 min-h-[120px]">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {shopT.title}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'ro'
              ? `Descoperă ${allProducts.length} ${shopT.productsCount}`
              : `Discover ${allProducts.length} ${shopT.productsCount}`}
          </p>
        </div>
        
        {/* Category Filter - min-height to prevent CLS */}
        <div className="mb-8 flex flex-wrap justify-center gap-3 min-h-[44px]">
          {/* All Products Button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {shopT.all} ({allProducts.length})
          </button>
          
          {/* Category Buttons */}
          {categories.map(category => {
            const count = allProducts.filter(p => p.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'ro' ? category.name_ro : category.name_en} ({count})
              </button>
            );
          })}
        </div>
                
        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                setSelectedProduct={setSelectedProduct}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {shopT.noProducts}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;