// ========================================
// FILE: src/components/products/ProductCard.jsx
// ========================================

import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  // Get primary image
  const primaryImage = product.product_images?.find(img => img.is_primary)
  const imageUrl = primaryImage?.image_url || '/placeholder-cake.jpg'

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      {/* Product Image */}
      <div className="product-card__image">
        <img src={imageUrl} alt={product.name_en} />
        
        {/* Badges */}
        {product.is_best_seller && (
          <span className="badge badge--bestseller">Best Seller</span>
        )}
        {product.is_new && (
          <span className="badge badge--new">New</span>
        )}
      </div>

      {/* Product Info */}
      <div className="product-card__content">
        <h3 className="product-card__title">
          {product.name_ro} / {product.name_en}
        </h3>
        
        <p className="product-card__description">
          {product.short_description_ro}
        </p>

        {/* Price */}
        <div className="product-card__price">
          {product.compare_at_price && (
            <span className="price--old">{product.compare_at_price} RON</span>
          )}
          <span className="price--current">{product.base_price} RON</span>
        </div>

        {/* Stock Status */}
        {product.stock_quantity > 0 ? (
          <span className="stock--available">In Stock</span>
        ) : (
          <span className="stock--unavailable">Out of Stock</span>
        )}
      </div>
    </Link>
  )
}

export default ProductCard