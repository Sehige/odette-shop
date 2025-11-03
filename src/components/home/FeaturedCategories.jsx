import React from 'react';
import { translations } from '../../data/translations';
import { CAKE_IMAGE, ECLAIR_IMAGE, MACARON_IMAGE, HERO_IMAGE } from '../../data/imageConstants';

const FeaturedCategories = ({ language, setCurrentPage, setFilter }) => {
  const t = translations[language];
  
  const categories = [
    {
      id: 'cakes',
      name: { ro: 'Torturi', en: 'Cakes' },
      image: CAKE_IMAGE,
      description: { ro: 'Torturi premium pentru orice ocazie', en: 'Premium cakes for any occasion' }
    },
    {
      id: 'pastries',
      name: { ro: 'Prăjituri', en: 'Pastries' },
      image: ECLAIR_IMAGE,
      description: { ro: 'Prăjituri fine și delicioase', en: 'Fine and delicious pastries' }
    },
    {
      id: 'cookies',
      name: { ro: 'Cookies & Macarons', en: 'Cookies & Macarons' },
      image: MACARON_IMAGE,
      description: { ro: 'Delicii mici pentru momente dulci', en: 'Small delights for sweet moments' }
    },
    {
      id: 'events',
      name: { ro: 'Evenimente Speciale', en: 'Special Events' },
      image: HERO_IMAGE,
      description: { ro: 'Comenzi personalizate pentru evenimente', en: 'Custom orders for events' }
    }
  ];

  const handleCategoryClick = (categoryId) => {
    setFilter(categoryId);
    setCurrentPage('shop');
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.categories}
          </h2>
          <p className="text-xl text-gray-600">{t.categoriesSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
            >
              <img
                src={category.image}
                alt={category.name[language]}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name[language]}</h3>
                  <p className="text-white/90 text-sm">{category.description[language]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;