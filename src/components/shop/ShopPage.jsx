import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { translations } from '../../data/translations';
import ProductCard from '../products/ProductCard';
import TrustBadges from '../home/TrustBadges';

import { useAllProducts, useCategories } from '../../hooks/useProducts';

const ShopPage = ({ language, addToCart, setSelectedProduct }) => {
  const t = translations[language];
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

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {language === 'ro' ? 'Se încarcă produsele...' : 'Loading products...'}
          </p>
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
            {language === 'ro' ? 'Eroare la încărcarea produselor' : 'Error loading products'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            {language === 'ro' ? 'Încercați din nou' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {language === 'ro' ? 'Magazin' : 'Shop'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'ro' 
              ? `Descoperă ${allProducts.length} produse delicioase` 
              : `Discover ${allProducts.length} delicious products`}
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {/* All Products Button */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {language === 'ro' ? 'Toate' : 'All'} ({allProducts.length})
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
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {language === 'ro' 
                ? 'Nu am găsit produse în această categorie' 
                : 'No products found in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;