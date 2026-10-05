import React from 'react';
import { Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
import LocationCard from '../location/LocationCard';

// "Unde ne găsești": the shop's card near the end of the homepage
const FindUs = ({ language }) => {
  const t = translations[language].location;
  return (
    <section aria-labelledby="unde-ne-gasesti" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="unde-ne-gasesti" className="text-center font-serif font-bold text-[#1e3a8a] text-3xl md:text-4xl lg:text-5xl mb-10">
          {t.title}
        </h2>
        <LocationCard language={language} headingLevel="h3" />
        <p className="mt-8 text-center">
          <a
            href={siteConfig.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-blue-900 hover:underline"
          >
            <Instagram className="w-5 h-5" aria-hidden="true" />
            {t.followInstagram} →
          </a>
        </p>
      </div>
    </section>
  );
};

export default FindUs;
