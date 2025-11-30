import React from 'react';
import HeroSection from '../home/HeroSection';
import BestSellers from '../home/BestSellers';
import FeaturedCategories from '../home/FeaturedCategories';

const HomePage = ({ language, setSelectedProduct }) => {
  return (
    <>
      <HeroSection language={language} />
      <BestSellers
        language={language}
        setSelectedProduct={setSelectedProduct}
      />
      <FeaturedCategories language={language} />
    </>
  );
};

export default HomePage;
