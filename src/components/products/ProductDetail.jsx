import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductInfo from './ProductInfo';

// Quick-view modal over the shop grid; the product itself is rendered by ProductInfo
const ProductDetail = ({ product, language, onClose }) => {
  const navigate = useNavigate();
  const modalContentRef = useRef(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Handle browser back button - push state when modal opens, close on back
  useEffect(() => {
    // Push a new history state when modal opens
    window.history.pushState({ modal: 'product' }, '');

    const handlePopState = () => {
      // When back is pressed, close the modal
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Handle click outside modal
  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleContactUs = () => {
    // Close modal and navigate to contact page
    onClose();
    navigate('/contact');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Sticky Close Button */}
        <div className="sticky top-0 z-20 flex justify-end p-3 bg-gradient-to-b from-white via-white to-transparent">
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-md"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-4">
          <ProductInfo product={product} language={language} onContact={handleContactUs} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
