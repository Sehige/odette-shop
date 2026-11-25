import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { translations } from '../../data/translations';
import { contactService } from '../../services/utilityServices';
import Toast from '../common/Toast';
import LocationCard from '../location/LocationCard';

// `website` is a trap: hidden from people, but bots that fill in every field fill it in
const EMPTY_FORM = { kind: 'contact', name: '', phone: '', event_date: '', message: '', website: '' };
// One form for everything. Old links can still name the topic (/contact?subiect=tort-personalizat
// or ?subiect=eveniment): it only labels the email to the shop.
const SUBJECTS = { 'tort-personalizat': 'custom_cake', eveniment: 'event' };

// "2026-12-12" → "12 decembrie 2026" (the shop reads the emails in Romanian)
const dayRo = (iso) =>
  new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`));

/**
 * What the form sends to submit-enquiry. The function keeps the date in its own field only for
 * custom cakes and events, so on a plain message the date opens the message text instead.
 */
export const enquiryBody = (formData, { elapsedMs, language }) => {
  const date = formData.event_date;
  const plain = formData.kind === 'contact';
  return {
    ...formData,
    message: plain && date ? `Data dorită: ${dayRo(date)}

${formData.message}` : formData.message,
    event_date: plain ? '' : date,
    elapsed_ms: elapsedMs,
    language,
  };
};

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();
  // When the form appeared: the server ignores forms sent within seconds (bots)
  const shownAt = useRef(0);

  const t = translations[language].contact;

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
      const { error } = await contactService.submitContactForm(
        enquiryBody(formData, { elapsedMs: Date.now() - shownAt.current, language })
      );

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
      {/* starts well below the fixed header (124px tall on large screens) */}
      <div className="pt-32 lg:pt-44 pb-16 min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>

      {/* Main Content */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* The form first; the map and contact details underneath */}
            <div className="max-w-3xl mx-auto bg-gray-50 sm:p-8 rounded-2xl">
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

                  <div>
                    <label htmlFor="contact-date" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.orderDate} <span className="font-normal text-gray-500">({t.labels.optional})</span>
                    </label>
                    <input
                      type="date"
                      id="contact-date"
                      name="event_date"
                      min={new Date().toLocaleDateString('en-CA')}
                      value={formData.event_date}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full sm:w-64 px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition disabled:opacity-50"
                    />
                  </div>

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
                    className="w-full py-4 rounded-lg font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: isSubmitting ? '#6b7280' : '#1e3a8a' }}
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

            <LocationCard language={language} headingLevel="h2" contacts mapSide="left" />
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
