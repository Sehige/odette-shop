import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Instagram, Facebook, Heart, Star, Minus, Plus, Trash2, Calendar } from 'lucide-react';

// Translation data
const translations = {
  ro: {
    // Header
    home: 'Acasă',
    shop: 'Magazin',
    cakes: 'Torturi',
    pastries: 'Prăjituri',
    cookies: 'Cookies',
    events: 'Evenimente',
    about: 'Despre Noi',
    contact: 'Contact',
    
    // Hero
    heroTitle: 'Patiserie Artizanală, Făcută Proaspătă Zilnic',
    heroSubtitle: 'Descoperiți eleganța în fiecare bucată. Torturi premium și prăjituri made with love.',
    shopNow: 'Comandă Acum',
    
    // Best Sellers
    bestSellers: 'Cele Mai Vândute',
    bestSellersSubtitle: 'Produsele noastre cele mai iubite',
    addToCart: 'Adaugă în Coș',
    viewDetails: 'Vezi Detalii',
    
    // Categories
    categories: 'Categorii',
    categoriesSubtitle: 'Explorează colecția noastră',
    
    // Trust badges
    freshDaily: 'Proaspăt Zilnic',
    localIngredients: 'Ingrediente Locale',
    customOrders: 'Comenzi Personalizate',
    expressDelivery: 'Livrare Express',
    
    // Product
    selectSize: 'Selectează Mărimea',
    selectFlavor: 'Selectează Aroma',
    quantity: 'Cantitate',
    ingredients: 'Ingrediente',
    allergens: 'Alergeni',
    goesWellWith: 'Se Potrivește Bine Cu',
    
    // Cart
    cart: 'Coș de Cumpărături',
    cartEmpty: 'Coșul tău este gol',
    continueShopping: 'Continuă Cumpărăturile',
    subtotal: 'Subtotal',
    deliveryFee: 'Taxa de Livrare',
    total: 'Total',
    checkout: 'Finalizează Comanda',
    
    // Checkout
    checkoutTitle: 'Finalizare Comandă',
    customerInfo: 'Informații Client',
    name: 'Nume Complet',
    email: 'Email',
    phone: 'Telefon',
    deliveryAddress: 'Adresă de Livrare',
    street: 'Strada și Numărul',
    city: 'Oraș',
    postalCode: 'Cod Poștal',
    deliveryDate: 'Data Livrării',
    selectDate: 'Selectează Data',
    deliveryTime: 'Interval Orar (opțional)',
    specialInstructions: 'Observații Speciale',
    instructionsPlaceholder: 'Ex: Doresc mesaj personalizat, alergii, preferințe',
    paymentMethod: 'Metodă de Plată',
    cardOnline: 'Card Online',
    cashOnDelivery: 'Cash la Livrare',
    bankTransfer: 'Transfer Bancar',
    agreeTerms: 'Sunt de acord cu',
    termsConditions: 'Termenii și Condițiile',
    subscribeNewsletter: 'Doresc să primesc oferte și noutăți',
    placeOrder: 'Plasează Comanda',
    orderSummary: 'Sumar Comandă',
    
    // Order Confirmation
    orderConfirmed: 'Comandă Confirmată!',
    orderNumber: 'Număr Comandă',
    thankYou: 'Mulțumim pentru comandă!',
    orderEmail: 'Veți primi un email de confirmare cu detaliile comenzii.',
    estimatedDelivery: 'Dată estimată de livrare',
    backToHome: 'Înapoi la Pagina Principală',
    
    // Footer
    quickLinks: 'Link-uri Rapide',
    followUs: 'Urmărește-ne',
    allRightsReserved: 'Toate drepturile rezervate',
    
    // Common
    lei: 'lei',
    piece: 'bucată',
    close: 'Închide',
  },
  en: {
    // Header
    home: 'Home',
    shop: 'Shop',
    cakes: 'Cakes',
    pastries: 'Pastries',
    cookies: 'Cookies',
    events: 'Events',
    about: 'About',
    contact: 'Contact',
    
    // Hero
    heroTitle: 'Artisan Pastries, Made Fresh Daily',
    heroSubtitle: 'Discover elegance in every bite. Premium cakes and pastries made with love.',
    shopNow: 'Shop Now',
    
    // Best Sellers
    bestSellers: 'Best Sellers',
    bestSellersSubtitle: 'Our most loved products',
    addToCart: 'Add to Cart',
    viewDetails: 'View Details',
    
    // Categories
    categories: 'Categories',
    categoriesSubtitle: 'Explore our collection',
    
    // Trust badges
    freshDaily: 'Fresh Daily',
    localIngredients: 'Local Ingredients',
    customOrders: 'Custom Orders',
    expressDelivery: 'Express Delivery',
    
    // Product
    selectSize: 'Select Size',
    selectFlavor: 'Select Flavor',
    quantity: 'Quantity',
    ingredients: 'Ingredients',
    allergens: 'Allergens',
    goesWellWith: 'Goes Well With',
    
    // Cart
    cart: 'Shopping Cart',
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    total: 'Total',
    checkout: 'Checkout',
    
    // Checkout
    checkoutTitle: 'Checkout',
    customerInfo: 'Customer Information',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    deliveryAddress: 'Delivery Address',
    street: 'Street and Number',
    city: 'City',
    postalCode: 'Postal Code',
    deliveryDate: 'Delivery Date',
    selectDate: 'Select Date',
    deliveryTime: 'Time Window (optional)',
    specialInstructions: 'Special Instructions',
    instructionsPlaceholder: 'E.g., Custom message, allergies, preferences',
    paymentMethod: 'Payment Method',
    cardOnline: 'Card Online',
    cashOnDelivery: 'Cash on Delivery',
    bankTransfer: 'Bank Transfer',
    agreeTerms: 'I agree to the',
    termsConditions: 'Terms and Conditions',
    subscribeNewsletter: 'I want to receive offers and news',
    placeOrder: 'Place Order',
    orderSummary: 'Order Summary',
    
    // Order Confirmation
    orderConfirmed: 'Order Confirmed!',
    orderNumber: 'Order Number',
    thankYou: 'Thank you for your order!',
    orderEmail: 'You will receive a confirmation email with order details.',
    estimatedDelivery: 'Estimated delivery date',
    backToHome: 'Back to Home',
    
    // Footer
    quickLinks: 'Quick Links',
    followUs: 'Follow Us',
    allRightsReserved: 'All rights reserved',
    
    // Common
    lei: 'RON',
    piece: 'piece',
    close: 'Close',
  }
};

