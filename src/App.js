import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Data imports
import { productsData } from './data/productsData';

// Layout components
import Layout from './components/layout/Layout';

// Product components
import ProductDetail from './components/products/ProductDetail';

// Cart components
import ShoppingCartSidebar from './components/cart/ShoppingCartSidebar';

// Page components
import HomePage from './components/pages/HomePage';
import ShopPage from './components/shop/ShopPage';
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderConfirmation from './components/checkout/OrderConfirmation';
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import EventsPage from './components/pages/EventsPage';


function App() {
  const [language, setLanguage] = useState('ro');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToCart = (product, options = {}) => {
    const cartItem = {
      id: `${product.id}-${options.size || ''}-${options.flavor || ''}-${Date.now()}`,
      product,
      quantity: options.quantity || 1,
      size: options.size,
      flavor: options.flavor
    };
    setCartItems([...cartItems, cartItem]);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                language={language}
                setLanguage={setLanguage}
                cartItemsCount={cartItems.length}
                setShowCart={setShowCart}
              />
            }
          >
            <Route
              index
              element={
                <HomePage
                  language={language}
                  addToCart={addToCart}
                  setSelectedProduct={setSelectedProduct}
                />
              }
            />
            <Route
              path="shop"
              element={
                <ShopPage
                  language={language}
                  products={productsData}
                  addToCart={addToCart}
                  setSelectedProduct={setSelectedProduct}
                />
              }
            />
            <Route
              path="about"
              element={<AboutPage language={language} />}
            />
            <Route
              path="events"
              element={<EventsPage language={language} />}
            />
            <Route
              path="contact"
              element={<ContactPage language={language} />}
            />
            <Route
              path="checkout"
              element={
                cartItems.length > 0 ? (
                  <CheckoutPage
                    language={language}
                    cartItems={cartItems}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="order-confirmation/:orderNumber"
              element={<OrderConfirmation language={language} />}
            />
          </Route>
        </Routes>

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <ShoppingCartSidebar
            language={language}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onClose={() => setShowCart(false)}
          />
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            language={language}
            addToCart={addToCart}
            onClose={() => setSelectedProduct(null)}
            allProducts={productsData}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;