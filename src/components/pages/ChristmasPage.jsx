import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Gift, MapPin, MessageSquare, Phone, Truck, Wallet } from 'lucide-react';
import { christmas } from '../../data/christmas';
import { siteConfig } from '../../data/siteConfig';
import { WhatsAppIcon, whatsappHref } from '../common/WhatsAppButton';

const NAVY = '#1e3a8a';
const GOLD = '#d4af37';

// Photos: src/assets/christmas/<name>-<width>.webp (cut from the owner's catalogue)
const photos = import.meta.glob('../../assets/christmas/*.webp', { eager: true, import: 'default' });
const photo = (name, width) => photos[`../../assets/christmas/${name}-${width}.webp`];

const phone = siteConfig.contact.phone;
const phoneInText = phone.replace(/ /g, '\u00a0'); // never split across lines
const telHref = `tel:${phone.replace(/\s/g, '')}`;
const smsHref = `sms:${phone.replace(/\s/g, '')}`;
const pickupDays = christmas.pickup.map((p) => p.days).join(' sau ');
const pickupDaysFull = christmas.pickup.map((p) => `${p.days} (${p.until})`).join(' sau ');

// Delivery by car, with the same fees as the rest of the site, on the pickup days
const { feeCluj, feeOutside, freeThreshold } = siteConfig.delivery;
export const deliveryText = `${feeCluj} lei în Cluj-Napoca, ${feeOutside} lei în afara orașului, gratuit pentru comenzile de peste ${freeThreshold} lei`;

// The WhatsApp message is typed in for the visitor, naming the product they tapped
export const orderMessage = (label) =>
  `Bună ziua! Aș dori să comand din oferta de Crăciun:\n- ${label || ''}\nRidicare din laborator sau livrare (adresa): \nZiua (${christmas.pickup.map((p) => p.days).join(', ')}): `;

const itemLabel = (item, variant) => {
  const weight = (variant || item).weight;
  return `${item.name}${variant ? ` – ${variant.name}` : ''}${weight ? ` (${weight})` : item.per === '100 g' ? ', cantitatea: ' : ''}`;
};

// Keeps a number and its unit on one line ("100 g", "1 kg"): a no-break space between them
const nb = (text) => text.replace(/(\d) (g|kg|ml|buc|lei)\b/g, '$1\u00a0$2');

export const priceText = ({ price, per }) => `${price} lei${per ? ` / ${per}` : ''}`;

// gtag only exists as a queue until analytics consent loads GA, so this sends nothing without consent
const trackWhatsApp = () => window.gtag && window.gtag('event', 'whatsapp_click', { source: 'craciun' });

