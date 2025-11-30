import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { getGoogleMapsUrl } from '../../utils/mapUtils';
import { subscribeToNewsletter } from '../../services/newsletterService';
import Toast from '../common/Toast';

const Footer = ({ language }) => {
  const navigate = useNavigate();
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
  
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#1e3a8a' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Legal & Company Information */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.legalInfo}</h4>

            {/* Minimal Company Data */}
            <div className="mb-4 pb-4 border-b border-blue-700">
              <p className="text-blue-100 text-sm font-semibold">{siteConfig.company.legalName}</p>
              <p className="text-blue-100 text-sm">CUI: {siteConfig.company.cui}</p>
            </div>

            {/* Legal Links */}
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="hover:text-white transition">
                  {t.termsAndConditions}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition">
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/cookie-policy')} className="hover:text-white transition">
                  {t.cookiePolicy}
                </button>
              </li>
              <li>
                <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                  {t.anpc}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
              <li>
                <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center gap-2">
                  {t.euDispute}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.quickLinks}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition">
                  {t.home}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="hover:text-white transition">
                  {t.shopNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/events')} className="hover:text-white transition">
                  {t.eventsNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition">
                  {t.aboutNav}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition">
                  {t.contactNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.contactNav}</h4>
            <ul className="space-y-3 text-blue-100 text-base">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <a
                  href={getGoogleMapsUrl(siteConfig.contact.address[language])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  {siteConfig.contact.address[language]}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-xl font-semibold mb-4">{t.newsletter}</h4>
            <p className="text-blue-100 text-sm mb-4">
              {t.newsletterDescription}
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder={t.newsletterNamePlaceholder}
                value={newsletterForm.name}
                onChange={handleNewsletterChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-blue-900 border border-blue-700 rounded text-white placeholder-blue-300 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <input
                type="email"
                name="email"
                placeholder={t.newsletterEmailPlaceholder}
                value={newsletterForm.email}
                onChange={handleNewsletterChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-blue-900 border border-blue-700 rounded text-white placeholder-blue-300 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={newsletterForm.agreeTerms}
                  onChange={handleNewsletterChange}
                  disabled={isSubmitting}
                  className="mt-1"
                />
                <label className="text-blue-100 text-xs">
                  {t.newsletterAgree}{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy-policy')}
                    className="underline hover:text-white"
                  >
                    {t.newsletterPrivacy}
                  </button>
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-2 rounded text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-800 pt-8 text-center text-blue-100 text-base">
          <p>© 2024 Odette. {t.allRightsReserved}</p>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </footer>
  );
};

export default Footer;