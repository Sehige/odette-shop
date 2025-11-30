import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = ({
  language,
  setLanguage
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        language={language}
        setLanguage={setLanguage}
      />
      <main>
        <Outlet />
      </main>
      <Footer language={language} />
    </div>
  );
};

export default Layout;