const WhatsAppLink = ({ label, className, children }) => (
  <a href={whatsappHref(orderMessage(label))} target="_blank" rel="noopener noreferrer" onClick={trackWhatsApp} className={className}>
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

const orderButton = 'inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white font-semibold px-5 py-2.5 hover:brightness-95 transition';

// Gift boxes: a large card with the contents of the box. A box sold in several sizes gets a
// size menu; the page is built with the first size, and every size's price is in its option.
const BoxCard = ({ item }) => {
  const [size, setSize] = useState(0);
  const box = item.variants ? item.variants[size] : item;
  return (
    <article id={item.id} className="scroll-mt-24 lg:scroll-mt-36 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
      <Photo name={item.image} widths={[600, 1200]} sizes="(min-width: 1152px) 560px, (min-width: 768px) 50vw, 100vw" alt={item.name} />
      <div className="p-5 sm:p-7 flex flex-col flex-1">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold" style={{ color: NAVY }}>{item.name}</h3>
        <p className="mt-3 text-gray-600 leading-relaxed">{nb(item.description)}</p>
        {item.variants && (
          <label className="mt-5 block">
            <span className="text-sm font-semibold text-gray-900">Alege cutia</span>
            <span className="relative mt-1.5 block">
              <select
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="block w-full appearance-none rounded-xl border border-gray-300 bg-[#f7f4ec] py-3 pl-4 pr-10 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              >
                {item.variants.map((v, i) => (
                  <option key={v.name} value={i}>{`${v.name} · ${v.weight} · ${priceText(v)}`}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" aria-hidden="true" />
            </span>
          </label>
        )}
        <p className="mt-4 text-sm text-gray-600">{[box.weight, box.pieces && `${box.pieces} buc`].filter(Boolean).join(' · ')}</p>
        {box.contents && <Contents items={box.contents} />}
        <div className="mt-auto pt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-3xl font-bold" style={{ color: NAVY }}>{priceText(box)}</p>
          <WhatsAppLink label={itemLabel(item, item.variants && box)} className={orderButton}>
            {item.variants ? `Comandă ${box.name}` : 'Comandă'}
          </WhatsAppLink>
        </div>
      </div>
    </article>
  );
};

// Babka, cookies by weight, pantry: a compact card
const ItemCard = ({ item }) => (
  <article id={item.id} className="scroll-mt-24 lg:scroll-mt-36 bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
    <Photo name={item.image} widths={[400, 800]} sizes="(min-width: 1152px) 360px, (min-width: 768px) 33vw, 50vw" alt={item.name} />
    <div className="p-3 sm:p-5 flex flex-col flex-1 text-center">
      <h3 className="font-semibold text-gray-900 text-sm sm:text-lg leading-snug">{item.name}</h3>
      {item.weight && <p className="text-xs sm:text-sm text-gray-600 mt-1">{item.weight}</p>}
      <p className="mt-2 text-lg sm:text-2xl font-bold" style={{ color: NAVY }}>{priceText(item)}</p>
      <div className="mt-auto pt-3 flex flex-col items-center gap-2 text-sm">
        <WhatsAppLink label={itemLabel(item)} className="inline-flex items-center gap-1.5 font-semibold text-[#128C7E] hover:underline">
          Comandă
        </WhatsAppLink>
        {item.product && (
          <Link to={`/produse/${item.product}`} className="text-gray-600 underline hover:text-gray-900">Detalii produs</Link>
        )}
      </div>
    </div>
  </article>
);

const Step = ({ icon: Icon, title, children }) => (
  <li className="flex gap-4">
    <span className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: GOLD }}>
      <Icon className="text-white" size={22} aria-hidden="true" />
    </span>
    <div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <div className="text-gray-700 mt-1 leading-relaxed">{children}</div>
    </div>
  </li>
);

const FAQ = [
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
    a: `Cum preferi. O poți ridica din laboratorul nostru de pe Strada Câmpului 133, Cluj-Napoca, sau ți-o livrăm cu mașina: ${deliveryText}. Ca produsele să ajungă proaspete pe masa de sărbătoare, comenzile se ridică și se livrează doar pe ${pickupDaysFull}.`,
  },
  {
    q: 'Oferta este valabilă și pentru Revelion?',
    a: `Da. Toate produsele de pe această pagină se pot comanda și pentru Revelion, cu ridicare sau livrare pe ${christmas.pickup[1].days}.`,
  },
  {
    q: 'Cum se vând fursecurile și prăjiturile la gramaj?',
    a: 'Le ambalăm individual, în pachete de 100 g, 500 g sau 1 kg din fiecare. Prețul de pe pagină este pentru 100 g.',
  },
];

/**
 * /craciun: the Christmas and New Year offer (content in src/data/christmas.js).
 * Orders go by WhatsApp, SMS or phone; every product card opens WhatsApp with the
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
                ? `Everything is made in our lab in Cluj-Napoca. Order by ${christmas.orderByEn}; pick up or have it delivered on 23–24 or 30–31 December.`
                : `Totul e făcut în laboratorul nostru din Cluj-Napoca. Comenzi până pe ${christmas.orderBy}, cu ridicare din laborator sau livrare pe ${pickupDays}.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <WhatsAppLink className="inline-flex items-center gap-2 rounded-full bg-[#f7f4ec] text-[#1e3a8a] font-semibold px-7 py-3.5 uppercase tracking-wide text-sm hover:opacity-90 transition">
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
            alt="Cutie cu macarons, ciocolată de casă și madeleine, pregătită de Crăciun"
            fetchPriority="high"
            className="w-full rounded-2xl shadow-2xl"
          />
        </div>
      </section>

      {/* How to order */}
      <section className="py-12 md:py-16 bg-[#f7f4ec]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {en && (
            <p className="mb-8 rounded-xl bg-white p-4 text-gray-700">
              Christmas and New Year offer: order by {christmas.orderByEn} by WhatsApp, SMS or phone at {phone}, pay the advance and we
              confirm your order. Pick up at Strada Câmpului 133, Cluj-Napoca, or have it delivered by car, on{' '}
              {christmas.pickup.map((p) => p.en).join(' or ')}. Prices are in lei; the product details below are in Romanian.
            </p>
          )}
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>Cum comanzi</h2>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Step icon={Gift} title="1. Alegi din ofertă">
              Cutii cadou, cozonac babka, fursecuri la gramaj și mici bucurii pentru cămară. Prețurile sunt mai jos.
            </Step>
            <Step icon={MessageSquare} title="2. Ne scrii sau ne suni">
              Pe <WhatsAppLink className="inline-flex items-center gap-1 font-semibold text-[#128C7E] underline">WhatsApp</WhatsAppLink>,
              prin <a href={smsHref} className="font-semibold underline">SMS</a> sau la <a href={telHref} className="font-semibold underline whitespace-nowrap">{phone}</a>:
              ne spui ce produse vrei, ce cantitate și când dorești comanda.
            </Step>
            <Step icon={Wallet} title="3. Plătești avansul">
              Plătești avansul și îți confirmăm comanda.
            </Step>
            <Step icon={Truck} title="4. Ridicare sau livrare">
              Ridici din laborator, de pe{' '}
              <a href={siteConfig.maps.placeUrl} target="_blank" rel="noopener noreferrer" className="underline">Strada Câmpului 133</a>,
              sau îți livrăm cu mașina, pe {pickupDays} ({christmas.pickupHours}).
              <span className="block mt-2 text-sm text-gray-600">Livrare: {nb(deliveryText)}.</span>
            </Step>
          </ol>
          <p className="mt-10 text-center text-lg font-semibold text-gray-900">
            Comenzile se primesc până pe {christmas.orderBy}. Oferta e valabilă și pentru Revelion.
          </p>
        </div>
      </section>

      {/* The offer */}
      <div id="oferta" className="scroll-mt-20 lg:scroll-mt-32">
        <nav aria-label="Secțiuni ofertă" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {christmas.sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 text-sm sm:text-base font-medium">
              {s.title}
            </a>
          ))}
        </nav>
        {christmas.sections.map((section, i) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-titlu`} className={`scroll-mt-20 lg:scroll-mt-32 py-12 md:py-16 ${i % 2 ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 id={`${section.id}-titlu`} className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>{section.title}</h2>
              <p className="mt-4 max-w-3xl mx-auto text-center text-gray-600 text-lg leading-relaxed">{nb(section.intro)}</p>
              {section.layout === 'large' ? (
                <div className="mt-10 grid md:grid-cols-2 gap-6 lg:gap-8">
                  {section.items.map((item) => <BoxCard key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                  {section.items.map((item) => <ItemCard key={item.id} item={item} />)}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Questions */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center" style={{ color: NAVY }}>Întrebări despre comenzile de sărbători</h2>
          <dl className="mt-8 divide-y divide-gray-200">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="font-semibold text-lg text-gray-900">{q}</dt>
                <dd className="mt-2 text-gray-700 leading-relaxed">{nb(a)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="py-14 md:py-20 text-center bg-[#f7f4ec]">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold" style={{ color: NAVY }}>Comandă din timp</h2>
          <p className="mt-4 text-gray-700 text-lg">
            Comenzile se primesc până pe {christmas.orderBy}. Scrie-ne sau sună-ne ce îți dorești și când vrei comanda, ca să ți-o pregătim proaspătă.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <WhatsAppLink className={`${orderButton} px-7 py-3.5`}>Comandă pe WhatsApp</WhatsAppLink>
            <a href={smsHref} className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-3.5 font-semibold hover:bg-white transition">
              <MessageSquare className="w-5 h-5" aria-hidden="true" /> SMS
            </a>
            <a href={telHref} className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a8a] text-[#1e3a8a] px-6 py-3.5 font-semibold hover:bg-white transition">
              <Phone className="w-5 h-5" aria-hidden="true" /> {phone}
            </a>
          </div>
          <p className="mt-6 text-gray-600 text-sm inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4" aria-hidden="true" /> Ridicare din Strada Câmpului 133, Cluj-Napoca, sau livrare cu mașina
          </p>
        </div>
      </section>
    </div>
  );
};

export default ChristmasPage;
