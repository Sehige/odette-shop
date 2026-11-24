import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../data/translations';
import { christmas } from '../../data/christmas';
import { festiveColors } from '../common/ChristmasButton';
import home768 from '../../assets/christmas/home-768.webp';
import home1152 from '../../assets/christmas/home-1152.webp';
import home1536 from '../../assets/christmas/home-1536.webp';

/**
 * The homepage's opening section while Christmas orders are open (see HomePage): a festive
 * table photo with "Comandă acum" leading to /craciun. On large screens the photo fills the
 * section and a navy shade on the left keeps the text readable; on phones the whole photo
 * sits on top, with the text underneath.
 */
const ChristmasHero = ({ language }) => {
  const t = translations[language] || translations.ro;
  const en = language === 'en';

  return (
    <section className="relative bg-[#1e3a8a] pt-20 lg:pt-0 lg:min-h-screen lg:flex lg:items-center overflow-hidden">
      <img
        src={home1152}
        srcSet={`${home768} 768w, ${home1152} 1152w, ${home1536} 1536w`}
        sizes="100vw"
        width={1536}
        height={1024}
        alt={en
          ? 'Festive table with a madeleine tower, macarons, Dobos cake and linzer cookies, next to a decorated Christmas tree'
          : 'Masă de sărbătoare cu turn de madeleine, macarons, Doboș și linzer, lângă bradul de Crăciun împodobit'}
        fetchPriority="high"
        decoding="async"
        className="block w-full aspect-[3/2] object-cover lg:absolute lg:inset-0 lg:h-full lg:aspect-auto lg:object-[center_75%]"
      />
      {/* navy shade behind the text only (its first ~600px), fading out by 900px so the table keeps its colours */}
      <div aria-hidden="true" className="hidden lg:block absolute inset-0 bg-[linear-gradient(to_right,rgba(30,58,138,0.92)_0px,rgba(30,58,138,0.78)_560px,rgba(30,58,138,0)_900px)]" />

      {/* below the fixed header on large screens */}
      <div className="relative w-full max-w-7xl lg:max-w-none mx-auto px-6 sm:px-8 lg:px-20 xl:px-24 py-10 lg:pt-[124px] lg:pb-0">
        <div className="max-w-xl lg:max-w-[500px] mx-auto lg:mx-0 text-center lg:text-left text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.25)]">
          <p className="uppercase tracking-[0.2em] text-sm font-semibold text-[#d4af37]">
            {en ? `Christmas & New Year ${christmas.year}` : `Crăciun și Revelion ${christmas.year}`}
          </p>
          <h1 className="mt-4 font-serif font-medium leading-tight text-[32px] sm:text-[43px] lg:text-[54px]">
            {en ? 'Order our Christmas collection now!' : 'Comandă acum colecția de Crăciun!'}
          </h1>
          <p className="mt-5 text-lg text-white/90 leading-relaxed">
            {en
              ? `Babka, gift boxes and festive pastries, made in our lab in Cluj-Napoca. Orders until ${christmas.orderByEn}.`
              : `Cozonac babka, cutii cadou și prăjituri de sărbători, făcute în laboratorul nostru din Cluj-Napoca. Comenzi până pe ${christmas.orderBy}.`}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center lg:justify-start">
            <Link
              to="/craciun"
              className={`inline-block ${festiveColors} px-10 py-4 rounded-full text-base font-semibold tracking-wide uppercase transition transform hover:scale-105 shadow-xl`}
            >
              {t.landing.orderNow}
            </Link>
            <Link to="/shop" className="text-white/90 font-medium underline underline-offset-4 hover:text-white">
              {en ? 'All products' : 'Toate produsele'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChristmasHero;
