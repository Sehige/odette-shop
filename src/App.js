import React, { useState } from 'react';

// Data imports
import { productsData } from './data/productsData';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Home page components
import HeroSection from './components/home/HeroSection';
import BestSellers from './components/home/BestSellers';
import FeaturedCategories from './components/home/FeaturedCategories';

// Product components
import ProductDetail from './components/products/ProductDetail';

// Cart components
import ShoppingCartSidebar from './components/cart/ShoppingCartSidebar';

// Shop components
import ShopPage from './components/shop/ShopPage';

// Checkout components
import CheckoutPage from './components/checkout/CheckoutPage';
import OrderConfirmation from './components/checkout/OrderConfirmation';

// Other pages
import AboutPage from './components/pages/AboutPage';
import ContactPage from './components/pages/ContactPage';
import EventsPage from './components/pages/EventsPage';
import BlogPage from './components/pages/AboutPage';

function App() {
  const [language, setLanguage] = useState('ro');
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('all');
  const [orderData, setOrderData] = useState(null);
  const [orderNumber, setOrderNumber] = useState(null);

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

  const handleOrderComplete = (formData) => {
    const orderNum = Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(orderNum);
    setOrderData(formData);
    setCartItems([]);
    setCurrentPage('confirmation');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        language={language}
        setLanguage={setLanguage}
        cartItems={cartItems}
        setCurrentPage={setCurrentPage}
        setShowCart={setShowCart}
      />

      {currentPage === 'home' && (
        <>
          <HeroSection language={language} setCurrentPage={setCurrentPage} />
          <BestSellers
            language={language}
            products={productsData}
            addToCart={addToCart}
            setSelectedProduct={setSelectedProduct}
          />
          <FeaturedCategories
            language={language}
            setCurrentPage={setCurrentPage}
            setFilter={setFilter}
          />
        </>
      )}

      {currentPage === 'shop' && (
        <ShopPage
          language={language}
          products={productsData}
          filter={filter}
          setFilter={setFilter}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {currentPage === 'checkout' && cartItems.length > 0 && (
        <CheckoutPage
          language={language}
          cartItems={cartItems}
          onOrderComplete={handleOrderComplete}
        />
      )}

      {currentPage === 'confirmation' && (
        <OrderConfirmation
          language={language}
          orderNumber={orderNumber}
          orderData={orderData}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === 'about' && (
        <AboutPage language={language} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'events' && (
        <EventsPage language={language} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === 'contact' && (
        <ContactPage language={language} setCurrentPage={setCurrentPage} />
      )}

      <Footer language={language} setCurrentPage={setCurrentPage} />

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <ShoppingCartSidebar
          language={language}
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
          onClose={() => setShowCart(false)}
          setCurrentPage={setCurrentPage}
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
  );
}

export default App;