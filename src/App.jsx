import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context providers
import { CookieConsentProvider } from './context/CookieConsentContext';
import { ImageSettingsProvider } from './context/ImageSettingsContext';

// Cookie consent components
import CookieConsentBanner from './components/cookies/CookieConsentBanner';
import CookiePreferencesModal from './components/cookies/CookiePreferencesModal';

// Layout components
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';

// Product components
import ProductDetail from './components/products/ProductDetail';

// Page components
import HomePage from './components/pages/HomePage';
import ShopPage from './components/shop/ShopPage';
import ContactPage from './components/pages/ContactPage';
import TermsAndConditionsPage from './components/pages/TermsAndConditionsPage';
import PrivacyPolicyPage from './components/pages/PrivacyPolicyPage';
import CookiePolicyPage from './components/pages/CookiePolicyPage';
import AdminLoginPage from './components/pages/AdminLoginPage';


function App() {
  const [language, setLanguage] = useState('ro');
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <CookieConsentProvider>
      <ImageSettingsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-white">
          <Routes>
            <Route
              path="/"
              element={
                <Layout
                  language={language}
                  setLanguage={setLanguage}
                />
              }
            >
              <Route
                index
                element={
                  <HomePage
                    language={language}
                    setSelectedProduct={setSelectedProduct}
                  />
                }
              />
              <Route
                path="shop"
                element={
                  <ShopPage
                    language={language}
                    selectedProduct={selectedProduct}
                    setSelectedProduct={setSelectedProduct}
                  />
                }
              />
              <Route
                path="contact"
                element={<ContactPage language={language} />}
              />
              <Route
                path="terms-and-conditions"
                element={<TermsAndConditionsPage language={language} />}
              />
              <Route
                path="privacy-policy"
                element={<PrivacyPolicyPage language={language} />}
              />
              <Route
                path="cookie-policy"
                element={<CookiePolicyPage language={language} />}
              />
              <Route
                path="admin"
                element={<AdminLoginPage language={language} />}
              />
            </Route>
          </Routes>

          {/* Product Detail Modal */}
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              language={language}
              onClose={() => setSelectedProduct(null)}
            />
          )}

          {/* Cookie Consent Components */}
          <CookieConsentBanner language={language} />
          <CookiePreferencesModal language={language} />
        </div>
      </BrowserRouter>
      </ImageSettingsProvider>
    </CookieConsentProvider>
  );
}

export default App;