import React from 'react';
import HeroSection from '../home/HeroSection';
import ChristmasHero from '../home/ChristmasHero';
import AboutStory from '../home/AboutStory';
import BestSellers from '../home/BestSellers';
import FAQ from '../home/FAQ';
import FindUs from '../home/FindUs';
import { useChristmasSeason } from '../../lib/christmasBanner';

// Head tags for this page are in its route module (src/routes/home.jsx).
// While Christmas orders are open the page opens with the Christmas banner.
const HomePage = ({ language, setSelectedProduct }) => {
  const showChristmas = useChristmasSeason();

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
