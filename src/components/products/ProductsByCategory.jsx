/**
 * ProductsByCategory Component
 * 
 * Demonstrates filtering products by category with a dropdown selector.
 * Shows how to use the useProductsByCategory hook.
 * 
 * Path: /src/components/products/ProductsByCategory.jsx
 */

import React, { useState } from 'react';
import { useProductsByCategory, useCategories } from '../../hooks/useProducts';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

const ProductsByCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const { categories, loading: categoriesLoading } = useCategories();
  const { products, loading: productsLoading, error } = useProductsByCategory(selectedCategory);

  // Show all products initially
  const showProducts = selectedCategory !== '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#1e3a8a] mb-4">
          Browse by Category
        </h2>
        
        {/* Category Selector */}
        <div className="max-w-md">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select a Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
            disabled={categoriesLoading}
          >
            <option value="">-- Choose a category --</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Section */}
      {showProducts && (
        <>
          {/* Loading State */}
          {productsLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a] mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600">Error loading products: {error.message}</p>
            </div>
          )}

          {/* Products Grid */}
          {!productsLoading && !error && (
            <>
              {products.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                      {selectedCategory} 
                      <span className="text-gray-500 font-normal ml-2">
                        ({products.length} {products.length === 1 ? 'item' : 'items'})
                      </span>
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <CategoryProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <p className="text-gray-600 text-lg">
                    No products found in this category
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Initial State - Show message when no category selected */}
      {!showProducts && !categoriesLoading && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">🍰</div>
          <p className="text-gray-700 text-lg mb-2">
            Select a category above to browse our delicious products
          </p>
          <p className="text-gray-500">
            We have {categories.length} categories to choose from
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * CategoryProductCard Component
 * Simple product card for category view
 */
const CategoryProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-100">
        {product.image_url ? (
          <img
            src={getOptimizedImageUrl(product.image_url, { width: 400 })}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
            <span className="text-white text-4xl">🍰</span>
          </div>
        )}
        
        {/* Best Seller Badge */}
        {product.best_seller_flag && (
          <div className="absolute top-2 right-2">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              ⭐ Bestseller
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h4>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-[#1e3a8a]">
            ${product.price?.toFixed(2)}
          </span>
          <button className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded-md hover:bg-[#1e40af] transition-colors text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsByCategory;