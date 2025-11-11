/**
 * Cart and Order Service
 * Handles cart operations and order processing for Odette Pastry Shop
 */

// Calculate cart totals
export const calculateCartTotals = (cartItems) => {
  const subtotal = cartItems.reduce((total, item) => {
    const basePrice = item.product.price || 0;
    const sizeMultiplier = item.size?.priceMultiplier || 1;
    const itemPrice = basePrice * sizeMultiplier * item.quantity;
    return total + itemPrice;
  }, 0);

  return {
    subtotal: subtotal.toFixed(2),
    itemCount: cartItems.reduce((count, item) => count + item.quantity, 0)
  };
};

// Format price with currency
export const formatPrice = (price, currency = 'RON') => {
  return `${parseFloat(price).toFixed(2)} ${currency}`;
};

// Validate cart item before adding
export const validateCartItem = (product, options = {}) => {
  if (!product || !product.id) {
    throw new Error('Invalid product');
  }

  if (options.quantity && options.quantity < 1) {
    throw new Error('Quantity must be at least 1');
  }

  // Check if product requires size selection
  if (product.sizes && product.sizes.length > 0 && !options.size) {
    throw new Error('Please select a size');
  }

  // Check if product requires flavor selection
  if (product.flavors && product.flavors.length > 0 && !options.flavor) {
    throw new Error('Please select a flavor');
  }

  return true;
};

// Create cart item object
export const createCartItem = (product, options = {}) => {
  validateCartItem(product, options);

  return {
    id: `${product.id}-${options.size?.value || 'default'}-${options.flavor?.value || 'default'}-${Date.now()}`,
    product,
    quantity: options.quantity || 1,
    size: options.size,
    flavor: options.flavor,
    addedAt: new Date().toISOString()
  };
};

// Get cart from localStorage
export const getStoredCart = () => {
  try {
    const stored = localStorage.getItem('odette_cart');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to localStorage
export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('odette_cart', JSON.stringify(cartItems));
    return true;
  } catch (error) {
    console.error('Error saving cart to storage:', error);
    return false;
  }
};

// Clear cart from localStorage
export const clearStoredCart = () => {
  try {
    localStorage.removeItem('odette_cart');
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Generate order number
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `OD${timestamp}${random}`;
};

// Validate order data
export const validateOrderData = (orderData) => {
  const errors = {};

  // Validate name
  if (!orderData.name || orderData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!orderData.email || !emailRegex.test(orderData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate phone
  const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
  if (!orderData.phone || !phoneRegex.test(orderData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  // Validate address (if delivery)
  if (orderData.deliveryMethod === 'delivery') {
    if (!orderData.address || orderData.address.trim().length < 5) {
      errors.address = 'Please enter a valid delivery address';
    }
    if (!orderData.city || orderData.city.trim().length < 2) {
      errors.city = 'Please enter a city';
    }
    if (!orderData.postalCode) {
      errors.postalCode = 'Please enter a postal code';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Create order object
export const createOrder = (cartItems, orderData) => {
  const { subtotal, itemCount } = calculateCartTotals(cartItems);
  const deliveryFee = orderData.deliveryMethod === 'delivery' ? 15 : 0;
  const total = (parseFloat(subtotal) + deliveryFee).toFixed(2);

  return {
    orderNumber: generateOrderNumber(),
    items: cartItems,
    customer: {
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address || '',
      city: orderData.city || '',
      postalCode: orderData.postalCode || ''
    },
    deliveryMethod: orderData.deliveryMethod,
    paymentMethod: orderData.paymentMethod,
    deliveryDate: orderData.deliveryDate,
    deliveryTime: orderData.deliveryTime,
    specialInstructions: orderData.notes || '',
    pricing: {
      subtotal: parseFloat(subtotal),
      deliveryFee,
      total: parseFloat(total)
    },
    status: 'pending',
    createdAt: new Date().toISOString()
  };
};

// Submit order (this would typically make an API call)
export const submitOrder = async (order) => {
  try {
    // In a real application, this would be an API call to your backend
    // For now, we'll simulate a successful submission
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store order in localStorage for demo purposes
    const orders = JSON.parse(localStorage.getItem('odette_orders') || '[]');
    orders.push(order);
    localStorage.setItem('odette_orders', JSON.stringify(orders));

    return {
      success: true,
      order
    };
  } catch (error) {
    console.error('Error submitting order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get order by order number
export const getOrder = (orderNumber) => {
  try {
    const orders = JSON.parse(localStorage.getItem('odette_orders') || '[]');
    return orders.find(order => order.orderNumber === orderNumber);
  } catch (error) {
    console.error('Error retrieving order:', error);
    return null;
  }
};

// Get all orders (for admin or user account)
export const getAllOrders = () => {
  try {
    return JSON.parse(localStorage.getItem('odette_orders') || '[]');
  } catch (error) {
    console.error('Error retrieving orders:', error);
    return [];
  }
};

// Generate or retrieve session ID for tracking anonymous users
export const getSessionId = () => {
  try {
    let sessionId = sessionStorage.getItem('odette_session_id');
    
    if (!sessionId) {
      // Generate a new session ID
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('odette_session_id', sessionId);
    }
    
    return sessionId;
  } catch (error) {
    console.error('Error managing session ID:', error);
    // Return a temporary session ID if storage fails
    return `temp_session_${Date.now()}`;
  }
};

// Clear session (useful for logout or session reset)
export const clearSession = () => {
  try {
    sessionStorage.removeItem('odette_session_id');
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};

export default {
  calculateCartTotals,
  formatPrice,
  validateCartItem,
  createCartItem,
  getStoredCart,
  saveCartToStorage,
  clearStoredCart,
  generateOrderNumber,
  validateOrderData,
  createOrder,
  submitOrder,
  getOrder,
  getAllOrders,
  getSessionId,
  clearSession
};