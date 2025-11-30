import React from 'react';
import { FileText, ShoppingCart, CreditCard, Truck, RotateCcw, Shield } from 'lucide-react';
import { siteConfig } from '../../data/siteConfig';

const TermsAndConditionsPage = ({ language }) => {
  const isRomanian = language === 'ro';

  const content = {
    ro: {
      title: 'Termeni și Condiții',
      subtitle: 'Condiții generale de vânzare',
      lastUpdate: 'Ultima actualizare: Noiembrie 2024',

      sections: [
        {
          icon: FileText,
          title: '1. Informații Generale',
          content: [
            `Prezentele Termene și Condiții reglementează relația contractuală dintre ${siteConfig.company.legalName}, CUI ${siteConfig.company.cui}, cu sediul în ${siteConfig.company.registeredOffice.ro} (denumit în continuare "Vânzător") și utilizatorii site-ului (denumiți în continuare "Clienți" sau "Cumpărători").`,
            'Prin plasarea unei comenzi pe site-ul nostru, confirmi că ai citit, înțeles și accepți în totalitate prezentele Termene și Condiții.',
            'Ne rezervăm dreptul de a modifica acești termeni în orice moment, fără notificare prealabilă. Modificările intră în vigoare imediat după publicarea pe site.'
          ]
        },
        {
          icon: ShoppingCart,
          title: '2. Produse și Comenzi',
          content: [
            '<strong>2.1 Descrierea Produselor</strong>',
            'Produsele noastre sunt preparate zilnic din ingrediente proaspete și de calitate premium. Imaginile prezentate pe site au caracter ilustrativ și pot diferi ușor de produsul final.',
            '',
            '<strong>2.2 Disponibilitate</strong>',
            'Produsele sunt disponibile în limita stocului existent. În cazul în care un produs comandat nu mai este disponibil, vă vom contacta pentru a propune alternative sau rambursarea integrală a sumei.',
            '',
            '<strong>2.3 Plasarea Comenzii</strong>',
            'Comenzile pot fi plasate online prin site-ul nostru. Pentru comenzi personalizate sau evenimente speciale, vă rugăm să ne contactați în prealabil.',
            'Confirmarea comenzii se face prin email sau telefon.',
            '',
            '<strong>2.4 Prețuri</strong>',
            'Toate prețurile afișate pe site sunt exprimate în Lei (RON) și includ TVA. Ne rezervăm dreptul de a modifica prețurile fără notificare prealabilă, dar comenzile deja plasate nu vor fi afectate.'
          ]
        },
        {
          icon: CreditCard,
          title: '3. Plata',
          content: [
            '<strong>3.1 Metode de Plată</strong>',
            'Acceptăm următoarele metode de plată:',
            '• Card bancar online (procesare securizată)',
            '• Cash la livrare',
            '• Transfer bancar',
            '',
            '<strong>3.2 Securitate</strong>',
            'Toate tranzacțiile cu cardul sunt procesate prin gateway-uri de plată securizate. Nu stocăm datele cardului dvs.',
            '',
            '<strong>3.3 Facturare</strong>',
            'Factura fiscală va fi emisă și transmisă odată cu livrarea produselor sau prin email, la cerere.'
          ]
        },
        {
          icon: Truck,
          title: '4. Livrare',
          content: [
            '<strong>4.1 Zone de Livrare</strong>',
            'Livrăm în Cluj-Napoca și localitățile din jur. Pentru livrări în alte zone, vă rugăm să ne contactați.',
            '',
            '<strong>4.2 Costuri de Livrare</strong>',
            `Taxa de livrare este de ${siteConfig.delivery.fee} RON. Livrarea este gratuită pentru comenzi peste ${siteConfig.delivery.freeThreshold} RON.`,
            '',
            '<strong>4.3 Termene de Livrare</strong>',
            'Livrările se efectuează în intervalul de timp convenit la plasarea comenzii. Ne străduim să respectăm programul, dar nu putem fi făcuți răspunzători pentru întârzieri cauzate de factori externi (trafic, vreme, etc.).',
            '',
            '<strong>4.4 Ridicare Personală</strong>',
            'Produsele pot fi ridicate direct de la sediul nostru din Cluj-Napoca, în programul de lucru afișat pe site.'
          ]
        },
        {
          icon: RotateCcw,
          title: '5. Drept de Retragere și Returnare',
          content: [
            '<strong>5.1 Dreptul de Retragere (14 zile)</strong>',
            'Conform legislației în vigoare (OUG 34/2014), aveți dreptul de a vă retrage din contract în termen de 14 zile de la primirea produselor, fără a fi necesar să justificați decizia.',
            '',
            '<strong>5.2 Excepții</strong>',
            'Produsele alimentare perisabile (torturi, prăjituri, produse proaspete) NU pot fi returnate din motive de igienă și siguranță alimentară, conform art. 16, lit. e din OUG 34/2014.',
            '',
            '<strong>5.3 Produse Deteriorate sau Neconforme</strong>',
            'Dacă produsele primite sunt deteriorate, neconforme sau defecte, vă rugăm să ne contactați imediat la ' + siteConfig.contact.email + ' sau ' + siteConfig.contact.phone + '.',
            'Vom proceda la înlocuirea produsului sau rambursarea integrală a sumei.',
            '',
            '<strong>5.4 Procedura de Retur</strong>',
            'Pentru a exercita dreptul de retragere (unde este aplicabil), vă rugăm să ne notificați în scris (email) în termenul legal de 14 zile.'
          ]
        },
        {
          icon: Shield,
          title: '6. Garanții și Răspundere',
          content: [
            '<strong>6.1 Garanția Calității</strong>',
            'Garantăm că toate produsele noastre sunt preparate cu ingrediente de calitate, în condiții igienice corespunzătoare și respectând normele HACCP.',
            '',
            '<strong>6.2 Alergeni</strong>',
            'Informațiile despre alergeni sunt disponibile pentru fiecare produs pe site. Vă rugăm să verificați cu atenție aceste informații înainte de a comanda.',
            'Nu ne asumăm răspunderea pentru reacții alergice care nu au fost comunicate în prealabil.',
            '',
            '<strong>6.3 Limitări de Răspundere</strong>',
            'Răspunderea noastră este limitată la valoarea produselor comandate. Nu răspundem pentru daune indirecte sau consecințe rezultate din utilizarea produselor.',
            '',
            '<strong>6.4 Reclamații</strong>',
            'Reclamațiile pot fi transmise la adresa de email ' + siteConfig.contact.email + ' sau prin poștă la adresa sediului social. Vom răspunde în termen de 30 de zile.'
          ]
        },
        {
          icon: FileText,
          title: '7. Protecția Datelor cu Caracter Personal',
          content: [
            'Datele dumneavoastră personale sunt procesate conform Politicii de Confidențialitate și GDPR.',
            'Prin plasarea unei comenzi, consimțiți la prelucrarea datelor necesare pentru finalizarea tranzacției.',
            'Pentru mai multe detalii, consultați Politica de Confidențialitate.'
          ]
        },
        {
          icon: Shield,
          title: '8. Soluționarea Litigiilor',
          content: [
            '<strong>8.1 ANPC - Autoritatea Națională pentru Protecția Consumatorilor</strong>',
            'În cazul unui litigiu, puteți depune o plângere la ANPC: <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.anpc.ro</a>',
            '',
            '<strong>8.2 Soluționarea Alternativă a Litigiilor (SAL)</strong>',
            'Conform Regulamentului UE 524/2013, consumatorii au dreptul de a apela la mecanisme alternative de soluționare a litigiilor.',
            'Platforma Europeană de Soluționare Online a Litigiilor: <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">ec.europa.eu/consumers/odr</a>',
            '',
            '<strong>8.3 Legea Aplicabilă</strong>',
            'Prezentele Termene și Condiții sunt guvernate de legea română. Orice litigiu va fi soluționat de instanțele competente din România.'
          ]
        }
      ],

      footer: {
        title: 'Date de Contact',
        company: siteConfig.company.legalName,
        cui: `CUI: ${siteConfig.company.cui}`,
        address: siteConfig.company.registeredOffice.ro,
        email: siteConfig.contact.email,
        phone: siteConfig.contact.phone
      }
    },
    en: {
      title: 'Terms and Conditions',
      subtitle: 'General terms of sale',
      lastUpdate: 'Last updated: November 2024',

      sections: [
        {
          icon: FileText,
          title: '1. General Information',
          content: [
            `These Terms and Conditions govern the contractual relationship between ${siteConfig.company.legalName}, Tax ID ${siteConfig.company.cui}, with registered office at ${siteConfig.company.registeredOffice.en} (hereinafter "Seller") and the website users (hereinafter "Customers" or "Buyers").`,
            'By placing an order on our website, you confirm that you have read, understood, and fully accept these Terms and Conditions.',
            'We reserve the right to modify these terms at any time without prior notice. Changes take effect immediately upon publication on the website.'
          ]
        },
        {
          icon: ShoppingCart,
          title: '2. Products and Orders',
          content: [
            '<strong>2.1 Product Description</strong>',
            'Our products are prepared daily from fresh, premium quality ingredients. Images displayed on the website are illustrative and may differ slightly from the final product.',
            '',
            '<strong>2.2 Availability</strong>',
            'Products are available subject to stock. If an ordered product is no longer available, we will contact you to propose alternatives or a full refund.',
            '',
            '<strong>2.3 Placing an Order</strong>',
            'Orders can be placed online through our website. For custom orders or special events, please contact us in advance.',
            'Order confirmation is done via email or phone.',
            '',
            '<strong>2.4 Prices</strong>',
            'All prices displayed on the website are expressed in Romanian Leu (RON) and include VAT. We reserve the right to modify prices without prior notice, but already placed orders will not be affected.'
          ]
        },
        {
          icon: CreditCard,
          title: '3. Payment',
          content: [
            '<strong>3.1 Payment Methods</strong>',
            'We accept the following payment methods:',
            '• Online bank card (secure processing)',
            '• Cash on delivery',
            '• Bank transfer',
            '',
            '<strong>3.2 Security</strong>',
            'All card transactions are processed through secure payment gateways. We do not store your card data.',
            '',
            '<strong>3.3 Invoicing</strong>',
            'The fiscal invoice will be issued and transmitted with product delivery or by email upon request.'
          ]
        },
        {
          icon: Truck,
          title: '4. Delivery',
          content: [
            '<strong>4.1 Delivery Areas</strong>',
            'We deliver in Cluj-Napoca and surrounding areas. For deliveries to other areas, please contact us.',
            '',
            '<strong>4.2 Delivery Costs</strong>',
            `Delivery fee is ${siteConfig.delivery.fee} RON. Delivery is free for orders over ${siteConfig.delivery.freeThreshold} RON.`,
            '',
            '<strong>4.3 Delivery Terms</strong>',
            'Deliveries are made during the time interval agreed upon when placing the order. We strive to meet the schedule but cannot be held responsible for delays caused by external factors (traffic, weather, etc.).',
            '',
            '<strong>4.4 Personal Pickup</strong>',
            'Products can be picked up directly from our location in Cluj-Napoca during business hours displayed on the website.'
          ]
        },
        {
          icon: RotateCcw,
          title: '5. Right of Withdrawal and Returns',
          content: [
            '<strong>5.1 Right of Withdrawal (14 days)</strong>',
            'According to current legislation (OUG 34/2014), you have the right to withdraw from the contract within 14 days of receiving the products, without having to justify your decision.',
            '',
            '<strong>5.2 Exceptions</strong>',
            'Perishable food products (cakes, pastries, fresh products) CANNOT be returned for hygiene and food safety reasons, according to art. 16, lit. e of OUG 34/2014.',
            '',
            '<strong>5.3 Damaged or Non-Compliant Products</strong>',
            'If the received products are damaged, non-compliant, or defective, please contact us immediately at ' + siteConfig.contact.email + ' or ' + siteConfig.contact.phone + '.',
            'We will proceed with product replacement or full refund.',
            '',
            '<strong>5.4 Return Procedure</strong>',
            'To exercise the right of withdrawal (where applicable), please notify us in writing (email) within the legal deadline of 14 days.'
          ]
        },
        {
          icon: Shield,
          title: '6. Warranties and Liability',
          content: [
            '<strong>6.1 Quality Guarantee</strong>',
            'We guarantee that all our products are prepared with quality ingredients, under appropriate hygienic conditions and in compliance with HACCP standards.',
            '',
            '<strong>6.2 Allergens</strong>',
            'Allergen information is available for each product on the website. Please carefully check this information before ordering.',
            'We do not assume responsibility for allergic reactions that were not communicated in advance.',
            '',
            '<strong>6.3 Limitation of Liability</strong>',
            'Our liability is limited to the value of ordered products. We are not responsible for indirect damages or consequences resulting from product use.',
            '',
            '<strong>6.4 Complaints</strong>',
            'Complaints can be submitted to the email address ' + siteConfig.contact.email + ' or by mail to the registered office address. We will respond within 30 days.'
          ]
        },
        {
          icon: FileText,
          title: '7. Personal Data Protection',
          content: [
            'Your personal data is processed in accordance with the Privacy Policy and GDPR.',
            'By placing an order, you consent to the processing of data necessary to complete the transaction.',
            'For more details, consult the Privacy Policy.'
          ]
        },
        {
          icon: Shield,
          title: '8. Dispute Resolution',
          content: [
            '<strong>8.1 ANPC - National Authority for Consumer Protection</strong>',
            'In case of a dispute, you can file a complaint with ANPC: <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">www.anpc.ro</a>',
            '',
            '<strong>8.2 Alternative Dispute Resolution (ADR)</strong>',
            'According to EU Regulation 524/2013, consumers have the right to appeal to alternative dispute resolution mechanisms.',
            'European Online Dispute Resolution Platform: <a href="https://consumer-redress.ec.europa.eu/index_ro" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">ec.europa.eu/consumers/odr</a>',
            '',
            '<strong>8.3 Applicable Law</strong>',
            'These Terms and Conditions are governed by Romanian law. Any dispute will be resolved by competent courts in Romania.'
          ]
        }
      ],

      footer: {
        title: 'Contact Information',
        company: siteConfig.company.legalName,
        cui: `Tax ID: ${siteConfig.company.cui}`,
        address: siteConfig.company.registeredOffice.en,
        email: siteConfig.contact.email,
        phone: siteConfig.contact.phone
      }
    }
  };

  const currentContent = isRomanian ? content.ro : content.en;

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

      {/* Company Info Footer */}
      <section className="py-12 bg-gray-100 border-t-2" style={{ borderColor: '#d4af37' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#1e3a8a' }}>
              {currentContent.footer.title}
            </h3>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold text-lg">{currentContent.footer.company}</p>
              <p>{currentContent.footer.cui}</p>
              <p>{currentContent.footer.address}</p>
              <p>Email: <a href={`mailto:${currentContent.footer.email}`} className="text-blue-600 hover:underline">{currentContent.footer.email}</a></p>
              <p>Tel: <a href={`tel:${currentContent.footer.phone}`} className="text-blue-600 hover:underline">{currentContent.footer.phone}</a></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;
