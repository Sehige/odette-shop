import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductInfo from './ProductInfo';

// Standalone product page (/produse/<slug>): the same product information as the
// quick-view modal, with a breadcrumb back to the product list.
const ProductPage = ({ product, language }) => {
  const navigate = useNavigate();
  const isRo = language === 'ro';
  const name = isRo ? product.name_ro : product.name_en;

  return (
    <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label={isRo ? 'Navigare' : 'Breadcrumb'} className="text-sm text-gray-500 mb-6">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-gray-900 transition">{isRo ? 'Acasă' : 'Home'}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop" className="hover:text-gray-900 transition">{isRo ? 'Produse' : 'Products'}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900" aria-current="page">{name}</li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm px-6 pt-6">
          <ProductInfo
            product={product}
            language={language}
            headingLevel="h1"
            onContact={() => navigate('/contact')}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
