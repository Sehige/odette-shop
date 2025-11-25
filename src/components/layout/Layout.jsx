import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  language,
  setLanguage,
  cartItemsCount,
  setShowCart
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        language={language}
        setLanguage={setLanguage}
        cartItemsCount={cartItemsCount}
        setShowCart={setShowCart}
      />
      <main>
        <Outlet />
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Layout;
