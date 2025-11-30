import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import { getGoogleMapsUrl } from '../../utils/mapUtils';

const ContactPage = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const t = translations[language].contact;

  // TikTok Icon Component
  const TikTokIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to a backend
    console.log('Form submitted:', formData);
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
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
        </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Top Section: Map and Contact Info */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Map Container - Hidden on mobile */}
              <div className="hidden md:block bg-gray-200 rounded-2xl overflow-hidden h-[500px]">
                <iframe
                  src={siteConfig.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Odette Location"
                ></iframe>
              </div>

              {/* Contact Information Container */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                  {t.infoTitle}
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.labels.address}</h3>
                      <a
                        href={getGoogleMapsUrl(siteConfig.contact.address[language])}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-900 hover:underline transition"
                      >
                        {siteConfig.contact.address[language]}
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.labels.phone}</h3>
                      <a href={`tel:${siteConfig.contact.phone}`} className="text-gray-600 hover:text-blue-900 transition">
                        {siteConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.labels.email}</h3>
                      <a href={`mailto:${siteConfig.contact.email}`} className="text-gray-600 hover:text-blue-900 transition">
                        {siteConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{t.labels.hours}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{siteConfig.hours[language]}</p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#1e3a8a' }}>
                      {t.socialTitle}
                    </h3>
                    <p className="text-gray-600 mb-4">{t.socialDescription}</p>
                    <div className="flex gap-4">
                      <a
                        href={siteConfig.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition"
                        style={{ backgroundColor: '#d4af37' }}
                      >
                        <Instagram className="text-white" size={24} />
                      </a>
                      <a
                        href={siteConfig.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition"
                        style={{ backgroundColor: '#d4af37' }}
                      >
                        <Facebook className="text-white" size={24} />
                      </a>
                      <a
                        href={siteConfig.social.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition"
                        style={{ backgroundColor: '#d4af37' }}
                      >
                        <TikTokIcon className="text-white" size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.name} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.subject} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.labels.message} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-900 focus:outline-none transition resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-lg font-semibold text-white hover:opacity-90 transition flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#d4af37' }}
                  >
                    <Send size={20} />
                    {t.send}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default ContactPage;
