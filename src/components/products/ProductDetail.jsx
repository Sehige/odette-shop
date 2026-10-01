import React, { useCallback, useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductInfo from './ProductInfo';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
const isModalEntry = () => !!(window.history.state && window.history.state.modal === 'product');

// Quick-view modal over the product grid; the product itself is rendered by ProductInfo
const ProductDetail = ({ product, language, onClose }) => {
  const navigate = useNavigate();
  const modalContentRef = useRef(null);
  const closeButtonRef = useRef(null);
  const headingId = useId();

  // Opening adds a history entry, so the browser's Back button closes the product.
  // (Pushed once: the check also covers React's double effects in development.)
  useEffect(() => {
    if (!isModalEntry()) window.history.pushState({ modal: 'product' }, '');
    const handlePopState = () => onClose();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  // Closing from the page (✕, Esc, backdrop) goes back through that same entry, so
  // afterwards Back leaves the page instead of reopening the product.
  const requestClose = useCallback(() => {
    if (isModalEntry()) window.history.back();
    else onClose();
  }, [onClose]);

  // Keyboard: focus starts on ✕, Tab stays inside the dialog, Esc closes, and focus
  // returns to what opened it (without scrolling the page).
  useEffect(() => {
    const opener = document.activeElement;
    closeButtonRef.current?.focus({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        requestClose();
        return;
      }
      if (event.key !== 'Tab' || !modalContentRef.current) return;
      const focusable = modalContentRef.current.querySelectorAll(FOCUSABLE);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (opener && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, [requestClose]);

  // Handle click outside modal
  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      requestClose();
    }
  };

  // Contact page instead of the product: it takes the place of the modal's history
  // entry, so Back from the contact page returns to the product. The modal closes once
  // the page has changed (root.jsx); closing it first would cancel this navigation.
  const handleContactUs = () => navigate('/contact', { replace: isModalEntry() });

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalContentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Sticky Close Button */}
        <div className="sticky top-0 z-20 flex justify-end p-3 bg-gradient-to-b from-white via-white to-transparent">
          <button
            ref={closeButtonRef}
            onClick={requestClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-md"
            aria-label={language === 'ro' ? 'Închide' : 'Close'}
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-4">
          <ProductInfo product={product} language={language} onContact={handleContactUs} headingId={headingId} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