// Product images - using high-quality stock photos
const CAKE_IMAGE = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80'; // Chocolate cake
const ECLAIR_IMAGE = 'https://images.unsplash.com/photo-1612201142855-3de24e9fccb4?w=800&q=80'; // Eclairs
const MACARON_IMAGE = 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&q=80'; // Macarons
const RED_VELVET_IMAGE = 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&q=80'; // Red Velvet Cake
const CROISSANT_IMAGE = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80'; // Croissant
const BERRY_TART_IMAGE = 'https://images.unsplash.com/photo-1519915212116-7cfef71f1d3e?w=800&q=80'; // Berry Tart
const HERO_IMAGE = 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1600&q=80'; // Wedding cake for hero

// Sample product data
const productsData = [
  {
    id: 1,
    name: { ro: 'Tort Ciocolată Premium', en: 'Premium Chocolate Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort cu ciocolată belgiană, cremă fină și glazură lucioasă',
      en: 'Cake with Belgian chocolate, fine cream and glossy glaze'
    },
    price: 180,
    image: CAKE_IMAGE,
    sizes: ['1kg', '1.5kg', '2kg'],
    flavors: { ro: ['Ciocolată', 'Ciocolată cu Vișine'], en: ['Chocolate', 'Chocolate Cherry'] },
    ingredients: { 
      ro: 'Ciocolată belgiană, făină, ou, zahăr, unt, cremă de lapte',
      en: 'Belgian chocolate, flour, eggs, sugar, butter, cream'
    },
    allergens: { ro: 'Gluten, ouă, lactate', en: 'Gluten, eggs, dairy' },
    bestseller: true
  },
  {
    id: 2,
    name: { ro: 'Ecler Vanilie', en: 'Vanilla Eclair' },
    category: 'pastries',
    description: { 
      ro: 'Ecler clasic cu cremă de vanilie Madagascar și glazură de ciocolată',
      en: 'Classic eclair with Madagascar vanilla cream and chocolate glaze'
    },
    price: 15,
    image: ECLAIR_IMAGE,
    flavors: { ro: ['Vanilie', 'Caramel', 'Cafea'], en: ['Vanilla', 'Caramel', 'Coffee'] },
    ingredients: { 
      ro: 'Făină, ou, unt, lapte, vanilie Madagascar, ciocolată',
      en: 'Flour, eggs, butter, milk, Madagascar vanilla, chocolate'
    },
    allergens: { ro: 'Gluten, ouă, lactate', en: 'Gluten, eggs, dairy' },
    bestseller: true
  },
  {
    id: 3,
    name: { ro: 'Macarons Asortate', en: 'Assorted Macarons' },
    category: 'cookies',
    description: { 
      ro: 'Set de 6 macarons în arome variate: zmeură, ciocolată, vanilie',
      en: 'Set of 6 macarons in various flavors: raspberry, chocolate, vanilla'
    },
    price: 35,
    image: MACARON_IMAGE,
    flavors: { ro: ['Mix Clasic', 'Mix Exotic'], en: ['Classic Mix', 'Exotic Mix'] },
    ingredients: { 
      ro: 'Migdale, albuș, zahăr, coloranți naturali',
      en: 'Almonds, egg white, sugar, natural colorants'
    },
    allergens: { ro: 'Migdale, ouă', en: 'Almonds, eggs' },
    bestseller: true
  },
  {
    id: 4,
    name: { ro: 'Tort Red Velvet', en: 'Red Velvet Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort catifea roșie cu cremă de brânză Philadelphia',
      en: 'Red velvet cake with Philadelphia cream cheese frosting'
    },
    price: 190,
    image: RED_VELVET_IMAGE,
    sizes: ['1kg', '1.5kg', '2kg'],
    bestseller: false
  },
  {
    id: 5,
    name: { ro: 'Croissant Unt', en: 'Butter Croissant' },
    category: 'pastries',
    description: { 
      ro: 'Croissant franțuzesc cu unt de Normandia, crocant și aromat',
      en: 'French croissant with Normandy butter, crispy and aromatic'
    },
    price: 12,
    image: CROISSANT_IMAGE,
    bestseller: false
  },
  {
    id: 6,
    name: { ro: 'Tarta Fructe de Pădure', en: 'Berry Tart' },
    category: 'cakes',
    description: { 
      ro: 'Tartă cu cremă de vanilie și fructe proaspete de sezon',
      en: 'Tart with vanilla cream and fresh seasonal berries'
    },
    price: 45,
    image: BERRY_TART_IMAGE,
    bestseller: true
  },
  {
    id: 7,
    name: { ro: 'Tort Nuntă Elegant', en: 'Elegant Wedding Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort personalizat pentru nunți, design elegant cu flori naturale',
      en: 'Custom wedding cake, elegant design with fresh flowers'
    },
    price: 450,
    image: HERO_IMAGE,
    sizes: ['2kg', '3kg', '4kg', '5kg'],
    bestseller: false
  },
  {
    id: 8,
    name: { ro: 'Profiterole', en: 'Profiteroles' },
    category: 'pastries',
    description: { 
      ro: 'Gogoși frantuzești umplute cu cremă și acoperite cu ciocolată',
      en: 'French cream puffs filled with pastry cream and chocolate'
    },
    price: 18,
    image: ECLAIR_IMAGE,
    bestseller: false
  },
  {
    id: 9,
    name: { ro: 'Pain au Chocolat', en: 'Pain au Chocolat' },
    category: 'pastries',
    description: { 
      ro: 'Patiserie din aluat foietaj cu ciocolată belgiană',
      en: 'Puff pastry with Belgian chocolate'
    },
    price: 14,
    image: CROISSANT_IMAGE,
    bestseller: false
  },
  {
    id: 10,
    name: { ro: 'Cookie Ciocolată', en: 'Chocolate Cookie' },
    category: 'cookies',
    description: { 
      ro: 'Cookie cu bucăți de ciocolată belgiană, crocant în exterior',
      en: 'Cookie with Belgian chocolate chips, crispy outside'
    },
    price: 8,
    image: MACARON_IMAGE,
    bestseller: false
  },
  {
    id: 11,
    name: { ro: 'Tort Aniversar Personalizat', en: 'Custom Birthday Cake' },
    category: 'cakes',
    description: { 
      ro: 'Tort personalizat pentru aniversări cu mesaj și design la alegere',
      en: 'Custom birthday cake with message and design of choice'
    },
    price: 220,
    image: CAKE_IMAGE,
    sizes: ['1.5kg', '2kg', '3kg'],
    bestseller: true
  },
  {
    id: 12,
    name: { ro: 'Set Prăjituri Asortate', en: 'Assorted Pastries Set' },
    category: 'pastries',
    description: { 
      ro: 'Set de 12 prăjituri asortate - eclere, profiterole, mini tarte',
      en: 'Set of 12 assorted pastries - eclairs, profiteroles, mini tarts'
    },
    price: 85,
    image: ECLAIR_IMAGE,
    bestseller: true
  }
];

