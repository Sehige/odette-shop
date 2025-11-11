// ========================================
// FILE: src/components/products/ProductDetail.jsx
// ========================================

import React, { useState } from 'react'
import { cartService } from '../services/cartOrderService'
import { useAuth } from '../hooks/useAuth'

function ProductDetail({ product }) {
  const { user } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)

  async function handleAddToCart() {
    try {
      // 🔥 Add to cart in database
      const { data, error } = await cartService.addToCart({
        user_id: user?.id || null,
        session_id: !user ? getSessionId() : null, // For guests
        product_id: product.id,
        variant_id: selectedVariant?.id || null,
        quantity: quantity
      })

      if (error) throw error

      alert('Added to cart!')
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert('Failed to add to cart')
    }
  }

  return (
    <div className="product-detail">
      <h1>{product.name_ro}</h1>
      <p>{product.description_ro}</p>
      
      {/* Variant selector */}
      {product.product_variants?.length > 0 && (
        <div className="variants">
          <label>Size:</label>
          {product.product_variants.map(variant => (
            <button
              key={variant.id}
              onClick={() => setSelectedVariant(variant)}
              className={selectedVariant?.id === variant.id ? 'active' : ''}
            >
              {variant.name_ro}
            </button>
          ))}
        </div>
      )}

      {/* Quantity selector */}
      <div className="quantity">
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />
      </div>

      {/* Add to cart button */}
      <button onClick={handleAddToCart} className="btn-primary">
        Add to Cart - {product.base_price} RON
      </button>
    </div>
  )
}

export default ProductDetail