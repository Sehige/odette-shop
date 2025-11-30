import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X } from 'lucide-react';
import { translations } from '../../data/translations';
import { subscribeToNewsletter } from '../../services/newsletterService';
import Toast from './Toast';

const NewsletterModal = ({ isOpen, onClose, language }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const t = translations[language];

  const [newsletterForm, setNewsletterForm] = useState({ name: '', email: '', agreeTerms: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const handleNewsletterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewsletterForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!newsletterForm.email || !newsletterForm.name) {
      setToast({
        message: language === 'ro'
          ? 'Vă rugăm completați toate câmpurile'
          : 'Please fill in all fields',
        type: 'error'
      });
      return;
    }

    // Check if terms are accepted
    if (!newsletterForm.agreeTerms) {
      setToast({
        message: language === 'ro'
          ? 'Vă rugăm să acceptați politica de confidențialitate'
          : 'Please accept the privacy policy',
        type: 'error'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterForm.email)) {
      setToast({
        message: language === 'ro'
          ? 'Vă rugăm introduceți o adresă de email validă'
          : 'Please enter a valid email address',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error, isDuplicate } = await subscribeToNewsletter({
        email: newsletterForm.email,
        name: newsletterForm.name,
        language: language
      });

      if (isDuplicate) {
        setToast({
          message: language === 'ro'
            ? 'Sunteți deja abonat la newsletter!'
            : 'You are already subscribed!',
          type: 'success'
        });
        setNewsletterForm({ name: '', email: '', agreeTerms: false });

        // Close modal after 2 seconds on success
        setTimeout(() => {
          onClose();
        }, 2000);
        return;
      }

      if (error) {
        setToast({
          message: language === 'ro'
            ? 'A apărut o eroare. Vă rugăm încercați din nou.'
            : 'An error occurred. Please try again.',
          type: 'error'
        });
        return;
      }

      setToast({
        message: language === 'ro'
          ? 'Mulțumim! Abonarea la newsletter a fost realizată cu succes!'
          : 'Thank you! Successfully subscribed to our newsletter!',
        type: 'success'
      });
      setNewsletterForm({ name: '', email: '', agreeTerms: false });

      // Close modal after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setToast({
        message: language === 'ro'
          ? 'A apărut o eroare. Vă rugăm încercați din nou.'
          : 'An error occurred. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle click outside modal to close
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Handle ESC key to close
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          aria-label={t.close}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon and Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#1e3a8a' }}>
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
            {t.newsletterModalTitle}
          </h2>
          <p className="text-gray-600 text-sm">
            {t.newsletterModalDescription}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleNewsletterSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder={t.newsletterNamePlaceholder}
            value={newsletterForm.name}
            onChange={handleNewsletterChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
          />
          <input
            type="email"
            name="email"
            placeholder={t.newsletterEmailPlaceholder}
            value={newsletterForm.email}
            onChange={handleNewsletterChange}
            disabled={isSubmitting}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 disabled:opacity-50 transition"
          />

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={newsletterForm.agreeTerms}
              onChange={handleNewsletterChange}
              disabled={isSubmitting}
              className="mt-1"
              id="agree-terms-modal"
            />
            <label htmlFor="agree-terms-modal" className="text-gray-700 text-sm">
              {t.newsletterAgree}{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/privacy-policy');
                }}
                className="underline hover:text-blue-600 transition"
                style={{ color: '#1e3a8a' }}
              >
                {t.newsletterPrivacy}
              </button>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{
              backgroundColor: isSubmitting ? '#6b7280' : '#d4af37',
              color: '#1e3a8a'
            }}
          >
            {isSubmitting
              ? (language === 'ro' ? 'Se procesează...' : 'Processing...')
              : t.newsletterSubscribe
            }
          </button>
        </form>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default NewsletterModal;
