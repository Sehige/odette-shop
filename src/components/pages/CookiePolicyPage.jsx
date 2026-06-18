import React from 'react';
import { Cookie, Info, Settings, Shield, List, Trash2 } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import MetaTags from '../SEO/MetaTags';
import { seoConfig } from '../../config/seoConfig';

const CookiePolicyPage = ({ language }) => {
  const isRomanian = language === 'ro';

  const content = {
    ro: {
      title: 'Politica de Cookies',
      subtitle: 'Cum folosim cookie-urile pe site-ul nostru',
      lastUpdate: 'Ultima actualizare: Noiembrie 2024',

      sections: [
        {
          icon: Info,
          title: '1. Ce Sunt Cookie-urile?',
          content: [
            'Cookie-urile sunt fișiere text mici pe care site-urile web le stochează pe dispozitivul dumneavoastră (computer, telefon, tabletă) atunci când le vizitați.',
            'Aceste fișiere conțin informații care ajută site-ul să funcționeze corect și să vă ofere o experiență personalizată.',
            'Cookie-urile nu conțin viruși și nu pot accesa informații personale de pe dispozitivul dumneavoastră.'
          ]
        },
        {
          icon: Info,
          title: '2. De Ce Folosim Cookie-uri?',
          content: [
            'Folosim cookie-uri pentru a:',
            '• Vă ține autentificați pe site (dacă aveți cont)',
            '• Reține produsele din coșul de cumpărături',
            '• Înțelege cum folosiți site-ul nostru',
            '• Îmbunătăți funcționalitatea și experiența utilizatorului',
            '• Analiza traficul și comportamentul vizitatorilor',
            '• Personaliza conținutul și ofertele',
            '',
            'Fără cookie-uri, multe funcționalități ale site-ului nu ar funcționa corect.'
          ]
        },
        {
          icon: List,
          title: '3. Tipuri de Cookie-uri pe Care le Folosim',
          content: [
            '<strong>3.1 Cookie-uri Strict Necesare (Essential)</strong>',
            'Aceste cookie-uri sunt esențiale pentru funcționarea site-ului și nu pot fi dezactivate. Ele includ:',
            '',
            '• <strong>Cookie-uri de sesiune:</strong> Vă păstrează autentificați pe site în timpul vizitei',
            '• <strong>Cookie-uri pentru coșul de cumpărături:</strong> Rețin produsele adăugate în coș',
            '• <strong>Cookie-uri de securitate:</strong> Protejează împotriva atacurilor și fraudelor',
            '• <strong>Cookie-uri pentru preferințe de limbă:</strong> Rețin limba selectată (RO/EN)',
            '',
            '<em>Durata:</em> Majoritatea sunt cookie-uri de sesiune care expiră când închideți browserul. Unele pot dura până la 1 an.',
            '<em>Temei legal:</em> Interes legitim - necesare pentru funcționarea site-ului',
            '',
            '<strong>3.2 Cookie-uri de Performanță și Analiză (Optional)</strong>',
            'Aceste cookie-uri ne ajută să înțelegem cum interacționați cu site-ul nostru:',
            '',
            '• Numărul de vizitatori',
            '• Paginile cele mai vizitate',
            '• Timpul petrecut pe site',
            '• Sursa traficului (de unde ați ajuns pe site)',
            '• Ratele de conversie',
            '',
            '<em>Exemple de servicii:</em> Google Analytics, Facebook Pixel (dacă sunt activate)',
            '<em>Durata:</em> Până la 2 ani',
            '<em>Temei legal:</em> Consimțământ (puteți refuza aceste cookie-uri)',
            '',
            '<strong>3.3 Cookie-uri de Marketing și Publicitate (Optional)</strong>',
            'Aceste cookie-uri sunt folosite pentru a vă afișa reclame relevante:',
            '',
            '• Urmăresc vizitele pe diverse site-uri',
            '• Creează un profil al intereselor dumneavoastră',
            '• Afișează anunțuri personalizate pe alte platforme',
            '',
            '<em>Exemple:</em> Facebook, Google Ads, remarketing',
            '<em>Durata:</em> Până la 2 ani',
            '<em>Temei legal:</em> Consimțământ (puteți refuza aceste cookie-uri)',
            '',
            '<strong>3.4 Cookie-uri Funcționale (Optional)</strong>',
            'Aceste cookie-uri permit funcționalități suplimentare:',
            '',
            '• Preferințe de afișare (mod dark/light - dacă există)',
            '• Preferințe de livrare salvate',
            '• Produse recent vizualizate',
            '',
            '<em>Durata:</em> Până la 1 an',
            '<em>Temei legal:</em> Consimțământ sau interes legitim'
          ]
        },
        {
          icon: Shield,
          title: '4. Cookie-uri de la Terțe Părți',
          content: [
            'Site-ul nostru poate folosi servicii de la terțe părți care setează propriile cookie-uri:',
            '',
            '<strong>4.1 Google Analytics</strong>',
            'Folosit pentru a analiza traficul pe site și a înțelege comportamentul utilizatorilor.',
            'Pentru mai multe informații: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Google Privacy Policy</a>',
            '',
            '<strong>4.2 Procesatori de plăți</strong>',
            'Furnizorii de servicii de plată pot seta cookie-uri pentru a procesa tranzacțiile în siguranță.',
            '',
            '<strong>4.3 Rețele sociale (dacă sunt integrate)</strong>',
            'Dacă integrăm butoane de social media (Facebook, Instagram), aceste platforme pot seta propriile cookie-uri.',
            '',
            'Nu avem control asupra cookie-urilor setate de terțe părți. Vă rugăm să consultați politicile lor de confidențialitate.'
          ]
        },
        {
          icon: Settings,
          title: '5. Cum Puteți Gestiona Cookie-urile?',
          content: [
            '<strong>5.1 Setări Browser</strong>',
            'Puteți controla și șterge cookie-urile prin setările browserului:',
            '',
            '• <strong>Google Chrome:</strong> Settings > Privacy and Security > Cookies',
            '• <strong>Mozilla Firefox:</strong> Options > Privacy & Security > Cookies',
            '• <strong>Safari:</strong> Preferences > Privacy > Cookies',
            '• <strong>Microsoft Edge:</strong> Settings > Privacy > Cookies',
            '',
            '<strong>5.2 Blocarea Cookie-urilor</strong>',
            'Puteți configura browserul să blocheze toate cookie-urile sau doar cele de la terțe părți.',
            '',
            '<strong>⚠️ Atenție:</strong> Blocarea cookie-urilor strict necesare poate afecta funcționarea site-ului (de ex., nu veți putea adăuga produse în coș sau plasa comenzi).',
            '',
            '<strong>5.3 Ștergerea Cookie-urilor</strong>',
            'Puteți șterge cookie-urile existente din setările browserului. Această acțiune va reseta preferințele salvate.',
            '',
            '<strong>5.4 Instrumente de Opt-Out</strong>',
            'Pentru cookie-uri de analiză și marketing, puteți folosi:',
            '',
            '• Google Analytics Opt-Out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">tools.google.com/dlpage/gaoptout</a>',
            '• Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">optout.networkadvertising.org</a>',
            '• Your Online Choices (Europa): <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.youronlinechoices.com</a>'
          ]
        },
        {
          icon: Trash2,
          title: '6. Durata de Stocare a Cookie-urilor',
          content: [
            '<strong>Cookie-uri de sesiune:</strong>',
            'Expiră atunci când închideți browserul.',
            '',
            '<strong>Cookie-uri persistente:</strong>',
            '• Cookie-uri esențiale: până la 1 an',
            '• Cookie-uri de analiză: până la 2 ani',
            '• Cookie-uri de marketing: până la 2 ani',
            '',
            'După expirare, cookie-urile sunt șterse automat.'
          ]
        },
        {
          icon: Shield,
          title: '7. Confidențialitate și Securitate',
          content: [
            'Cookie-urile pe care le folosim nu conțin informații personale identificabile direct (cum ar fi numele sau adresa).',
            'Datele colectate prin cookie-uri sunt folosite în conformitate cu Politica de Confidențialitate și GDPR.',
            'Cookie-urile sunt transmise prin conexiuni securizate (HTTPS/SSL).'
          ]
        },
        {
          icon: Info,
          title: '8. Actualizări ale Politicii de Cookie-uri',
          content: [
            'Ne rezervăm dreptul de a actualiza această politică pentru a reflecta schimbările în tehnologie sau legislație.',
            'Orice modificare va fi publicată pe această pagină, cu actualizarea datei de revizuire.',
            'Vă recomandăm să verificați periodic această pagină.'
          ]
        },
        {
          icon: Info,
          title: '9. Întrebări și Contact',
          content: [
            'Dacă aveți întrebări despre folosirea cookie-urilor pe site-ul nostru, ne puteți contacta:',
            '',
            '<strong>Email:</strong> ' + siteConfig.contact.email,
            '<strong>Telefon:</strong> ' + siteConfig.contact.phone,
            '',
            'Pentru mai multe informații despre protecția datelor, consultați și <a href="/privacy-policy" class="text-blue-600 hover:underline">Politica de Confidențialitate</a>.'
          ]
        }
      ]
    },
    en: {
      title: 'Cookie Policy',
      subtitle: 'How we use cookies on our website',
      lastUpdate: 'Last updated: November 2024',

      sections: [
        {
          icon: Info,
          title: '1. What Are Cookies?',
          content: [
            'Cookies are small text files that websites store on your device (computer, phone, tablet) when you visit them.',
            'These files contain information that helps the website function correctly and provide you with a personalized experience.',
            'Cookies do not contain viruses and cannot access personal information from your device.'
          ]
        },
        {
          icon: Info,
          title: '2. Why Do We Use Cookies?',
          content: [
            'We use cookies to:',
            '• Keep you logged in on the site (if you have an account)',
            '• Remember products in your shopping cart',
            '• Understand how you use our website',
            '• Improve functionality and user experience',
            '• Analyze traffic and visitor behavior',
            '• Personalize content and offers',
            '',
            'Without cookies, many website functionalities would not work correctly.'
          ]
        },
        {
          icon: List,
          title: '3. Types of Cookies We Use',
          content: [
            '<strong>3.1 Strictly Necessary Cookies (Essential)</strong>',
            'These cookies are essential for the website to function and cannot be disabled. They include:',
            '',
            '• <strong>Session cookies:</strong> Keep you authenticated on the site during your visit',
            '• <strong>Shopping cart cookies:</strong> Remember products added to cart',
            '• <strong>Security cookies:</strong> Protect against attacks and fraud',
            '• <strong>Language preference cookies:</strong> Remember selected language (RO/EN)',
            '',
            '<em>Duration:</em> Most are session cookies that expire when you close the browser. Some may last up to 1 year.',
            '<em>Legal basis:</em> Legitimate interest - necessary for website operation',
            '',
            '<strong>3.2 Performance and Analytics Cookies (Optional)</strong>',
            'These cookies help us understand how you interact with our website:',
            '',
            '• Number of visitors',
            '• Most visited pages',
            '• Time spent on site',
            '• Traffic source (where you came from)',
            '• Conversion rates',
            '',
            '<em>Service examples:</em> Google Analytics, Facebook Pixel (if activated)',
            '<em>Duration:</em> Up to 2 years',
            '<em>Legal basis:</em> Consent (you can refuse these cookies)',
            '',
            '<strong>3.3 Marketing and Advertising Cookies (Optional)</strong>',
            'These cookies are used to show you relevant ads:',
            '',
            '• Track visits across different websites',
            '• Create a profile of your interests',
            '• Display personalized ads on other platforms',
            '',
            '<em>Examples:</em> Facebook, Google Ads, remarketing',
            '<em>Duration:</em> Up to 2 years',
            '<em>Legal basis:</em> Consent (you can refuse these cookies)',
            '',
            '<strong>3.4 Functional Cookies (Optional)</strong>',
            'These cookies enable additional functionalities:',
            '',
            '• Display preferences (dark/light mode - if exists)',
            '• Saved delivery preferences',
            '• Recently viewed products',
            '',
            '<em>Duration:</em> Up to 1 year',
            '<em>Legal basis:</em> Consent or legitimate interest'
          ]
        },
        {
          icon: Shield,
          title: '4. Third-Party Cookies',
          content: [
            'Our website may use third-party services that set their own cookies:',
            '',
            '<strong>4.1 Google Analytics</strong>',
            'Used to analyze website traffic and understand user behavior.',
            'For more information: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">Google Privacy Policy</a>',
            '',
            '<strong>4.2 Payment processors</strong>',
            'Payment service providers may set cookies to securely process transactions.',
            '',
            '<strong>4.3 Social networks (if integrated)</strong>',
            'If we integrate social media buttons (Facebook, Instagram), these platforms may set their own cookies.',
            '',
            'We have no control over cookies set by third parties. Please consult their privacy policies.'
          ]
        },
        {
          icon: Settings,
          title: '5. How Can You Manage Cookies?',
          content: [
            '<strong>5.1 Browser Settings</strong>',
            'You can control and delete cookies through browser settings:',
            '',
            '• <strong>Google Chrome:</strong> Settings > Privacy and Security > Cookies',
            '• <strong>Mozilla Firefox:</strong> Options > Privacy & Security > Cookies',
            '• <strong>Safari:</strong> Preferences > Privacy > Cookies',
            '• <strong>Microsoft Edge:</strong> Settings > Privacy > Cookies',
            '',
            '<strong>5.2 Blocking Cookies</strong>',
            'You can configure your browser to block all cookies or just third-party cookies.',
            '',
            '<strong>⚠️ Warning:</strong> Blocking strictly necessary cookies may affect website functionality (e.g., you won\'t be able to add products to cart or place orders).',
            '',
            '<strong>5.3 Deleting Cookies</strong>',
            'You can delete existing cookies from browser settings. This action will reset saved preferences.',
            '',
            '<strong>5.4 Opt-Out Tools</strong>',
            'For analytics and marketing cookies, you can use:',
            '',
            '• Google Analytics Opt-Out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">tools.google.com/dlpage/gaoptout</a>',
            '• Network Advertising Initiative: <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">optout.networkadvertising.org</a>',
            '• Your Online Choices (Europe): <a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.youronlinechoices.com</a>'
          ]
        },
        {
          icon: Trash2,
          title: '6. Cookie Storage Duration',
          content: [
            '<strong>Session cookies:</strong>',
            'Expire when you close the browser.',
            '',
            '<strong>Persistent cookies:</strong>',
            '• Essential cookies: up to 1 year',
            '• Analytics cookies: up to 2 years',
            '• Marketing cookies: up to 2 years',
            '',
            'After expiration, cookies are automatically deleted.'
          ]
        },
        {
          icon: Shield,
          title: '7. Privacy and Security',
          content: [
            'The cookies we use do not contain directly identifiable personal information (such as name or address).',
            'Data collected through cookies is used in accordance with the Privacy Policy and GDPR.',
            'Cookies are transmitted through secure connections (HTTPS/SSL).'
          ]
        },
        {
          icon: Info,
          title: '8. Cookie Policy Updates',
          content: [
            'We reserve the right to update this policy to reflect changes in technology or legislation.',
            'Any changes will be published on this page, with an update to the revision date.',
            'We recommend checking this page periodically.'
          ]
        },
        {
          icon: Info,
          title: '9. Questions and Contact',
          content: [
            'If you have questions about cookie usage on our website, you can contact us:',
            '',
            '<strong>Email:</strong> ' + siteConfig.contact.email,
            '<strong>Phone:</strong> ' + siteConfig.contact.phone,
            '',
            'For more information about data protection, also consult the <a href="/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</a>.'
          ]
        }
      ]
    }
  };

  const currentContent = isRomanian ? content.ro : content.en;

  return (
    <>
      <MetaTags
        title={isRomanian ? 'Politica de Cookies' : 'Cookie Policy'}
        description={isRomanian
          ? 'Politica de cookies pentru Odette Confiserie.'
          : 'Cookie policy for Odette Confiserie.'}
        url={`${seoConfig.siteUrl}/cookie-policy`}
        lang={language}
        noindex={true}
      />
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6" style={{ backgroundColor: '#d4af37' }}>
              <Cookie className="text-white" size={40} />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{currentContent.title}</h1>
            <p className="text-2xl mb-2" style={{ color: '#d4af37' }}>{currentContent.subtitle}</p>
            <p className="text-sm text-blue-200">{currentContent.lastUpdate}</p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      {currentContent.sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <section key={index} className={`py-16 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d4af37' }}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>
                    {section.title}
                  </h2>
                </div>
                <div className="prose max-w-none">
                  {section.content.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-gray-700 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: paragraph }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* Contact Footer */}
      <section className="py-12 bg-gray-100 border-t-2" style={{ borderColor: '#d4af37' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-700 text-lg">
              {isRomanian
                ? 'Pentru mai multe informații despre protecția datelor, consultați:'
                : 'For more information about data protection, consult:'}
            </p>
            <div className="mt-4 space-x-4">
              <a href="/privacy-policy" className="text-blue-600 hover:underline font-semibold">
                {isRomanian ? 'Politica de Confidențialitate' : 'Privacy Policy'}
              </a>
              <span className="text-gray-400">|</span>
              <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-600 hover:underline font-semibold">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default CookiePolicyPage;
