// ========================================
// CART & ORDER API SERVICE
// ========================================

import { supabase } from '../lib/supabase'

/**
 * Cart Service
 * Handles all shopping cart operations
 */
export const cartService = {
  /**
   * Get user's cart items
   * @param {string} userId - User ID (null for guest)
   * @param {string} sessionId - Session ID for guests
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getCartItems(userId = null, sessionId = null) {
    try {
      let query = supabase
        .from('cart_items')
        .select(`
          *,
          products (
            id,
            name_ro,
            name_en,
            slug,
            base_price,
            stock_quantity,
            is_active,
            product_images!inner (
              image_url,
              is_primary
            )
          ),
          product_variants (
            id,
            name_ro,
            name_en,
            price_adjustment,
            stock_quantity
          )
        `)

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (sessionId) {
        query = query.eq('session_id', sessionId)
      } else {
        throw new Error('Either userId or sessionId required')
      }

      const { data, error } = await query

      if (error) throw error

      // Filter products with primary images only
      const filteredData = data.filter(item => 
        item.products && 
        item.products.product_images && 
        item.products.product_images.length > 0
      )

      return { data: filteredData, error: null }
    } catch (error) {
      console.error('Error fetching cart items:', error)
      return { data: null, error }
    }
  },

  /**
   * Add item to cart
   * @param {Object} item - Cart item data
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async addToCart(item) {
    try {
      // Check if item already exists in cart
      let existingQuery = supabase
        .from('cart_items')
        .select('*')
        .eq('product_id', item.product_id)

      if (item.user_id) {
        existingQuery = existingQuery.eq('user_id', item.user_id)
      } else {
        existingQuery = existingQuery.eq('session_id', item.session_id)
      }

      if (item.variant_id) {
        existingQuery = existingQuery.eq('variant_id', item.variant_id)
      }

      const { data: existing, error: existingError } = await existingQuery.single()

      if (existingError && existingError.code !== 'PGRST116') {
        throw existingError
      }

      // If exists, update quantity
      if (existing) {
        const newQuantity = existing.quantity + item.quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single()

        if (error) throw error
        return { data, error: null }
      }

      // Otherwise, insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert(item)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { data: null, error }
    }
  },

  /**
   * Update cart item quantity
   * @param {string} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateQuantity(cartItemId, quantity) {
    try {
      if (quantity <= 0) {
        return await this.removeFromCart(cartItemId)
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
      return { data: null, error }
    }
  },

  /**
   * Remove item from cart
   * @param {string} cartItemId - Cart item ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async removeFromCart(cartItemId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { data: null, error }
    }
  },

  /**
   * Clear entire cart
   * @param {string} userId - User ID
   * @param {string} sessionId - Session ID for guests
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async clearCart(userId = null, sessionId = null) {
    try {
      let query = supabase.from('cart_items').delete()

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (sessionId) {
        query = query.eq('session_id', sessionId)
      } else {
        throw new Error('Either userId or sessionId required')
      }

      const { data, error } = await query.select()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { data: null, error }
    }
  },

  /**
   * Migrate guest cart to user account
   * @param {string} sessionId - Guest session ID
   * @param {string} userId - User ID
   * @returns {Promise<{success: boolean, error: Error|null}>}
   */
  async migrateGuestCart(sessionId, userId) {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update({ 
          user_id: userId,
          session_id: null 
        })
        .eq('session_id', sessionId)
        .select()

      if (error) throw error

      return { success: true, error: null }
    } catch (error) {
      console.error('Error migrating cart:', error)
      return { success: false, error }
    }
  },

  /**
   * Get cart total
   * @param {Array} cartItems - Cart items array
   * @returns {Object} Cart totals
   */
  calculateCartTotals(cartItems) {
    let subtotal = 0
    let itemCount = 0

    cartItems.forEach(item => {
      const basePrice = parseFloat(item.products.base_price)
      const variantPrice = item.product_variants 
        ? parseFloat(item.product_variants.price_adjustment || 0)
        : 0
      const itemPrice = basePrice + variantPrice
      
      subtotal += itemPrice * item.quantity
      itemCount += item.quantity
    })

    return {
      subtotal: subtotal.toFixed(2),
      itemCount,
      items: cartItems.length
    }
  }
}

/**
 * Order Service
 * Handles all order operations
 */
