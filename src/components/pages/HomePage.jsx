import React from 'react';
import HeroSection from '../home/HeroSection';
import AboutStory from '../home/AboutStory';
import BestSellers from '../home/BestSellers';
import FAQ from '../home/FAQ';
import MetaTags from '../SEO/MetaTags';
import { seoConfig } from '../../config/seoConfig';

const HomePage = ({ language, setSelectedProduct }) => {
  const isRomanian = language === 'ro';

  // The business itself (Bakery JSON-LD) is described once, in public/index.html.
  const pageData = {
    description: isRomanian
      ? 'Odette Confiserie - Comandă online prăjituri artizanale, torturi personalizate și deserturi premium. Livrare în Cluj-Napoca. Ingrediente premium, rețete tradiționale.'
      : 'Odette Confiserie - Order online artisan pastries, custom cakes and premium desserts. Delivery in Cluj-Napoca. Premium ingredients, traditional recipes.'
  };

  return (
    <>
      <MetaTags
        description={pageData.description}
        url={`${seoConfig.siteUrl}/`}
        lang={language}
      />
      <HeroSection language={language} />
      <AboutStory language={language} />
      <BestSellers
        language={language}
        setSelectedProduct={setSelectedProduct}
      />
      <FAQ language={language} />
    </>
  );
};

export default HomePage;