// Header Component
const Header = ({ language, setLanguage, cartItems, setCurrentPage, setShowCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left spacer for balance */}
          <div className="w-32 md:w-40"></div>

          {/* Centered Logo */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="absolute left-1/2 transform -translate-x-1/2 text-3xl md:text-4xl font-serif font-bold cursor-pointer hover:opacity-80 transition"
            style={{ color: '#1e3a8a' }}
          >
            Odette
          </div>

          {/* Desktop Navigation - Hidden on mobile, shown on larger screens */}
          <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 top-16 space-x-6 text-sm">
            <button onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.home}
            </button>
            <button onClick={() => setCurrentPage('shop')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.shop}
            </button>
            <button onClick={() => setCurrentPage('events')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.events}
            </button>
            <button onClick={() => setCurrentPage('about')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.about}
            </button>
            <button onClick={() => setCurrentPage('contact')} className="text-gray-700 hover:text-blue-900 transition font-medium">
              {t.contact}
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="text-sm font-medium text-gray-700 hover:text-blue-900 transition uppercase"
            >
              {language === 'ro' ? 'EN' : 'RO'}
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 text-gray-700 hover:text-blue-900 transition"
            >
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium" 
                  style={{ backgroundColor: '#d4af37' }}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Contact Button */}
            <button className="hidden md:block text-white px-4 md:px-6 py-2 rounded-full hover:opacity-90 transition font-medium text-sm"
              style={{ backgroundColor: '#d4af37' }}>
              {t.contact}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.home}
              </button>
              <button onClick={() => { setCurrentPage('shop'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.shop}
              </button>
              <button onClick={() => { setCurrentPage('events'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.events}
              </button>
              <button onClick={() => { setCurrentPage('about'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.about}
              </button>
              <button onClick={() => { setCurrentPage('contact'); setMobileMenuOpen(false); }} className="text-left text-gray-700 hover:text-blue-900 py-2 font-medium">
                {t.contact}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Hero Section
const HeroSection = ({ language, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(30, 58, 138, 0.65)' }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight drop-shadow-lg">
          {t.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-white/95 drop-shadow">
          {t.heroSubtitle}
        </p>
        <button 
          onClick={() => setCurrentPage('shop')}
          className="text-blue-900 px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition transform hover:scale-105 shadow-xl"
          style={{ backgroundColor: '#d4af37' }}
        >
          {t.shopNow}
        </button>
      </div>
    </section>
  );
};

// Best Sellers Carousel
const BestSellers = ({ language, products, addToCart, setSelectedProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = translations[language];
  
  const bestSellers = products.filter(p => p.bestseller);
  
  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % bestSellers.length);
  };
  
  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + bestSellers.length) % bestSellers.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.bestSellers}
          </h2>
          <p className="text-xl text-gray-600">{t.bestSellersSubtitle}</p>
        </div>

        <div className="relative">
          {/* Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bestSellers.slice(currentIndex, currentIndex + 3).map((product, idx) => (
              <ProductCard 
                key={product.id}
                product={product}
                language={language}
                addToCart={addToCart}
                setSelectedProduct={setSelectedProduct}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Product Card Component
const ProductCard = ({ product, language, addToCart, setSelectedProduct }) => {
  const t = translations[language];
  
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name[language]}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition">
          <Heart className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name[language]}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {product.description[language]}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold" style={{ color: '#d4af37' }}>
            {product.price} {t.lei}
          </span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex-1 border-2 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            style={{ borderColor: '#1e3a8a', color: '#1e3a8a' }}
          >
            {t.viewDetails}
          </button>
          <button
            onClick={() => addToCart(product)}
            className="flex-1 text-white py-2 rounded-lg font-medium hover:opacity-90 transition"
            style={{ backgroundColor: '#d4af37' }}
          >
            {t.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};

// Featured Categories
const FeaturedCategories = ({ language, setCurrentPage, setFilter }) => {
  const t = translations[language];
  
  const categories = [
    {
      id: 'cakes',
      name: { ro: 'Torturi', en: 'Cakes' },
      image: CAKE_IMAGE,
      description: { ro: 'Torturi premium pentru orice ocazie', en: 'Premium cakes for any occasion' }
    },
    {
      id: 'pastries',
      name: { ro: 'Prăjituri', en: 'Pastries' },
      image: ECLAIR_IMAGE,
      description: { ro: 'Prăjituri fine și delicioase', en: 'Fine and delicious pastries' }
    },
    {
      id: 'cookies',
      name: { ro: 'Cookies & Macarons', en: 'Cookies & Macarons' },
      image: MACARON_IMAGE,
      description: { ro: 'Delicii mici pentru momente dulci', en: 'Small delights for sweet moments' }
    },
    {
      id: 'events',
      name: { ro: 'Evenimente Speciale', en: 'Special Events' },
      image: HERO_IMAGE,
      description: { ro: 'Comenzi personalizate pentru evenimente', en: 'Custom orders for events' }
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setFilter(categoryId);
    setCurrentPage('shop');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.categories}
          </h2>
          <p className="text-xl text-gray-600">{t.categoriesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
            >
              <img
                src={category.image}
                alt={category.name[language]}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name[language]}</h3>
                  <p className="text-white/90 text-sm">{category.description[language]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Trust Badges
const TrustBadges = ({ language }) => {
  const t = translations[language];
  
  const badges = [
    { icon: '🌱', title: t.freshDaily },
    { icon: '🏔️', title: t.localIngredients },
    { icon: '🎨', title: t.customOrders },
    { icon: '🚀', title: t.expressDelivery }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#dbeafe' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="text-center">
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h3 className="font-semibold text-gray-900">{badge.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Product Detail Modal
const ProductDetail = ({ product, language, addToCart, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors ? product.flavors[language][0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const t = translations[language];

  const handleAddToCart = () => {
    addToCart(product, { size: selectedSize, flavor: selectedFlavor, quantity });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{product.name[language]}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="aspect-square rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name[language]}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-3xl font-bold mb-4" style={{ color: '#d4af37' }}>
                {product.price} {t.lei}
              </p>
              
              <p className="text-gray-600 mb-6">{product.description[language]}</p>

              {/* Size Selection */}
              {product.sizes && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectSize}
                  </label>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedSize === size
                            ? 'bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedSize === size ? { borderColor: '#1e3a8a' } : {}}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Flavor Selection */}
              {product.flavors && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    {t.selectFlavor}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavors[language].map((flavor) => (
                      <button
                        key={flavor}
                        onClick={() => setSelectedFlavor(flavor)}
                        className={`px-4 py-2 rounded-lg border-2 transition ${
                          selectedFlavor === flavor
                            ? 'bg-blue-50 text-blue-900'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                        style={selectedFlavor === flavor ? { borderColor: '#1e3a8a' } : {}}
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  {t.quantity}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-900 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:border-blue-900 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition"
                style={{ backgroundColor: '#d4af37' }}
              >
                {t.addToCart} - {product.price * quantity} {t.lei}
              </button>

              {/* Product Info */}
              <div className="mt-8 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.ingredients}</h4>
                  <p className="text-gray-600 text-sm">{product.ingredients[language]}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{t.allergens}</h4>
                  <p className="text-gray-600 text-sm">{product.allergens[language]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shopping Cart Sidebar
const ShoppingCartSidebar = ({ language, cartItems, updateQuantity, removeFromCart, onClose, setCurrentPage }) => {
  const t = translations[language];
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{t.cart}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">{t.cartEmpty}</p>
              <button
                onClick={() => { onClose(); setCurrentPage('shop'); }}
                className="font-medium hover:opacity-80"
                style={{ color: '#1e3a8a' }}
              >
                {t.continueShopping}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <img
                    src={item.product.image}
                    alt={item.product.name[language]}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.product.name[language]}
                    </h3>
                    {item.size && (
                      <p className="text-xs text-gray-600">Size: {item.size}</p>
                    )}
                    {item.flavor && (
                      <p className="text-xs text-gray-600">Flavor: {item.flavor}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded border flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.product.price * item.quantity} {t.lei}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.subtotal}</span>
              <span className="font-semibold">{subtotal} {t.lei}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{t.deliveryFee}</span>
              <span className="font-semibold">{deliveryFee} {t.lei}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>{t.total}</span>
              <span style={{ color: '#d4af37' }}>{total} {t.lei}</span>
            </div>
            <button
              onClick={() => { onClose(); setCurrentPage('checkout'); }}
              className="w-full text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
              style={{ backgroundColor: '#d4af37' }}
            >
              {t.checkout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Shop Page
const ShopPage = ({ language, products, filter, setFilter, addToCart, setSelectedProduct }) => {
  const t = translations[language];
  
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{t.shop}</h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'all'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'all' ? { backgroundColor: '#d4af37' } : {}}
            >
              All
            </button>
            <button
              onClick={() => setFilter('cakes')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'cakes'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'cakes' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.cakes}
            </button>
            <button
              onClick={() => setFilter('pastries')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'pastries'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'pastries' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.pastries}
            </button>
            <button
              onClick={() => setFilter('cookies')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === 'cookies'
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              style={filter === 'cookies' ? { backgroundColor: '#d4af37' } : {}}
            >
              {t.cookies}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              addToCart={addToCart}
              setSelectedProduct={setSelectedProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Checkout Page
const CheckoutPage = ({ language, cartItems, onOrderComplete }) => {
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    deliveryDate: '',
    deliveryTime: '',
    specialInstructions: '',
    paymentMethod: 'card',
    agreeTerms: false,
    subscribeNewsletter: false
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = 20;
  const total = subtotal + deliveryFee;

  // Get minimum delivery date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert(language === 'ro' ? 'Vă rugăm să acceptați termenii și condițiile' : 'Please accept terms and conditions');
      return;
    }
    onOrderComplete(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">{t.checkoutTitle}</h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.customerInfo}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.phone} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.deliveryAddress}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.street} *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.city} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postalCode} *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.deliveryDate}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.selectDate} * (minimum next-day)
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    min={minDate}
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.deliveryTime}
                  </label>
                  <select
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Any time</option>
                    <option value="morning">9:00 - 12:00</option>
                    <option value="afternoon">12:00 - 17:00</option>
                    <option value="evening">17:00 - 20:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.specialInstructions}
                  </label>
                  <textarea
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t.instructionsPlaceholder}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.paymentMethod}</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    style={{ accentColor: '#1e3a8a' }}
                  />
                  <span className="font-medium">{t.cardOnline}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    style={{ accentColor: '#1e3a8a' }}
                  />
                  <span className="font-medium">{t.cashOnDelivery}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={formData.paymentMethod === 'transfer'}
                    onChange={handleChange}
                    className="w-4 h-4"
                    style={{ accentColor: '#1e3a8a' }}
                  />
                  <span className="font-medium">{t.bankTransfer}</span>
                </label>
              </div>
            </div>

            {/* Terms & Newsletter */}
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4"
                  style={{ accentColor: '#1e3a8a' }}
                />
                <span className="text-sm text-gray-700">
                  {t.agreeTerms} <a href="#" className="hover:underline" style={{ color: '#1e3a8a' }}>{t.termsConditions}</a> *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="subscribeNewsletter"
                  checked={formData.subscribeNewsletter}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4"
                  style={{ accentColor: '#1e3a8a' }}
                />
                <span className="text-sm text-gray-700">{t.subscribeNewsletter}</span>
              </label>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.orderSummary}</h2>
              
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name[language]} x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.product.price * item.quantity} {t.lei}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.subtotal}</span>
                  <span className="font-medium">{subtotal} {t.lei}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t.deliveryFee}</span>
                  <span className="font-medium">{deliveryFee} {t.lei}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>{t.total}</span>
                  <span style={{ color: '#d4af37' }}>{total} {t.lei}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: '#d4af37' }}
              >
                {t.placeOrder}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Order Confirmation Page
const OrderConfirmation = ({ language, orderNumber, orderData, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.orderConfirmed}</h1>
          <p className="text-gray-600 mb-6">{t.thankYou}</p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="text-sm text-gray-600 mb-1">{t.orderNumber}</div>
            <div className="text-2xl font-bold" style={{ color: '#d4af37' }}>#{orderNumber}</div>
          </div>

          <p className="text-gray-600 mb-2">{t.orderEmail}</p>
          <p className="text-sm text-gray-500 mb-8">
            {t.estimatedDelivery}: <strong>{orderData.deliveryDate}</strong>
          </p>

          <button
            onClick={() => setCurrentPage('home')}
            className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            style={{ backgroundColor: '#d4af37' }}
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = ({ language, setCurrentPage }) => {
  const t = translations[language];
  
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4" style={{ color: '#d4af37' }}>Odette</h3>
            <p className="text-blue-100 text-sm">
              {language === 'ro' 
                ? 'Patiserie artizanală de calitate premium din ingrediente locale.' 
                : 'Artisan pastry of premium quality from local ingredients.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => setCurrentPage('home')} className="text-blue-100 hover:text-white transition text-sm">
                  {t.home}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('shop')} className="text-blue-100 hover:text-white transition text-sm">
                  {t.shop}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('about')} className="text-blue-100 hover:text-white transition text-sm">
                  {t.about}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentPage('contact')} className="text-blue-100 hover:text-white transition text-sm">
                  {t.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t.contact}</h4>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+40 123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@odette.ro</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Str. Exemplu 123, București</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-4">{t.followUs}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition" style={{ backgroundColor: '#d4af37' }}>
                <Instagram className="w-5 h-5 text-blue-900" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center hover:opacity-80 transition" style={{ backgroundColor: '#d4af37' }}>
                <Facebook className="w-5 h-5 text-blue-900" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center text-sm text-blue-100" style={{ borderColor: '#1e40af' }}>
          <p>© 2025 Odette Pastry. {t.allRightsReserved}</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
export default function OdetteEcommerce() {
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
          <TrustBadges language={language} />
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

      {/* Placeholder pages for other sections */}
      {['events', 'about', 'contact'].includes(currentPage) && (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page
            </h1>
            <p className="text-gray-600 mb-8">This section will be completed in the next phase.</p>
            <button
              onClick={() => setCurrentPage('home')}
              className="font-medium hover:opacity-80"
              style={{ color: '#1e3a8a' }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
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
        />
      )}
    </div>
  );
}
