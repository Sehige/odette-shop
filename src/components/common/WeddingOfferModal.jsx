import React from 'react';
import { X, ExternalLink } from 'lucide-react';

const WeddingOfferModal = ({ isOpen, onClose, language, canvaUrl }) => {
  if (!isOpen) return null;

  const translations = {
    ro: {
      title: 'Ofertă Nunți 2026',
      subtitle: 'Descoperiți pachetele noastre speciale pentru nunta perfectă',
      viewOffer: 'Vezi Oferta',
    },
    en: {
      title: 'Wedding Offer 2026',
      subtitle: 'Discover our special packages for the perfect wedding',
      viewOffer: 'View Offer',
    },
  };

  const t = translations[language] || translations.ro;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-[#1e3a8a] mb-2 font-serif">
            {t.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {t.subtitle}
          </p>

          {/* Action button */}
          <a
            href={canvaUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-center gap-3 w-full p-4 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-lg transition-all hover:scale-105 font-semibold text-lg"
          >
            <ExternalLink size={20} />
            {t.viewOffer}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WeddingOfferModal;
