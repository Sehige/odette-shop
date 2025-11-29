import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  Upload,
  Heart,
  Cake,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  X,
  Image as ImageIcon,
  Clock,
  Award,
  Crown
} from 'lucide-react';
import { translations } from '../../data/translations';

const EventsPage = ({ language = 'ro' }) => {
  const [formData, setFormData] = useState({
    eventType: '',
    eventDate: '',
    guestCount: '',
    budget: '',
    requirements: '',
    dietary: '',
    deliveryType: 'delivery',
    name: '',
    email: '',
    phone: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [formStatus, setFormStatus] = useState(null);

  // Use centralized translations
  const t = translations[language].events;

  // Icons mapping for features section
  const featuresWithIcons = [
    { ...t.featuresExperience, icon: Award },
    { ...t.featuresAttention, icon: Heart },
    { ...t.featuresResponse, icon: Clock },
    { ...t.featuresTasting, icon: Cake }
  ];

  /* OLD LOCAL CONTENT REMOVED - Now using centralized translations
  const content = {
    ro: {
      title: "Evenimente Speciale & Comenzi Personalizate",
      subtitle: "Transformăm visele tale dulci în realitate pentru evenimente de neuitat",
      heroText: "Torturi personalizate pentru nunți, botezuri, corporate events și orice moment special",
      formTitle: "Creează Comanda Ta Personalizată",
      eventTypeLabel: "Tip Eveniment",
      eventTypes: [
        { value: 'wedding', label: 'Nuntă' },
        { value: 'birthday', label: 'Aniversare' },
        { value: 'baptism', label: 'Botez' },
        { value: 'corporate', label: 'Corporate' },
        { value: 'other', label: 'Altele' }
      ],
      eventDateLabel: "Data Evenimentului",
      guestCountLabel: "Număr Invitați",
      budgetLabel: "Buget Estimat",
      budgetRanges: [
        { value: '200-500', label: '200 - 500 RON' },
        { value: '500-1000', label: '500 - 1,000 RON' },
        { value: '1000-2000', label: '1,000 - 2,000 RON' },
        { value: '2000+', label: '2,000+ RON' }
      ],
      requirementsLabel: "Cerințe Specifice",
      requirementsPlaceholder: "Descrie tortul dorit: teme, culori, design, dimensiuni...",
      dietaryLabel: "Restricții Dietetice",
      dietaryPlaceholder: "Ex: fără gluten, vegan, fără zahăr...",
      deliveryTypeLabel: "Livrare sau Ridicare",
      deliveryOption: "Livrare la adresă",
      pickupOption: "Ridicare de la magazin",
      nameLabel: "Numele Tău",
      emailLabel: "Email",
      phoneLabel: "Telefon",
      uploadLabel: "Încarcă Poze de Inspirație",
      uploadText: "Trage fișierele aici sau click pentru a încărca",
      submitButton: "Trimite Cererea",
      responseTime: "Răspundem în 24 de ore",
      whatsappQuick: "Contact rapid pe WhatsApp",
      
      galleryTitle: "Portofoliu Evenimente",
      gallerySubtitle: "Câteva dintre creațiile noastre pentru evenimente speciale",
      
      pricingTitle: "Ghid de Prețuri",
      pricingSubtitle: "Prețurile orientative pentru comenzi personalizate",
      pricingTiers: [
        {
          title: "Tort Small",
          price: "250 - 400 RON",
          features: [
            "10-20 persoane",
            "Design simplu",
            "1-2 nivele",
            "Decorațiuni clasice"
          ]
        },
        {
          title: "Tort Medium",
          price: "450 - 800 RON",
          features: [
            "20-40 persoane",
            "Design elaborat",
            "2-3 nivele",
            "Decorațiuni premium",
            "Toppere personalizate"
          ]
        },
        {
          title: "Tort Large",
          price: "850 - 1,500 RON",
          features: [
            "40-80 persoane",
            "Design complex",
            "3+ nivele",
            "Decorațiuni artistice",
            "Figurine personalizate",
            "Stand inclus"
          ]
        },
        {
          title: "Tort Premium",
          price: "1,500+ RON",
          features: [
            "80+ persoane",
            "Design unic",
            "Orice număr nivele",
            "Arte comestibile",
            "Consultant dedicat",
            "Degustare gratuită"
          ]
        }
      ],
      
      featuresTitle: "De Ce Să Alegi Odette?",
      features: [
        {
          icon: Award,
          title: "Experiență",
          description: "Peste 500 de evenimente realizate cu succes"
        },
        {
          icon: Heart,
          title: "Atenție la Detalii",
          description: "Fiecare tort este o operă de artă unică"
        },
        {
          icon: Clock,
          title: "Răspuns Rapid",
          description: "Îți răspundem în maxim 24 de ore"
        },
        {
          icon: Cake,
          title: "Degustare Gratuită",
          description: "Pentru comenzi peste 1,000 RON"
        }
      ],
      
      successMessage: "Cererea ta a fost trimisă cu succes! Te vom contacta în curând pentru detalii.",
      errorMessage: "Oops! A apărut o eroare. Te rugăm să încerci din nou."
    },
    en: {
      title: "Special Events & Custom Orders",
      subtitle: "We transform your sweet dreams into reality for unforgettable events",
      heroText: "Custom cakes for weddings, baptisms, corporate events, and any special moment",
      formTitle: "Create Your Custom Order",
      eventTypeLabel: "Event Type",
      eventTypes: [
        { value: 'wedding', label: 'Wedding' },
        { value: 'birthday', label: 'Birthday' },
        { value: 'baptism', label: 'Baptism' },
        { value: 'corporate', label: 'Corporate' },
        { value: 'other', label: 'Other' }
      ],
      eventDateLabel: "Event Date",
      guestCountLabel: "Number of Guests",
      budgetLabel: "Estimated Budget",
      budgetRanges: [
        { value: '200-500', label: '200 - 500 RON' },
        { value: '500-1000', label: '500 - 1,000 RON' },
        { value: '1000-2000', label: '1,000 - 2,000 RON' },
        { value: '2000+', label: '2,000+ RON' }
      ],
      requirementsLabel: "Specific Requirements",
      requirementsPlaceholder: "Describe your desired cake: themes, colors, design, dimensions...",
      dietaryLabel: "Dietary Restrictions",
      dietaryPlaceholder: "E.g., gluten-free, vegan, sugar-free...",
      deliveryTypeLabel: "Delivery or Pickup",
      deliveryOption: "Delivery to address",
      pickupOption: "Pickup from store",
      nameLabel: "Your Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      uploadLabel: "Upload Inspiration Photos",
      uploadText: "Drag files here or click to upload",
      submitButton: "Submit Request",
      responseTime: "We respond within 24 hours",
      whatsappQuick: "Quick contact on WhatsApp",
      
      galleryTitle: "Events Portfolio",
      gallerySubtitle: "Some of our creations for special events",
      
      pricingTitle: "Pricing Guide",
      pricingSubtitle: "Indicative prices for custom orders",
      pricingTiers: [
        {
          title: "Small Cake",
          price: "250 - 400 RON",
          features: [
            "10-20 servings",
            "Simple design",
            "1-2 tiers",
            "Classic decorations"
          ]
        },
        {
          title: "Medium Cake",
          price: "450 - 800 RON",
          features: [
            "20-40 servings",
            "Elaborate design",
            "2-3 tiers",
            "Premium decorations",
            "Custom toppers"
          ]
        },
        {
          title: "Large Cake",
          price: "850 - 1,500 RON",
          features: [
            "40-80 servings",
            "Complex design",
            "3+ tiers",
            "Artistic decorations",
            "Custom figurines",
            "Stand included"
          ]
        },
        {
          title: "Premium Cake",
          price: "1,500+ RON",
          features: [
            "80+ servings",
            "Unique design",
            "Any number of tiers",
            "Edible art",
            "Dedicated consultant",
            "Free tasting"
          ]
        }
      ],
      
      featuresTitle: "Why Choose Odette?",
      features: [
        {
          icon: Award,
          title: "Experience",
          description: "Over 500 events successfully completed"
        },
        {
          icon: Heart,
          title: "Attention to Detail",
          description: "Each cake is a unique work of art"
        },
        {
          icon: Clock,
          title: "Quick Response",
          description: "We respond within 24 hours"
        },
        {
          icon: Cake,
          title: "Free Tasting",
          description: "For orders over 1,000 RON"
        }
      ],
      
      successMessage: "Your request has been sent successfully! We'll contact you soon for details.",
      errorMessage: "Oops! An error occurred. Please try again."
    }
  }; */

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      preview: URL.createObjectURL(file)
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData, uploadedFiles);
    setFormStatus('success');
    
    setTimeout(() => {
      setFormData({
        eventType: '',
        eventDate: '',
        guestCount: '',
        budget: '',
        requirements: '',
        dietary: '',
        deliveryType: 'delivery',
        name: '',
        email: '',
        phone: ''
      });
      setUploadedFiles([]);
      setFormStatus(null);
    }, 3000);
  };

  const galleryItems = [
    { id: 1, category: 'wedding', label: language === 'ro' ? 'Tort Nuntă' : 'Wedding Cake' },
    { id: 2, category: 'birthday', label: language === 'ro' ? 'Tort Aniversare' : 'Birthday Cake' },
    { id: 3, category: 'baptism', label: language === 'ro' ? 'Tort Botez' : 'Baptism Cake' },
    { id: 4, category: 'corporate', label: language === 'ro' ? 'Tort Corporate' : 'Corporate Cake' },
    { id: 5, category: 'wedding', label: language === 'ro' ? 'Tort Nuntă Elegant' : 'Elegant Wedding Cake' },
    { id: 6, category: 'birthday', label: language === 'ro' ? 'Tort Tematic' : 'Themed Cake' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
          }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6">
              <Crown size={64} style={{ color: '#d4af37' }} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              {t.title}
            </h1>
            <p className="text-xl mb-4" style={{ color: '#d4af37' }}>
              {t.subtitle}
            </p>
            <p className="text-lg opacity-90">
              {t.heroText}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#1e3a8a' }}>
            {t.featuresTitle}
          </h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresWithIcons.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl text-center hover:shadow-lg transition border-2 border-gray-100"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                    style={{ backgroundColor: '#d4af37' }}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Order Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-gray-100">
            <h2 className="text-4xl font-bold mb-2 text-center" style={{ color: '#1e3a8a' }}>
              {t.formTitle}
            </h2>
            <p className="text-center text-gray-600 mb-8 flex items-center justify-center gap-2">
              <Clock size={20} style={{ color: '#d4af37' }} />
              {t.responseTime}
            </p>

            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={24} />
                <p className="text-green-800">{t.successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.eventTypeLabel} *
                </label>
                <select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                  required
                >
                  <option value="">-- {t.eventTypeLabel} --</option>
                  {t.eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <Calendar size={18} style={{ color: '#d4af37' }} />
                    {t.eventDateLabel} *
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                    <Users size={18} style={{ color: '#d4af37' }} />
                    {t.guestCountLabel} *
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="1"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <DollarSign size={18} style={{ color: '#d4af37' }} />
                  {t.budgetLabel} *
                </label>
                <select
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                  required
                >
                  <option value="">-- {t.budgetLabel} --</option>
                  {t.budgetRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.requirementsLabel} *
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder={t.requirementsPlaceholder}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.dietaryLabel}
                </label>
                <input
                  type="text"
                  name="dietary"
                  value={formData.dietary}
                  onChange={handleInputChange}
                  placeholder={t.dietaryPlaceholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t.deliveryTypeLabel} *
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={formData.deliveryType === 'delivery'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                      style={{ accentColor: '#1e3a8a' }}
                    />
                    <span>{t.deliveryOption}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={formData.deliveryType === 'pickup'}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                      style={{ accentColor: '#1e3a8a' }}
                    />
                    <span>{t.pickupOption}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                  <Upload size={18} style={{ color: '#d4af37' }} />
                  {t.uploadLabel}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-900 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <ImageIcon className="mx-auto text-gray-400 mb-2" size={48} />
                    <p className="text-gray-600">{t.uploadText}</p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t-2 border-gray-100 pt-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1e3a8a' }}>
                  {language === 'ro' ? 'Informații de Contact' : 'Contact Information'}
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.nameLabel}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailLabel}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.phoneLabel}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition"
                style={{ backgroundColor: '#d4af37' }}
              >
                {t.submitButton}
              </button>

              <div className="text-center">
                <a
                  href="https://wa.me/40123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                >
                  <MessageCircle size={20} />
                  {t.whatsappQuick}
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#1e3a8a' }}>
            {t.galleryTitle}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {t.gallerySubtitle}
          </p>
          
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map(item => (
              <div 
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <div className="w-full h-full bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <Cake size={80} className="text-gray-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end">
                  <p className="text-white font-bold text-xl p-6">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Guide Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4" style={{ color: '#1e3a8a' }}>
            {t.pricingTitle}
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            {t.pricingSubtitle}
          </p>
          
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.pricingTiers.map((tier, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-2 ${
                  index === 2 ? 'border-blue-900 transform scale-105' : 'border-gray-100'
                }`}
              >
                {index === 2 && (
                  <div className="text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4"
                    style={{ backgroundColor: '#d4af37' }}>
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2" style={{ color: '#1e3a8a' }}>
                  {tier.title}
                </h3>
                <p className="text-3xl font-bold mb-6" style={{ color: '#d4af37' }}>
                  {tier.price}
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white" style={{ backgroundColor: '#1e3a8a' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            {language === 'ro' 
              ? 'Gata să creăm ceva special împreună?' 
              : 'Ready to create something special together?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {language === 'ro'
              ? 'Contactează-ne astăzi și hai să discutăm despre visul tău dulce!'
              : 'Contact us today and let\'s discuss your sweet dream!'}
          </p>
          <a
            href="#form"
            className="inline-block text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ backgroundColor: '#d4af37' }}
          >
            {language === 'ro' ? 'Începe Comanda' : 'Start Order'}
          </a>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;