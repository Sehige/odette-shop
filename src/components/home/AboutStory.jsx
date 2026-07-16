import React from 'react';
import { translations } from '../../data/translations';
import { ABOUT_STORY_IMAGE } from '../../data/imageConstants';
import AdjustableImage from '../common/AdjustableImage';
import { getScaledImageUrl } from '../../utils/imageOptimizer';

const AboutStory = ({ language }) => {
  const t = translations[language] || translations.ro;

  return (
    <section className="bg-[#dce6f5] py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#f7f4ec] rounded-lg shadow-md p-6 md:p-10 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: photo */}
            {ABOUT_STORY_IMAGE ? (
              <AdjustableImage
                elementKey="about_story"
                src={getScaledImageUrl(ABOUT_STORY_IMAGE, 800, 'auto:good')}
                alt={t.landing.aboutTitle}
                loading="lazy"
                className="rounded-lg shadow-sm aspect-[4/5]"
              />
            ) : (
              <div className="rounded-lg bg-[#dce6f5] aspect-[4/5] flex items-center justify-center text-[#1e3a8a]/40 text-sm">
                {/* Placeholder until ABOUT_STORY_IMAGE is provided */}
              </div>
            )}

            {/* Right: heading + copy */}
            <div>
              <h2 className="font-serif font-bold text-[#1e3a8a] text-3xl md:text-4xl lg:text-5xl leading-tight mb-6">
                {t.landing.aboutTitle}
              </h2>
              <p className="text-[#1e3a8a] text-base md:text-lg leading-relaxed mb-4">
                {t.landing.aboutP1}
              </p>
              <p className="text-[#1e3a8a] text-base md:text-lg leading-relaxed">
                {t.landing.aboutP2}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStory;
