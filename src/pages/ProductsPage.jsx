// ========================================
// FILE: src/pages/ProductsPage.jsx
// ========================================

import React, { useState, useEffect } from 'react'
import { productService } from '../services/productService'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    try {
      setLoading(true)
      
      // 🔥 This is where we use the database!
      const { data, error } = await productService.getProducts({
        featured: true,
        limit: 12
      })

      if (error) throw error

      setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="products-page">
      <h1>Our Products</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductsPage