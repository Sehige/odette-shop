import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Facebook,
  Instagram,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ContactPage = ({ language = 'ro' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null); // 'success', 'error', null

  const content = {
    ro: {
      title: "Contactează-ne",
      subtitle: "Suntem aici să te ajutăm! Contactează-ne pentru întrebări, comenzi personalizate sau orice nevoie.",
      formTitle: "Trimite-ne un mesaj",
      namePlaceholder: "Numele tău complet",
      emailPlaceholder: "Email",
      phonePlaceholder: "Telefon (opțional)",
      subjectPlaceholder: "Subiect",
      messagePlaceholder: "Mesajul tău...",
      sendButton: "Trimite Mesaj",
      contactInfoTitle: "Informații Contact",
      visitUsTitle: "Vizitează-ne",
      address: "Str. Pastry Dream 42, Cluj-Napoca, România",
      hoursTitle: "Program",
      hours: [
        "Luni - Vineri: 08:00 - 20:00",
        "Sâmbătă: 09:00 - 21:00",
        "Duminică: 10:00 - 18:00"
      ],
      quickContactTitle: "Contact Rapid",
      whatsappText: "Chat pe WhatsApp",
      callText: "Sună acum",
      emailText: "Trimite email",
      socialTitle: "Urmărește-ne",
      faqLink: "Întrebări Frecvente",
      successMessage: "Mesajul tău a fost trimis cu succes! Te vom contacta în curând.",
      errorMessage: "Oops! A apărut o eroare. Te rugăm să încerci din nou.",
      requiredField: "Acest câmp este obligatoriu",
      invalidEmail: "Te rugăm să introduci un email valid"
    },
    en: {
      title: "Contact Us",
      subtitle: "We're here to help! Contact us for questions, custom orders, or any needs.",
      formTitle: "Send us a message",
      namePlaceholder: "Your full name",
      emailPlaceholder: "Email",
      phonePlaceholder: "Phone (optional)",
      subjectPlaceholder: "Subject",
      messagePlaceholder: "Your message...",
      sendButton: "Send Message",
      contactInfoTitle: "Contact Information",
      visitUsTitle: "Visit Us",
      address: "Str. Pastry Dream 42, Cluj-Napoca, Romania",
      hoursTitle: "Opening Hours",
      hours: [
        "Monday - Friday: 08:00 - 20:00",
        "Saturday: 09:00 - 21:00",
        "Sunday: 10:00 - 18:00"
      ],
      quickContactTitle: "Quick Contact",
      whatsappText: "Chat on WhatsApp",
      callText: "Call now",
      emailText: "Send email",
      socialTitle: "Follow Us",
      faqLink: "Frequently Asked Questions",
      successMessage: "Your message has been sent successfully! We'll contact you soon.",
      errorMessage: "Oops! An error occurred. Please try again.",
      requiredField: "This field is required",
      invalidEmail: "Please enter a valid email"
    }
  };

  const t = content[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 5000);
      return;
    }

    console.log('Form submitted:', formData);
    setFormStatus('success');
    
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFormStatus(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-16" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            {t.title}
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                {t.formTitle}
              </h2>
              
              {/* Status Messages */}
              {formStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <p className="text-green-800">{t.successMessage}</p>
                </div>
              )}
              
              {formStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="text-red-600" size={24} />
                  <p className="text-red-800">{t.errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.namePlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none transition"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none transition"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phonePlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none transition"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={t.subjectPlaceholder}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none transition"
                    required
                  />
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t.messagePlaceholder}
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none transition resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#d4af37' }}
                >
                  <Send size={20} />
                  {t.sendButton}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              
              {/* Visit Us Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3" style={{ color: '#1e3a8a' }}>
                  <MapPin size={28} style={{ color: '#d4af37' }} />
                  {t.visitUsTitle}
                </h3>
                
                <p className="text-gray-600 mb-6 text-lg">
                  {t.address}
                </p>

                {/* Map Placeholder */}
                <div className="w-full h-64 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border-2 border-gray-200">
                  <MapPin size={60} className="text-gray-300" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-100">
                  <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#1e3a8a' }}>
                    <Clock size={20} style={{ color: '#d4af37' }} />
                    {t.hoursTitle}
                  </h4>
                  {t.hours.map((hour, index) => (
                    <p key={index} className="text-gray-600 mb-1">{hour}</p>
                  ))}
                </div>
              </div>

              {/* Quick Contact Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                  {t.quickContactTitle}
                </h3>
                
                <div className="space-y-4">
                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/40123456789"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition border-2 border-green-100 group"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{t.whatsappText}</p>
                      <p className="text-sm text-gray-600">+40 123 456 789</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href="tel:+40123456789"
                    className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition border-2 border-blue-100 group"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition" 
                      style={{ backgroundColor: '#1e3a8a' }}>
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{t.callText}</p>
                      <p className="text-sm text-gray-600">+40 123 456 789</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:contact@odette.ro"
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition border-2 border-gray-100 group"
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition"
                      style={{ backgroundColor: '#d4af37' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{t.emailText}</p>
                      <p className="text-sm text-gray-600">contact@odette.ro</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Social Media Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
                  {t.socialTitle}
                </h3>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/odettepastry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
                  >
                    <Facebook className="text-white" size={28} />
                  </a>
                  <a
                    href="https://instagram.com/odettepastry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-110 transition shadow-lg"
                  >
                    <Instagram className="text-white" size={28} />
                  </a>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="rounded-2xl shadow-xl p-6 text-center text-white" style={{ backgroundColor: '#1e3a8a' }}>
                <p className="mb-4">
                  {language === 'ro' ? 'Ai întrebări frecvente?' : 'Have common questions?'}
                </p>
                <button className="bg-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition"
                  style={{ color: '#1e3a8a' }}>
                  {t.faqLink}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;