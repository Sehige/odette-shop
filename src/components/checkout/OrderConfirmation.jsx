import React from 'react';
import { translations } from '../../data/translations';

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

export default OrderConfirmation;