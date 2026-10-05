import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, Send, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { contactService } from '../../services/utilityServices';
import Toast from '../common/Toast';
import LocationCard from '../location/LocationCard';

// `website` is a trap: hidden from people, but bots that fill in every field fill it in
const EMPTY_FORM = { kind: 'contact', name: '', phone: '', event_date: '', guests: '', message: '', website: '' };
const KINDS = ['contact', 'custom_cake', 'event'];
// Links can preselect the topic: /contact?subiect=tort-personalizat or ?subiect=eveniment
const SUBJECTS = { 'tort-personalizat': 'custom_cake', eveniment: 'event' };

const ACTION = 'inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border-2 border-gray-200 font-semibold text-gray-800 hover:border-blue-900 hover:text-blue-900 transition';

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();
  // When the form appeared: the server ignores forms sent within seconds (bots)
  const shownAt = useRef(0);

  const t = translations[language].contact;
  const isEnquiry = formData.kind !== 'contact';

  useEffect(() => {
    shownAt.current = Date.now();
    const kind = SUBJECTS[searchParams.get('subiect')];
    if (kind) setFormData((current) => ({ ...current, kind }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    // Basic validation (browser handles required fields, but double-check)
    if (!formData.name || !formData.phone || !formData.message) {
      setToast({
        message: language === 'ro'
          ? 'Vă rugăm completați toate câmpurile obligatorii'
          : 'Please fill in all required fields',
        type: 'error'
      });
      return;
    }

    // Phone validation: digits with spaces, dots, dashes or brackets, 8 to 15 digits
    const digits = formData.phone.replace(/\D/g, '');
    if (!/^\+?[\d\s().\/-]+$/.test(formData.phone.trim()) || digits.length < 8 || digits.length > 15) {
      setToast({
        message: language === 'ro'
          ? 'Vă rugăm introduceți un număr de telefon valid'
          : 'Please enter a valid phone number',
        type: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await contactService.submitContactForm({
        ...formData,
        // date and count only belong to custom cakes and events
        event_date: isEnquiry ? formData.event_date : '',
        guests: isEnquiry ? formData.guests : '',
        elapsed_ms: Date.now() - shownAt.current,
        language
      });

      if (error) {
        const messages = {
          too_many: t.errors.tooMany,
          invalid: t.errors.invalid
        };
        setToast({
          message: messages[error.reason] || (language === 'ro'
            ? 'A apărut o eroare. Vă rugăm încercați din nou.'
            : 'An error occurred. Please try again.'),
          type: 'error'
        });
        return;
      }

      // Success! Show success message
      setSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData(EMPTY_FORM);
        shownAt.current = Date.now();
      }, 3000);

    } catch (error) {
      console.error('Contact form submission error:', error);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };




  return (
    <>
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
          {/* Straight to the phone, WhatsApp or email */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, '')}`} className={ACTION}>
              <Phone className="w-5 h-5" aria-hidden="true" />
              {siteConfig.contact.phone}
            </a>
            <a href={`https://wa.me/${siteConfig.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className={ACTION}>
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              WhatsApp
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className={ACTION}>
              <Mail className="w-5 h-5" aria-hidden="true" />
              {siteConfig.contact.email}
            </a>
          </div>
          <div className="mt-5 flex justify-center gap-4">
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-blue-900 transition">
              <Instagram className="w-6 h-6" />
            </a>
            <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-blue-900 transition">
              <Facebook className="w-6 h-6" />
            </a>
          </div>
        </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Bottom Section: Contact Form */}
            <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                {t.formTitle}
              </h2>

              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-white" size={32} />
                  </div>
                  <p className="text-green-700 font-medium">
                    {t.success}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <fieldset>
                    <legend className="block text-sm font-semibold text-gray-700 mb-2">{t.labels.kind}</legend>
                    <div className="flex flex-wrap gap-2">
                      {KINDS.map((kind) => (
                        <label
                          key={kind}
                          className={`px-4 py-2 rounded-full border-2 text-sm font-semibold cursor-pointer transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-900 has-[:focus-visible]:ring-offset-2 ${
                            formData.kind === kind ? 'border-blue-900 bg-blue-50 text-blue-900' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="kind"
                            value={kind}
                            checked={formData.kind === kind}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="sr-only"
                          />
                          {t.kinds[kind]}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.name} *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.phone} *
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      autoComplete="tel"
                      placeholder="07xx xxx xxx"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50"
                    />
                  </div>

                  {isEnquiry && (
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-date" className="block text-sm font-semibold text-gray-700 mb-2">
                          {formData.kind === 'event' ? t.labels.eventDate : t.labels.cakeDate}
                        </label>
                        <input
                          type="date"
                          id="contact-date"
                          name="event_date"
                          min={new Date().toLocaleDateString('en-CA')}
                          value={formData.event_date}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-guests" className="block text-sm font-semibold text-gray-700 mb-2">
                          {formData.kind === 'event' ? t.labels.guests : t.labels.portions}
                        </label>
                        <input
                          type="number"
                          id="contact-guests"
                          name="guests"
                          min="1"
                          max="5000"
                          inputMode="numeric"
                          value={formData.guests}
                          onChange={handleChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.message} *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder={t.placeholders[formData.kind] || ''}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition resize-none disabled:opacity-50"
                    ></textarea>
                  </div>

                  <div aria-hidden="true" className="absolute -left-[10000px] w-px h-px overflow-hidden">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      type="text"
                      id="contact-website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    // navy on gold (4.9:1); white on gold was 2.1:1, too faint to read
                    style={{ backgroundColor: isSubmitting ? '#6b7280' : '#d4af37', color: isSubmitting ? '#ffffff' : '#1e3a8a' }}
                  >
                    <Send size={20} />
                    {isSubmitting
                      ? (language === 'ro' ? 'Se trimite...' : 'Sending...')
                      : t.send
                    }
                  </button>
                </form>
              )}
            </div>

            {/* The shop: hours, directions, map */}
            <section aria-labelledby="unde-ne-gasesti">
              <h2 id="unde-ne-gasesti" className="text-3xl font-bold mb-6 text-center" style={{ color: '#1e3a8a' }}>
                {translations[language].location.title}
              </h2>
              <LocationCard language={language} headingLevel="h3" />
              <p className="mt-6 text-center text-sm text-gray-600">
                {siteConfig.company.legalName} · CUI {siteConfig.company.cui} · {translations[language].footer.tradeRegister} {siteConfig.company.tradeRegister}
              </p>
            </section>
          </div>
        </div>
      </section>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    </div>
    </>
  );
};

export default ContactPage;
