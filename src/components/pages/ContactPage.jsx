import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Instagram, Facebook } from 'lucide-react';

const ContactPage = ({ language }) => {
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
      
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {language === 'ro' ? 'Contactează-ne' : 'Contact Us'}
          </h1>
          <p className="text-xl text-gray-600">
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
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d672.8753447668936!2d23.565536321524463!3d46.75195891545976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490e709572c49f%3A0x6b715e9d951f019!2sStrada%20C%C3%A2mpului%20133%2C%20Cluj-Napoca%20400394%2C%20Romania!5e0!3m2!1sen!2sro!4v1732634400000!5m2!1sen!2sro"
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

                  {/* Social Media */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#1e3a8a' }}>
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
                </div>
              </div>
            </div>

            {/* Bottom Section: Contact Form */}
            <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-2xl">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;