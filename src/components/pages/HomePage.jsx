import React from 'react';
import HeroSection from '../home/HeroSection';
import BestSellers from '../home/BestSellers';
import FeaturedCategories from '../home/FeaturedCategories';

const HomePage = ({ language, addToCart, setSelectedProduct }) => {
  return (
    <>
      <HeroSection language={language} />
      <BestSellers
        language={language}
        addToCart={addToCart}
        setSelectedProduct={setSelectedProduct}
      />
      <FeaturedCategories language={language} />
    </>
  );
};

export default HomePage;
