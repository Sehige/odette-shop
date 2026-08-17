import React from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../../data/translations';

/**
 * CakeOrderSteps
 *
 * "Cum comand un tort?" — how-to-order steps shown in the Cakes category on the
 * Shop page (between the photo carousel and the products). Content comes from
 * translations (shop.orderSteps); card style mirrors the FAQ / AboutStory cream
 * cards on the light-blue panel. The last step links to the Contact page.
 *
 * @param {string} language - 'ro' | 'en'
 */
const CakeOrderSteps = ({ language }) => {
  const shopT = (translations[language] || translations.ro).shop;
  const steps = shopT.orderSteps || [];

  if (!steps.length) return null;

  const cardClass = 'bg-[#f7f4ec] rounded-lg shadow-sm p-6 text-center h-full flex flex-col';

  return (
    <section className="mb-8 sm:mb-12">
      <div className="bg-[#dce6f5] rounded-2xl p-6 sm:p-10">
        <h2 className="text-center font-serif font-bold text-[#1e3a8a] text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-8">
          {shopT.orderTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((s) => (
            <div key={s.step} className={cardClass}>
              <h3 className="font-serif font-bold text-[#1e3a8a] text-xl mb-1">
                {s.step}
              </h3>
              <p className="text-[#1e3a8a] font-medium mb-3">{s.title}</p>
              {s.text && (
                <p className="text-[#1e3a8a]/90 text-sm leading-relaxed">
                  {s.text}
                </p>
              )}
              {s.link && (
                <Link
                  to={s.link}
                  className="mt-4 sm:mt-auto self-center bg-[#1e3a8a] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#1e40af] transition transform hover:scale-105 shadow-md"
                >
                  {shopT.orderCta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {shopT.decorNote && (
          <p className="text-center font-semibold text-[#1e3a8a] text-sm sm:text-base mt-6 sm:mt-8">
            {shopT.decorNote}
          </p>
        )}
      </div>
    </section>
  );
};

export default CakeOrderSteps;
