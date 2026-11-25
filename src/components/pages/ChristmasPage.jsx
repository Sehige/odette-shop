import React, { useState } from 'react';
import { ChevronDown, Gift, MapPin, MessageSquare, Phone, Truck, Wallet } from 'lucide-react';
import { christmas, tr } from '../../data/christmas';
import { siteConfig } from '../../data/siteConfig';
import { WhatsAppIcon, whatsappHref } from '../common/WhatsAppButton';
import { festiveColors } from '../common/ChristmasButton';

const NAVY = '#1e3a8a';
const GOLD = '#d4af37';

// Photos: src/assets/christmas/<name>-<width>.webp (cut from the owner's catalogue)
const photos = import.meta.glob('../../assets/christmas/*.webp', { eager: true, import: 'default' });
const photo = (name, width) => photos[`../../assets/christmas/${name}-${width}.webp`];

const phone = siteConfig.contact.phone;
const phoneInText = phone.replace(/ /g, ' '); // never split across lines
const telHref = `tel:${phone.replace(/\s/g, '')}`;
const smsHref = `sms:${phone.replace(/\s/g, '')}`;

// "23–24 decembrie sau 30–31 decembrie" / "23–24 December or 30–31 December"
const pickupDays = (language, full) =>
  christmas.pickup
    .map((p) => tr(p, 'days', language) + (full ? ` (${tr(p, 'until', language)})` : ''))
    .join(language === 'en' ? ' or ' : ' sau ');

// Delivery by car, with the same fees as the rest of the site, on the pickup days
const { feeCluj, feeOutside, freeThreshold } = siteConfig.delivery;
export const deliveryText = (language) =>
  language === 'en'
    ? `${feeCluj} lei in Cluj-Napoca, ${feeOutside} lei outside the city, free for orders over ${freeThreshold} lei`
    : `${feeCluj} lei în Cluj-Napoca, ${feeOutside} lei în afara orașului, gratuit pentru comenzile de peste ${freeThreshold} lei`;

// The WhatsApp message is typed in for the visitor, naming the product they tapped, in their language
export const orderMessage = (label, language) => {
  const days = christmas.pickup.map((p) => tr(p, 'days', language)).join(', ');
  return language === 'en'
    ? `Hello! I would like to order from the Christmas offer:\n- ${label || ''}\nPickup from the lab or delivery (address): \nDay (${days}): `
    : `Bună ziua! Aș dori să comand din oferta de Crăciun:\n- ${label || ''}\nRidicare din laborator sau livrare (adresa): \nZiua (${days}): `;
};

// "1,08 kg" in Romanian, "1.08 kg" in English
const weightText = (weight, language) => (language === 'en' ? weight.replace(/(\d),(\d)/, '$1.$2') : weight);

const itemLabel = (item, variant, language) => {
  const weight = (variant || item).weight;
  const quantity = language === 'en' ? ', quantity: ' : ', cantitatea: ';
  return `${tr(item, 'name', language)}${variant ? ` – ${tr(variant, 'name', language)}` : ''}${
    weight ? ` (${weightText(weight, language)})` : item.per === '100 g' ? quantity : ''}`;
};

// Keeps a number and its unit on one line ("100 g", "1 kg"): a no-break space between them
const nb = (text) => text.replace(/(\d) (g|kg|ml|buc|lei)\b/g, '$1 $2');

export const priceText = (item, language) => {
  const per = tr(item, 'per', language);
  return `${item.price} lei${per ? ` / ${per}` : ''}`;
};

// gtag only exists as a queue until analytics consent loads GA, so this sends nothing without consent
const trackWhatsApp = () => window.gtag && window.gtag('event', 'whatsapp_click', { source: 'craciun' });

const WhatsAppLink = ({ label, language, className, children }) => (
  <a href={whatsappHref(orderMessage(label, language))} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp} className={className}>
    <WhatsAppIcon className="w-5 h-5 shrink-0" />
    {children}
  </a>
);

const Photo = ({ name, widths, sizes, alt, className }) => (
  <img
    src={photo(name, widths[0])}
    srcSet={widths.map((w) => `${photo(name, w)} ${w}w`).join(', ')}
    sizes={sizes}
    width={widths[0]}
    height={widths[0]}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={`w-full aspect-square object-cover ${className || ''}`}
  />
);

const Contents = ({ items }) => (
  <ul className="mt-2 space-y-1 text-gray-700 text-sm sm:text-base">
    {items.map((line) => (
      <li key={line} className="flex gap-2"><span aria-hidden="true" style={{ color: GOLD }}>•</span>{line}</li>
    ))}
  </ul>
);

