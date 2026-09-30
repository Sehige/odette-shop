import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = ({ language }) => {
  const isRo = language === 'ro';

  return (
    <div className="pt-32 pb-16 min-h-[70vh] bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
          {isRo ? 'Pagina nu a fost găsită' : 'Page not found'}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {isRo
            ? 'Adresa accesată nu există sau a fost mutată.'
            : 'This address does not exist or has moved.'}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition"
          >
            {isRo ? 'Pagina principală' : 'Home page'}
          </Link>
          <Link
            to="/shop"
            className="border border-[#1e3a8a] text-[#1e3a8a] px-6 py-3 rounded-full font-semibold hover:bg-[#1e3a8a]/5 transition"
          >
            {isRo ? 'Vezi produsele' : 'See the products'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
