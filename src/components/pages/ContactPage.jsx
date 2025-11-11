import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';

const ContactPage = ({ language, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const content = {
    ro: {
      title: 'Contactează-ne',
      subtitle: 'Suntem aici să te ajutăm',
      form: {
        title: 'Trimite-ne un mesaj',
        name: 'Nume Complet',
        email: 'Email',
        phone: 'Telefon',
        subject: 'Subiect',
        message: 'Mesaj',
        send: 'Trimite Mesaj',
        success: 'Mulțumim! Mesajul tău a fost trimis cu succes. Te vom contacta în curând.'
      },
      info: {
        title: 'Informații Contact',
        address: 'Strada Exemplu nr. 123, Cluj-Napoca, România',
        phone: '+40 123 456 789',
        email: 'contact@odette.ro',
        hours: 'Luni - Vineri: 9:00 - 18:00\nSâmbătă: 10:00 - 16:00\nDuminică: Închis'
      },
      social: {
        title: 'Urmărește-ne',
        description: 'Rămâi la curent cu cele mai noi creații'
      }
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We\'re here to help',
      form: {
        title: 'Send us a message',
        name: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        send: 'Send Message',
        success: 'Thank you! Your message has been sent successfully. We will contact you soon.'
      },
      info: {
        title: 'Contact Information',
        address: '123 Example Street, Cluj-Napoca, Romania',
        phone: '+40 123 456 789',
        email: 'contact@odette.ro',
        hours: 'Monday - Friday: 9:00 - 18:00\nSaturday: 10:00 - 16:00\nSunday: Closed'
      },
      social: {
        title: 'Follow Us',
        description: 'Stay updated with our latest creations'
      }
    }
  };

  const t = content[language];

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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{t.title}</h1>
            <p className="text-xl" style={{ color: '#d4af37' }}>{t.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                {t.form.title}
              </h2>
              
              {submitted ? (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-white" size={32} />
                  </div>
                  <p className="text-green-700 font-medium">
                    {t.form.success}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.name} *
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
                      {t.form.email} *
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
                      {t.form.phone}
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
                      {t.form.subject} *
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
                      {t.form.message} *
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
                    {t.form.send}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                  {t.info.title}
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Adresă / Address</h3>
                      <p className="text-gray-600">{t.info.address}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Telefon / Phone</h3>
                      <a href={`tel:${t.info.phone}`} className="text-gray-600 hover:text-blue-900 transition">
                        {t.info.phone}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a href={`mailto:${t.info.email}`} className="text-gray-600 hover:text-blue-900 transition">
                        {t.info.email}
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#d4af37' }}>
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Program / Hours</h3>
                      <p className="text-gray-600 whitespace-pre-line">{t.info.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
                  {t.social.title}
                </h3>
                <p className="text-gray-600 mb-4">{t.social.description}</p>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/odettepastry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition"
                    style={{ backgroundColor: '#d4af37' }}
                  >
                    <Instagram className="text-white" size={24} />
                  </a>
                  <a
                    href="https://facebook.com/odettepastry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition"
                    style={{ backgroundColor: '#d4af37' }}
                  >
                    <Facebook className="text-white" size={24} />
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl overflow-hidden h-64">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <MapPin size={48} />
                </div>
                {/* In a real implementation, integrate Google Maps here */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;