// The WhatsApp buttons are Christmas red, like the "Crăciun" buttons
const orderButton = `inline-flex items-center justify-center gap-2 rounded-full ${festiveColors} font-semibold px-5 py-2.5 transition`;
const outlineButton = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#1e3a8a] text-[#1e3a8a] font-semibold px-6 hover:bg-[#f7f4ec] transition';

// Gift boxes: a large card with the contents of the box. A box sold in several sizes gets a
// size menu; the page is built with the first size, and every size's price is in its option.
const BoxCard = ({ item, language }) => {
  const en = language === 'en';
  const [size, setSize] = useState(0);
  const box = item.variants ? item.variants[size] : item;
  const name = tr(item, 'name', language);
  return (
    <article id={item.id} className="scroll-mt-24 lg:scroll-mt-36 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <Photo name={item.image} widths={[600, 1200]} sizes="(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw" alt={name} />
      <div className="p-5 sm:p-7 flex flex-col flex-1">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: NAVY }}>{name}</h3>
        <p className="mt-3 text-gray-600 leading-relaxed">{nb(tr(item, 'description', language))}</p>
        {item.variants && (
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-gray-900">{en ? 'Choose the box' : 'Alege cutia'}</span>
            <span className="relative mt-1.5 block">
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="block w-full appearance-none rounded-xl border border-gray-300 bg-[#f7f4ec] py-3 pl-4 pr-10 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              >
                {item.variants.map((v, i) => (
                  <option key={v.name} value={i}>{`${tr(v, 'name', language)} · ${weightText(v.weight, language)} · ${priceText(v, language)}`}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" aria-hidden="true" />
            </span>
          </label>
        )}
        <p className="mt-4 font-bold text-gray-900">
          {[box.weight && weightText(box.weight, language), box.pieces && `${box.pieces} ${en ? 'pcs' : 'buc'}`].filter(Boolean).join(' · ')}
        </p>
        {box.contents && <Contents items={tr(box, 'contents', language)} />}
        <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-3xl font-bold" style={{ color: NAVY }}>{priceText(box, language)}</p>
          <WhatsAppLink label={itemLabel(item, item.variants && box, language)} language={language} className={orderButton}>
            {en ? 'Order' : 'Comandă'}{item.variants ? ` ${tr(box, 'name', language)}` : ''}
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
};

// Babka, cookies by weight, pantry: a compact card
const ItemCard = ({ item, language }) => (
  <article id={item.id} className="scroll-mt-24 lg:scroll-mt-36 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
    <Photo name={item.image} widths={[400, 800]} sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 50vw" alt={tr(item, 'name', language)} />
    <div className="p-3 sm:p-5 flex flex-col flex-1 text-center">
      <h3 className="font-semibold text-gray-900 text-sm sm:text-lg leading-snug">{tr(item, 'name', language)}</h3>
      {item.weight && <p className="mt-1 text-sm sm:text-base font-bold text-gray-900">{weightText(item.weight, language)}</p>}
      <p className="mt-2 text-lg sm:text-2xl font-bold" style={{ color: NAVY }}>{priceText(item, language)}</p>
      <div className="mt-auto pt-3 flex justify-center text-sm">
        <WhatsAppLink label={itemLabel(item, null, language)} language={language} className="inline-flex items-center gap-1.5 font-semibold text-[#b3121f] hover:underline">
          {language === 'en' ? 'Order' : 'Comandă'}
        </WhatsAppLink>
      </div>
    </div>
  </article>
);

// One step of "Cum comanzi", in its own box
const Step = ({ icon: Icon, title, children }) => (
  <li className="bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col">
    <span className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
      <Icon className="text-white" size={22} aria-hidden="true" />
    </span>
    <h3 className="mt-4 font-semibold text-lg text-gray-900">{title}</h3>
    <div className="mt-2 text-gray-700 leading-relaxed">{children}</div>
  </li>
);

const FAQ = {
  ro: [
    {
      q: 'Până când pot comanda?',
      a: `Până pe ${christmas.orderBy}.`,
    },
    {
      q: 'Cum comand?',
      a: `Ne scrii pe WhatsApp, prin SMS sau ne suni la ${phoneInText}: ne spui ce produse vrei, ce cantitate și când dorești comanda. Plătești avansul și îți confirmăm comanda.`,
    },
    {
      q: 'Ridic comanda din laborator sau mi-o livrați?',
      a: `Cum preferi. O poți ridica din laboratorul nostru de pe Strada Câmpului 133, Cluj-Napoca, sau ți-o livrăm cu mașina: ${deliveryText('ro')}. Ca produsele să ajungă proaspete pe masa de sărbătoare, comenzile se ridică și se livrează doar pe ${pickupDays('ro', true)}.`,
    },
    {
      q: 'Oferta este valabilă și pentru Revelion?',
      a: `Da. Toate produsele de pe această pagină se pot comanda și pentru Revelion, cu ridicare sau livrare pe ${christmas.pickup[1].days}.`,
    },
    {
      q: 'Cum se vând fursecurile și prăjiturile la gramaj?',
      a: 'Le ambalăm individual, în pachete de 100 g, 500 g sau 1 kg din fiecare. Prețul de pe pagină este pentru 100 g.',
    },
  ],
  en: [
    {
      q: 'Until when can I order?',
      a: `Until ${christmas.orderByEn}.`,
    },
    {
      q: 'How do I order?',
      a: `Message us on WhatsApp, send us a text or call us at ${phoneInText}: tell us which products you want, how much of each and when you need your order. You pay the advance and we confirm your order.`,
    },
    {
      q: 'Do I pick up my order from the lab, or do you deliver it?',
      a: `As you prefer. You can pick it up from our lab at Strada Câmpului 133, Cluj-Napoca, or we deliver it by car: ${deliveryText('en')}. So that everything reaches your holiday table fresh, orders are picked up and delivered only on ${pickupDays('en', true)}.`,
    },
    {
      q: 'Is the offer also valid for New Year’s Eve?',
      a: `Yes. Everything on this page can also be ordered for New Year’s Eve, with pickup or delivery on ${christmas.pickup[1].daysEn}.`,
    },
    {
      q: 'How are the cookies and cakes by weight sold?',
      a: 'We pack them individually, in packs of 100 g, 500 g or 1 kg of each. The price on the page is per 100 g.',
    },
  ],
};

/**
 * /craciun: the Christmas and New Year offer (content in src/data/christmas.js), in Romanian
 * or English. Orders go by WhatsApp, SMS or phone; every product card opens WhatsApp with the
 * product already named in the message.
 */
const ChristmasPage = ({ language }) => {
  const en = language === 'en';
  return (
    <div className="bg-white">
      {/* starts below the fixed header (taller on large screens) */}
      <section className="pt-28 pb-14 lg:pt-44 lg:pb-20" style={{ backgroundColor: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left text-white">
            <p className="uppercase tracking-[0.2em] text-sm font-semibold" style={{ color: GOLD }}>
              {en ? `Christmas & New Year ${christmas.year}` : `Crăciun și Revelion ${christmas.year}`}
            </p>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mt-4">
              {en ? 'Christmas cakes, babka and gift boxes' : 'Prăjituri de Crăciun, cozonac babka și cutii cadou'}
            </h1>
            <p className="mt-6 text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {en
                ? `Everything is made in our lab in Cluj-Napoca. Orders until ${christmas.orderByEn}, with pickup from the lab or delivery on ${pickupDays(language)}.`
                : `Totul e făcut în laboratorul nostru din Cluj-Napoca. Comenzi până pe ${christmas.orderBy}, cu ridicare din laborator sau livrare pe ${pickupDays(language)}.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <WhatsAppLink language={language} className={`inline-flex items-center gap-2 rounded-full ${festiveColors} font-semibold px-7 py-3.5 uppercase tracking-wide text-sm transition`}>
                {en ? 'Order on WhatsApp' : 'Comandă pe WhatsApp'}
              </WhatsAppLink>
              <a href="#oferta" className="inline-flex items-center rounded-full border border-white/70 text-white font-semibold px-7 py-3.5 uppercase tracking-wide text-sm hover:bg-white/10 transition">
                {en ? 'See the offer' : 'Vezi oferta'}
              </a>
            </div>
          </div>
          <img
            src={photo('cover', 800)}
            srcSet={`${photo('cover', 800)} 800w, ${photo('cover', 1600)} 1600w`}
            sizes="(min-width: 1024px) 560px, 100vw"
            width={1600}
            height={1071}
            alt={en
              ? 'Box of macarons, homemade chocolate and madeleines, ready for Christmas'
              : 'Cutie cu macarons, ciocolată de casă și madeleine, pregătită de Crăciun'}
            fetchPriority="high"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* How to order */}
      <section className="py-12 md:py-16 bg-[#f7f4ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>{en ? 'How to order' : 'Cum comanzi'}</h2>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Step icon={Gift} title={en ? '1. Choose from the offer' : '1. Alegi din ofertă'}>
              {en
                ? 'Gift boxes, babka, cookies by weight and little treats for the pantry. The prices are below.'
                : 'Cutii cadou, cozonac babka, fursecuri la gramaj și mici bucurii pentru cămară. Prețurile sunt mai jos.'}
            </Step>
            <Step icon={MessageSquare} title={en ? '2. Message or call us' : '2. Ne scrii sau ne suni'}>
              {en ? 'On WhatsApp, by text or by phone, at' : 'Pe WhatsApp, prin SMS sau telefonic, la'}{' '}
              <a href={telHref} className="font-semibold text-gray-900 whitespace-nowrap">{phone}</a>.{' '}
              {en
                ? 'Tell us which products you want, how much of each and when you need your order.'
                : 'Ne spui ce produse vrei, ce cantitate și când dorești comanda.'}
            </Step>
            <Step icon={Wallet} title={en ? '3. Pay the advance' : '3. Plătești avansul'}>
              {en ? 'You pay the advance and we confirm your order.' : 'Plătești avansul și îți confirmăm comanda.'}
            </Step>
            <Step icon={Truck} title={en ? '4. Pickup or delivery' : '4. Ridicare sau livrare'}>
              {en
                ? `Pick up from our lab at Strada Câmpului 133, or we deliver by car, on ${pickupDays(language)} (${christmas.pickupHoursEn}).`
                : `Ridici din laborator, de pe Strada Câmpului 133, sau îți livrăm cu mașina, pe ${pickupDays(language)} (${christmas.pickupHours}).`}
              <span className="block mt-3 text-sm text-gray-600">{en ? 'Delivery' : 'Livrare'}: {nb(deliveryText(language))}.</span>
            </Step>
          </ol>
          <p className="mt-8 rounded-2xl px-6 py-4 text-center text-white text-lg font-semibold" style={{ backgroundColor: NAVY }}>
            {en
              ? `Orders are taken until ${christmas.orderByEn}. The offer is also valid for New Year’s Eve.`
              : `Comenzile se primesc până pe ${christmas.orderBy}. Oferta e valabilă și pentru Revelion.`}
          </p>
        </div>
      </section>

      {/* The offer */}
      <div id="oferta" className="scroll-mt-20 lg:scroll-mt-32">
        <nav aria-label={en ? 'Offer sections' : 'Secțiuni ofertă'} className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {christmas.sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center justify-center text-center rounded-xl border border-gray-200 bg-white shadow-sm px-3 py-3 font-semibold text-gray-900 hover:border-[#1e3a8a] hover:text-[#1e3a8a] transition"
            >
              {tr(s, 'nav', language)}
            </a>
          ))}
        </nav>
        {christmas.sections.map((section, i) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titlu`} className={`scroll-mt-20 lg:scroll-mt-32 py-12 md:py-16 ${i % 2 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 id={`${section.id}-titlu`} className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>{tr(section, 'title', language)}</h2>
              <p className="mt-4 max-w-3xl mx-auto text-center text-gray-600 text-lg leading-relaxed">{nb(tr(section, 'intro', language))}</p>
              {section.layout === 'large' ? (
                <div className="mt-10 grid md:grid-cols-2 gap-6 lg:gap-8">
                  {section.items.map((item) => <BoxCard key={item.id} item={item} language={language} />)}
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {section.items.map((item) => <ItemCard key={item.id} item={item} language={language} />)}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Questions */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>
            {en ? 'Questions about holiday orders' : 'Întrebări despre comenzile de sărbători'}
          </h2>
          {/* Closed until tapped; the answers are still in the page for search engines */}
          <div className="mt-8 space-y-3">
            {FAQ[en ? 'en' : 'ro'].map(({ q, a }) => (
              <details key={q} className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-lg text-gray-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="w-5 h-5 shrink-0 text-gray-500 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-5 pb-5 text-gray-700 leading-relaxed">{nb(a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="py-14 md:py-20 bg-[#f7f4ec]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="rounded-2xl bg-white shadow-lg px-5 py-8 sm:p-10 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: NAVY }}>{en ? 'Order early' : 'Comandă din timp'}</h2>
            <p className="mt-3 text-gray-700 text-lg">
              {en ? 'Orders are taken until' : 'Comenzile se primesc până pe'}{' '}
              <strong className="whitespace-nowrap">{en ? christmas.orderByEn : christmas.orderBy}</strong>.
            </p>
            {/* stacked on phones, in a row from tablets up */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppLink language={language} className={`${orderButton} py-3.5`}>{en ? 'Order on WhatsApp' : 'Comandă pe WhatsApp'}</WhatsAppLink>
              <a href={smsHref} className={`${outlineButton} py-3.5`}>
                <MessageSquare className="w-5 h-5" aria-hidden="true" /> SMS
              </a>
              <a href={telHref} className={`${outlineButton} py-3.5`}>
                <Phone className="w-5 h-5" aria-hidden="true" /> {phone}
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              <MapPin className="inline w-4 h-4 -mt-0.5 mr-1" aria-hidden="true" />
              {en ? 'Pickup from' : 'Ridicare din'} Strada Câmpului 133, <span className="whitespace-nowrap">Cluj-Napoca</span>
              <span className="block">{en ? 'or delivery by car' : 'sau livrare cu mașina'}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChristmasPage;
