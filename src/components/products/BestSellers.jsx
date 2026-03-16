/**
 * BestSellers Component
 * 
 * Displays only products marked as best sellers in a horizontal carousel layout.
 * Perfect for homepage or featured sections.
 * 
 * Path: /src/components/products/BestSellers.jsx
 */

import React from 'react';
import { useBestSellers } from '../../hooks/useProducts';
import { getProductCardImageUrl } from '../../utils/imageOptimizer';

const BestSellers = () => {
  const { bestSellers, loading, error } = useBestSellers();

  // Loading state
  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#1e3a8a]"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Error loading best sellers</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!bestSellers || bestSellers.length === 0) {
    return null; // Don't show section if no best sellers
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header with Gold Accent */}
        <div className="text-center mb-10">
          <div className="inline-block mb-3">
            <span className="text-5xl">⭐</span>
          </div>
          <h2 className="text-4xl font-bold text-[#1e3a8a] mb-3">
            Best Sellers
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Our customers' favorite sweets
          </p>
        </div>

        {/* Best Sellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellers.map((product, index) => (
            <BestSellerCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * BestSellerCard Component
 * Styled card specifically for best seller products
 */
const BestSellerCard = ({ product, priority = false }) => {
  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      {/* Gold Border on Hover */}
      <div className="absolute inset-0 border-4 border-transparent group-hover:border-yellow-400 rounded-xl transition-all duration-300 pointer-events-none"></div>

      {/* Best Seller Star Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2 shadow-lg">
        <span className="text-white text-xl">⭐</span>
      </div>

      {/* Product Image */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={getProductCardImageUrl(product.image_url)}
            alt={product.name_ro || product.name_en}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6]">
            <span className="text-white text-5xl">🍰</span>
          </div>
        )}
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {product.category && (
          <span className="inline-block text-xs font-bold text-[#1e3a8a] bg-blue-50 px-3 py-1 rounded-full mb-3">
            {product.category.toUpperCase()}
          </span>
        )}

        {/* Name */}
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {language === 'ro' ? product.name_ro : product.name_en}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Starting from</p>
            <p className="text-3xl font-bold text-[#1e3a8a]">
              ${product.price?.toFixed(2)}
            </p>
          </div>
          
          {/* Rating (if you have it) */}
          {product.rating && (
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm font-semibold text-gray-700">
                  {product.rating}
                </span>
              </div>
              {product.review_count && (
                <p className="text-xs text-gray-500">
                  {product.review_count} reviews
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Button 
        <button className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white font-semibold py-3 px-6 rounded-lg hover:from-[#1e40af] hover:to-[#2563eb] transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105">
          View Details
        </button>*/}
      </div>
    </div>
  );
};

export default BestSellers;