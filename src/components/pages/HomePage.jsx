import React from 'react';
import HeroSection from '../home/HeroSection';
import AboutStory from '../home/AboutStory';
import BestSellers from '../home/BestSellers';
import FAQ from '../home/FAQ';

// Head tags for this page are in its route module (src/routes/home.jsx)
const HomePage = ({ language, setSelectedProduct }) => (
  <>
    <HeroSection language={language} />
    <AboutStory language={language} />
    <BestSellers
      language={language}
      setSelectedProduct={setSelectedProduct}
    />
    <FAQ language={language} />
  </>
);

export default HomePage;
