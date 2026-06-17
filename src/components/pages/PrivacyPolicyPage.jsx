import React from 'react';
import { Shield, Database, Lock, UserCheck, Mail, Cookie, Eye } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';
import MetaTags from '../SEO/MetaTags';
import { seoConfig } from '../../config/seoConfig';

const PrivacyPolicyPage = ({ language }) => {
  const isRomanian = language === 'ro';

  const content = {
    ro: {
      title: 'Politica de Confidențialitate',
      subtitle: 'Protecția datelor cu caracter personal (GDPR)',
      lastUpdate: 'Ultima actualizare: Noiembrie 2024',

      sections: [
        {
          icon: Shield,
          title: '1. Introducere',
          content: [
            `${siteConfig.company.legalName} (CUI: ${siteConfig.company.cui}) respectă confidențialitatea utilizatorilor și se angajează să protejeze datele cu caracter personal în conformitate cu Regulamentul General privind Protecția Datelor (GDPR - Regulamentul UE 2016/679) și legislația română aplicabilă.`,
            'Prezenta Politică de Confidențialitate explică ce date colectăm, de ce le colectăm, cum le folosim și care sunt drepturile dumneavoastră.'
          ]
        },
        {
          icon: Database,
          title: '2. Operatorul de Date',
          content: [
            '<strong>Operator de date:</strong> ' + siteConfig.company.legalName,
            '<strong>CUI:</strong> ' + siteConfig.company.cui,
            '<strong>Sediu social:</strong> ' + siteConfig.company.registeredOffice.ro,
            '<strong>Email contact:</strong> ' + siteConfig.contact.email,
            '<strong>Telefon:</strong> ' + siteConfig.contact.phone,
            '',
            'Pentru orice întrebări legate de protecția datelor, ne puteți contacta la adresa de email menționată mai sus.'
          ]
        },
        {
          icon: Database,
          title: '3. Ce Date Colectăm',
          content: [
            '<strong>3.1 Date furnizate direct de dumneavoastră:</strong>',
            '• Nume și prenume',
            '• Adresă de email',
            '• Număr de telefon',
            '• Adresă de livrare',
            '• Preferințe alimentare sau alergii (dacă sunt furnizate)',
            '',
            '<strong>3.2 Date colectate automat:</strong>',
            '• Adresa IP',
            '• Tipul și versiunea browserului',
            '• Sistemul de operare',
            '• Data și ora accesării site-ului',
            '• Paginile vizitate',
            '• Cookie-uri (vezi Politica de Cookies)',
            '',
            '<strong>3.3 Date de plată:</strong>',
            'Datele cardului bancar sunt procesate direct de furnizorii de servicii de plată certificați și nu sunt stocate pe serverele noastre.'
          ]
        },
        {
          icon: Lock,
          title: '4. Temeiul Legal și Scopul Prelucrării',
          content: [
            '<strong>4.1 Executarea contractului</strong>',
            'Prelucrăm datele dumneavoastră pentru a procesa și livra comenzile, a vă contacta în legătură cu comanda și a emite facturi.',
            '',
            '<strong>4.2 Consimțământ</strong>',
            'Cu consimțământul dumneavoastră explicit, vă trimitem newsletter-e cu oferte, promoții și noutăți. Puteți retrage consimțământul oricând.',
            '',
            '<strong>4.3 Obligații legale</strong>',
            'Păstrăm datele necesare pentru respectarea obligațiilor fiscale și contabile (de ex. facturi) conform legislației în vigoare.',
            '',
            '<strong>4.4 Interes legitim</strong>',
            'Analizăm comportamentul utilizatorilor pe site pentru a îmbunătăți experiența și serviciile noastre.'
          ]
        },
        {
          icon: Eye,
          title: '5. Cum Folosim Datele',
          content: [
            '• Procesarea și finalizarea comenzilor',
            '• Livrarea produselor comandate',
            '• Comunicarea cu privire la comenzi (confirmări, statusuri)',
            '• Emiterea facturilor fiscale',
            '• Răspunsuri la întrebări și solicitări',
            '• Trimiterea de oferte și promoții (cu consimțământ)',
            '• Îmbunătățirea site-ului și a serviciilor noastre',
            '• Prevenirea fraudelor și asigurarea securității',
            '• Respectarea obligațiilor legale (fiscale, contabile)'
          ]
        },
        {
          icon: UserCheck,
          title: '6. Partajarea Datelor cu Terți',
          content: [
            'Nu vindem și nu închiriem datele dumneavoastră personale. Partajăm date doar cu partenerii de încredere, strict necesar pentru furnizarea serviciilor:',
            '',
            '<strong>6.1 Furnizori de servicii de livrare</strong>',
            'Partajăm numele, adresa și numărul de telefon cu compania de curierat pentru livrarea comenzilor.',
            '',
            '<strong>6.2 Procesatori de plăți</strong>',
            'Datele de plată sunt transmise direct către furnizorii certificați de servicii de plată (ex: procesatori PCI-DSS compliant).',
            '',
            '<strong>6.3 Servicii de hosting</strong>',
            'Site-ul nostru este găzduit pe servere securizate, care respectă standardele de protecție a datelor.',
            '',
            '<strong>6.4 Autorități publice</strong>',
            'Putem divulga date la cererea autorităților competente, în conformitate cu legislația în vigoare.'
          ]
        },
        {
          icon: Lock,
          title: '7. Securitatea Datelor',
          content: [
            'Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului neautorizat, modificării, divulgării sau distrugerii:',
            '',
            '• Criptare SSL/TLS pentru transmiterea datelor',
            '• Servere securizate cu acces restricționat',
            '• Parole criptate',
            '• Monitorizare continuă a sistemelor',
            '• Backup-uri regulate',
            '• Politici stricte de acces la date pentru angajați',
            '',
            'Cu toate acestea, nicio metodă de transmitere sau stocare electronică nu este 100% sigură.'
          ]
        },
        {
          icon: Database,
          title: '8. Durata de Stocare a Datelor',
          content: [
            '<strong>8.1 Date de comenzi:</strong>',
            'Datele legate de comenzi (facturi, istoricul achizițiilor) sunt păstrate conform obligațiilor legale fiscale și contabile - minimum 10 ani de la data emiterii.',
            '',
            '<strong>8.2 Date pentru marketing:</strong>',
            'Dacă v-ați abonat la newsletter, păstrăm datele până la retragerea consimțământului sau până la ștergerea contului.',
            '',
            '<strong>8.3 Cookie-uri și date de navigare:</strong>',
            'Vezi Politica de Cookies pentru detalii despre durata de stocare a cookie-urilor.',
            '',
            '<strong>8.4 Ștergerea datelor:</strong>',
            'După expirarea termenelor menționate, datele sunt șterse sau anonimizate.'
          ]
        },
        {
          icon: UserCheck,
          title: '9. Drepturile Dumneavoastră (GDPR)',
          content: [
            'Conform GDPR, aveți următoarele drepturi:',
            '',
            '<strong>9.1 Dreptul de acces</strong>',
            'Puteți solicita o copie a datelor personale pe care le deținem despre dumneavoastră.',
            '',
            '<strong>9.2 Dreptul la rectificare</strong>',
            'Puteți solicita corectarea datelor incorecte sau incomplete.',
            '',
            '<strong>9.3 Dreptul la ștergere ("dreptul de a fi uitat")</strong>',
            'Puteți solicita ștergerea datelor, cu excepția cazurilor în care avem obligații legale de păstrare.',
            '',
            '<strong>9.4 Dreptul la restricționarea prelucrării</strong>',
            'Puteți solicita limitarea modului în care folosim datele dumneavoastră.',
            '',
            '<strong>9.5 Dreptul la portabilitatea datelor</strong>',
            'Puteți solicita transferul datelor către alt operator, într-un format structurat.',
            '',
            '<strong>9.6 Dreptul la opoziție</strong>',
            'Puteți refuza prelucrarea datelor pentru marketing direct sau pe bază de interes legitim.',
            '',
            '<strong>9.7 Dreptul de a retrage consimțământul</strong>',
            'Dacă prelucrarea se bazează pe consimțământ, îl puteți retrage oricând.',
            '',
            '<strong>9.8 Dreptul de a depune o plângere</strong>',
            'Puteți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP): <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.dataprotection.ro</a>',
            '',
            'Pentru a exercita oricare dintre aceste drepturi, contactați-ne la: ' + siteConfig.contact.email
          ]
        },
        {
          icon: Cookie,
          title: '10. Cookie-uri',
          content: [
            'Site-ul nostru folosește cookie-uri pentru a îmbunătăți experiența utilizatorului și a analiza traficul.',
            'Pentru informații detaliate despre ce cookie-uri folosim și cum puteți să le gestionați, consultați Politica de Cookies.',
            '',
            'Prin continuarea navigării pe site, acceptați utilizarea cookie-urilor conform politicii noastre.'
          ]
        },
        {
          icon: Mail,
          title: '11. Marketing și Newsletter',
          content: [
            'Dacă vă abonați la newsletter-ul nostru, vom folosi adresa de email pentru a vă trimite:',
            '• Oferte și promoții speciale',
            '• Noutăți despre produse',
            '• Informații despre evenimente',
            '',
            'Puteți să vă dezabonați oricând făcând click pe linkul de dezabonare din orice email sau contactându-ne la ' + siteConfig.contact.email + '.',
            '',
            'Nu trimitem spam și nu partajăm adresa dumneavoastră de email cu terți în scopuri de marketing.'
          ]
        },
        {
          icon: Shield,
          title: '12. Minori',
          content: [
            'Site-ul nostru nu se adresează copiilor sub 16 ani.',
            'Nu colectăm cu bună știință date personale de la copii sub această vârstă.',
            'Dacă descoperim că am colectat date de la un minor fără consimțământul părintelui/tutorelui, vom șterge aceste informații imediat.'
          ]
        },
        {
          icon: Database,
          title: '13. Modificări ale Politicii de Confidențialitate',
          content: [
            'Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate periodic pentru a reflecta schimbările în practicile noastre sau în legislație.',
            'Modificările vor fi publicate pe această pagină, iar data ultimei actualizări va fi modificată corespunzător.',
            'Vă recomandăm să revizuiți periodic această politică pentru a rămâne informați.'
          ]
        },
        {
          icon: Mail,
          title: '14. Contact',
          content: [
            'Pentru orice întrebări legate de prelucrarea datelor personale sau pentru a exercita drepturile GDPR, ne puteți contacta:',
            '',
            '<strong>Email:</strong> ' + siteConfig.contact.email,
            '<strong>Telefon:</strong> ' + siteConfig.contact.phone,
            '<strong>Adresă:</strong> ' + siteConfig.company.registeredOffice.ro,
            '',
            'Vom răspunde solicitărilor dumneavoastră în termen de maximum 30 de zile.'
          ]
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'Personal data protection (GDPR)',
      lastUpdate: 'Last updated: November 2024',

      sections: [
        {
          icon: Shield,
          title: '1. Introduction',
          content: [
            `${siteConfig.company.legalName} (Tax ID: ${siteConfig.company.cui}) respects user privacy and is committed to protecting personal data in accordance with the General Data Protection Regulation (GDPR - EU Regulation 2016/679) and applicable Romanian legislation.`,
            'This Privacy Policy explains what data we collect, why we collect it, how we use it, and what your rights are.'
          ]
        },
        {
          icon: Database,
          title: '2. Data Controller',
          content: [
            '<strong>Data Controller:</strong> ' + siteConfig.company.legalName,
            '<strong>Tax ID:</strong> ' + siteConfig.company.cui,
            '<strong>Registered office:</strong> ' + siteConfig.company.registeredOffice.en,
            '<strong>Contact email:</strong> ' + siteConfig.contact.email,
            '<strong>Phone:</strong> ' + siteConfig.contact.phone,
            '',
            'For any questions related to data protection, you can contact us at the email address mentioned above.'
          ]
        },
        {
          icon: Database,
          title: '3. What Data We Collect',
          content: [
            '<strong>3.1 Data provided directly by you:</strong>',
            '• First and last name',
            '• Email address',
            '• Phone number',
            '• Delivery address',
            '• Dietary preferences or allergies (if provided)',
            '',
            '<strong>3.2 Automatically collected data:</strong>',
            '• IP address',
            '• Browser type and version',
            '• Operating system',
            '• Date and time of site access',
            '• Pages visited',
            '• Cookies (see Cookie Policy)',
            '',
            '<strong>3.3 Payment data:</strong>',
            'Bank card data is processed directly by certified payment service providers and is not stored on our servers.'
          ]
        },
        {
          icon: Lock,
          title: '4. Legal Basis and Purpose of Processing',
          content: [
            '<strong>4.1 Contract execution</strong>',
            'We process your data to process and deliver orders, contact you regarding orders, and issue invoices.',
            '',
            '<strong>4.2 Consent</strong>',
            'With your explicit consent, we send you newsletters with offers, promotions, and news. You can withdraw consent at any time.',
            '',
            '<strong>4.3 Legal obligations</strong>',
            'We retain data necessary to comply with tax and accounting obligations (e.g., invoices) according to current legislation.',
            '',
            '<strong>4.4 Legitimate interest</strong>',
            'We analyze user behavior on the site to improve our experience and services.'
          ]
        },
        {
          icon: Eye,
          title: '5. How We Use Data',
          content: [
            '• Processing and completing orders',
            '• Delivering ordered products',
            '• Communication regarding orders (confirmations, statuses)',
            '• Issuing fiscal invoices',
            '• Responding to questions and requests',
            '• Sending offers and promotions (with consent)',
            '• Improving our website and services',
            '• Preventing fraud and ensuring security',
            '• Complying with legal obligations (tax, accounting)'
          ]
        },
        {
          icon: UserCheck,
          title: '6. Sharing Data with Third Parties',
          content: [
            'We do not sell or rent your personal data. We share data only with trusted partners, strictly necessary to provide services:',
            '',
            '<strong>6.1 Delivery service providers</strong>',
            'We share name, address, and phone number with the courier company for order delivery.',
            '',
            '<strong>6.2 Payment processors</strong>',
            'Payment data is transmitted directly to certified payment service providers (e.g., PCI-DSS compliant processors).',
            '',
            '<strong>6.3 Hosting services</strong>',
            'Our website is hosted on secure servers that comply with data protection standards.',
            '',
            '<strong>6.4 Public authorities</strong>',
            'We may disclose data at the request of competent authorities, in accordance with current legislation.'
          ]
        },
        {
          icon: Lock,
          title: '7. Data Security',
          content: [
            'We implement appropriate technical and organizational measures to protect your data against unauthorized access, modification, disclosure, or destruction:',
            '',
            '• SSL/TLS encryption for data transmission',
            '• Secure servers with restricted access',
            '• Encrypted passwords',
            '• Continuous system monitoring',
            '• Regular backups',
            '• Strict employee data access policies',
            '',
            'However, no method of electronic transmission or storage is 100% secure.'
          ]
        },
        {
          icon: Database,
          title: '8. Data Retention Period',
          content: [
            '<strong>8.1 Order data:</strong>',
            'Data related to orders (invoices, purchase history) is retained according to legal tax and accounting obligations - minimum 10 years from the date of issue.',
            '',
            '<strong>8.2 Marketing data:</strong>',
            'If you subscribed to the newsletter, we retain data until consent withdrawal or account deletion.',
            '',
            '<strong>8.3 Cookies and browsing data:</strong>',
            'See Cookie Policy for details on cookie storage duration.',
            '',
            '<strong>8.4 Data deletion:</strong>',
            'After the mentioned terms expire, data is deleted or anonymized.'
          ]
        },
        {
          icon: UserCheck,
          title: '9. Your Rights (GDPR)',
          content: [
            'According to GDPR, you have the following rights:',
            '',
            '<strong>9.1 Right of access</strong>',
            'You can request a copy of the personal data we hold about you.',
            '',
            '<strong>9.2 Right to rectification</strong>',
            'You can request correction of inaccurate or incomplete data.',
            '',
            '<strong>9.3 Right to erasure ("right to be forgotten")</strong>',
            'You can request data deletion, except in cases where we have legal retention obligations.',
            '',
            '<strong>9.4 Right to restriction of processing</strong>',
            'You can request limitation of how we use your data.',
            '',
            '<strong>9.5 Right to data portability</strong>',
            'You can request transfer of data to another controller in a structured format.',
            '',
            '<strong>9.6 Right to object</strong>',
            'You can refuse data processing for direct marketing or based on legitimate interest.',
            '',
            '<strong>9.7 Right to withdraw consent</strong>',
            'If processing is based on consent, you can withdraw it at any time.',
            '',
            '<strong>9.8 Right to lodge a complaint</strong>',
            'You can file a complaint with the National Supervisory Authority for Personal Data Processing (ANSPDCP): <a href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.dataprotection.ro</a>',
            '',
            'To exercise any of these rights, contact us at: ' + siteConfig.contact.email
          ]
        },
        {
          icon: Cookie,
          title: '10. Cookies',
          content: [
            'Our website uses cookies to improve user experience and analyze traffic.',
            'For detailed information about what cookies we use and how you can manage them, consult the Cookie Policy.',
            '',
            'By continuing to browse the site, you accept the use of cookies according to our policy.'
          ]
        },
        {
          icon: Mail,
          title: '11. Marketing and Newsletter',
          content: [
            'If you subscribe to our newsletter, we will use your email address to send you:',
            '• Special offers and promotions',
            '• Product news',
            '• Event information',
            '',
            'You can unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us at ' + siteConfig.contact.email + '.',
            '',
            'We do not send spam and do not share your email address with third parties for marketing purposes.'
          ]
        },
        {
          icon: Shield,
          title: '12. Minors',
          content: [
            'Our website is not directed at children under 16 years of age.',
            'We do not knowingly collect personal data from children under this age.',
            'If we discover that we have collected data from a minor without parental/guardian consent, we will delete this information immediately.'
          ]
        },
        {
          icon: Database,
          title: '13. Changes to Privacy Policy',
          content: [
            'We reserve the right to periodically update this Privacy Policy to reflect changes in our practices or legislation.',
            'Changes will be posted on this page, and the last update date will be modified accordingly.',
            'We recommend that you periodically review this policy to stay informed.'
          ]
        },
        {
          icon: Mail,
          title: '14. Contact',
          content: [
            'For any questions related to personal data processing or to exercise GDPR rights, you can contact us:',
            '',
            '<strong>Email:</strong> ' + siteConfig.contact.email,
            '<strong>Phone:</strong> ' + siteConfig.contact.phone,
            '<strong>Address:</strong> ' + siteConfig.company.registeredOffice.en,
            '',
            'We will respond to your requests within a maximum of 30 days.'
          ]
        }
      ]
    }
  };

  const currentContent = isRomanian ? content.ro : content.en;

  return (
    <>
      <MetaTags
        title={isRomanian ? 'Politica de Confidentialitate' : 'Privacy Policy'}
        description={isRomanian
          ? 'Politica de confidentialitate si protectia datelor personale pentru Odette Confiserie.'
          : 'Privacy policy and personal data protection for Odette Confiserie.'}
        url={`${seoConfig.siteUrl}/privacy-policy`}
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
                ? 'Pentru exercitarea drepturilor GDPR sau orice întrebări legate de protecția datelor:'
                : 'To exercise GDPR rights or for any data protection questions:'}
            </p>
            <p className="mt-4">
              <a href={`mailto:${siteConfig.contact.email}`} className="text-blue-600 hover:underline font-semibold text-xl">
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PrivacyPolicyPage;