export const orderService = {
  /**
   * Create new order
   * @param {Object} orderData - Order information
   * @param {Array} cartItems - Cart items to include in order
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async createOrder(orderData, cartItems) {
    try {
      // Start a Supabase transaction (using RPC function)
      // First, create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          order_number: await this.generateOrderNumber()
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name_ro: item.products.name_ro,
        product_name_en: item.products.name_en,
        variant_name_ro: item.product_variants?.name_ro || null,
        variant_name_en: item.product_variants?.name_en || null,
        unit_price: parseFloat(item.products.base_price) + 
                   (item.product_variants ? parseFloat(item.product_variants.price_adjustment || 0) : 0),
        quantity: item.quantity,
        subtotal: (parseFloat(item.products.base_price) + 
                  (item.product_variants ? parseFloat(item.product_variants.price_adjustment || 0) : 0)) * 
                  item.quantity,
        special_instructions: item.special_instructions
      }))

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()

      if (itemsError) throw itemsError

      // Update inventory
      for (const item of cartItems) {
        if (item.variant_id) {
          await supabase
            .from('product_variants')
            .update({
              stock_quantity: supabase.rpc('decrement', { 
                x: item.quantity 
              })
            })
            .eq('id', item.variant_id)
        } else {
          await supabase
            .from('products')
            .update({
              stock_quantity: supabase.rpc('decrement', { 
                x: item.quantity 
              })
            })
            .eq('id', item.product_id)
        }
      }

      // Clear cart after successful order
      if (orderData.user_id) {
        await cartService.clearCart(orderData.user_id)
      }

      return { 
        data: { 
          ...order, 
          order_items: items 
        }, 
        error: null 
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return { data: null, error }
    }
  },

  /**
   * Generate unique order number
   * @returns {Promise<string>}
   */
  async generateOrderNumber() {
    try {
      const { data, error } = await supabase
        .rpc('generate_order_number')

      if (error) throw error

      return data
    } catch (error) {
      // Fallback if function doesn't exist
      const prefix = 'ODT'
      const year = new Date().getFullYear()
      const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0')
      return `${prefix}-${year}-${random}`
    }
  },

  /**
   * Get user's orders
   * @param {string} userId - User ID
   * @param {number} limit - Number of orders to return
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getUserOrders(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name_ro,
              name_en,
              product_images!inner (
                image_url,
                is_primary
              )
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return { data: null, error }
    }
  },

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getOrderById(orderId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name_ro,
              name_en,
              slug
            )
          ),
          order_status_history (
            *
          )
        `)
        .eq('id', orderId)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching order:', error)
      return { data: null, error }
    }
  },

  /**
   * Get order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async getOrderByNumber(orderNumber) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name_ro,
              name_en
            )
          )
        `)
        .eq('order_number', orderNumber)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching order by number:', error)
      return { data: null, error }
    }
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status
   * @param {string} notes - Optional notes
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async updateOrderStatus(orderId, newStatus, notes = null) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          ...(notes && { admin_notes: notes })
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating order status:', error)
      return { data: null, error }
    }
  },

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<{data: Object, error: Error|null}>}
   */
  async cancelOrder(orderId, reason = null) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          admin_notes: reason
        })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error

      // TODO: Restore inventory

      return { data, error: null }
    } catch (error) {
      console.error('Error cancelling order:', error)
      return { data: null, error }
    }
  },

  /**
   * Calculate delivery fee based on location
   * @param {string} city - Delivery city
   * @param {number} subtotal - Order subtotal
   * @returns {Promise<number>} Delivery fee
   */
  async calculateDeliveryFee(city, subtotal) {
    try {
      // Get delivery settings
      const { data: settings } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'delivery_fee')
        .single()

      const deliverySettings = settings?.setting_value || { default: 15, free_over: 100 }

      // Free delivery over threshold
      if (subtotal >= deliverySettings.free_over) {
        return 0
      }

      // Check delivery zones
      const { data: zones } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'delivery_zones')
        .single()

      const deliveryZones = zones?.setting_value || {}

      // Return zone-specific fee or default
      const cityLower = city.toLowerCase()
      for (const [zone, fee] of Object.entries(deliveryZones)) {
        if (cityLower.includes(zone.toLowerCase())) {
          return fee
        }
      }

      return deliverySettings.default
    } catch (error) {
      console.error('Error calculating delivery fee:', error)
      return 15 // Default fallback
    }
  }
}

export default {
  cartService,
  orderService
}