import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../common/WhatsAppButton';

const Layout = ({
  language,
  setLanguage
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Keyboard users can skip the header navigation */}
      <a
        href="#continut"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-[#1e3a8a] focus:font-semibold focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg"
      >
        {language === 'ro' ? 'Sari la conținut' : 'Skip to content'}
      </a>
      <Header
        language={language}
        setLanguage={setLanguage}
      />
      <main id="continut">
        <Outlet />
      </main>
      <Footer language={language} />
      <WhatsAppButton language={language} />
    </div>
  );
};

export default Layout;
