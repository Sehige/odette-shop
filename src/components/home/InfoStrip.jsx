import React from 'react';
import { Clock, MapPin, Truck } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import OpenStatus from '../location/OpenStatus';

const GOLD = '#d4af37';

// Just below the hero: open now?, free delivery threshold, delivery fee in Cluj
const InfoStrip = ({ language }) => {
  const t = translations[language].infoStrip;
  const { freeThreshold, feeCluj } = siteConfig.delivery;
  const item = 'flex items-center gap-3';
  return (
    <section aria-label={t.label} className="bg-white border-b border-gray-200">
      <ul className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid gap-3 sm:grid-cols-3 text-gray-800">
        <li className={item}>
          <Clock className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} aria-hidden="true" />
          <OpenStatus language={language} className="font-semibold" />
        </li>
        <li className={item}>
          <Truck className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} aria-hidden="true" />
          {t.freeDelivery(freeThreshold)}
        </li>
        <li className={item}>
          <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} aria-hidden="true" />
          {t.delivery(feeCluj)}
        </li>
      </ul>
    </section>
  );
};

export default InfoStrip;
