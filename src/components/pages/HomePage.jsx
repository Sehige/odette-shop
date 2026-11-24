import React, { useEffect, useState } from 'react';
import HeroSection from '../home/HeroSection';
import ChristmasHero from '../home/ChristmasHero';
import AboutStory from '../home/AboutStory';
import BestSellers from '../home/BestSellers';
import FAQ from '../home/FAQ';
import FindUs from '../home/FindUs';
import { christmasBannerOn } from '../../lib/christmasBanner';

// Head tags for this page are in its route module (src/routes/home.jsx).
// `christmasBanner` says whether the page was built while Christmas orders were open; a
// visitor arriving after the last day to order gets the usual opening section even before
// the next build.
const HomePage = ({ language, setSelectedProduct, christmasBanner = false }) => {
  const [showChristmas, setShowChristmas] = useState(christmasBanner);
  useEffect(() => {
    if (christmasBanner && !christmasBannerOn()) setShowChristmas(false);
  }, [christmasBanner]);

  return (
    <>
      {showChristmas ? <ChristmasHero language={language} /> : <HeroSection language={language} />}
      <AboutStory language={language} />
      <BestSellers
        language={language}
        setSelectedProduct={setSelectedProduct}
      />
      <FAQ language={language} />
      <FindUs language={language} />
    </>
  );
};

export default HomePage;
