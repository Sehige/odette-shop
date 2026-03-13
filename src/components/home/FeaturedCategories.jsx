import React from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { useFeaturedCategories } from '../../hooks/useProducts';
import { getCategoryImageUrl } from '../../utils/imageOptimizer';

const FeaturedCategories = ({ language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  const { categories, loading, error } = useFeaturedCategories();

  const handleCategoryClick = (categoryId) => {
    navigate(`/shop?filter=${categoryId}`);
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              {t.categories}
            </h2>
            <p className="text-xl text-gray-600">{t.categoriesSubtitle}</p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-900"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              {t.categories}
            </h2>
            <p className="text-xl text-gray-600">{t.categoriesSubtitle}</p>
          </div>
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              {language === 'ro' ? 'Eroare la încărcarea categoriilor' : 'Error loading categories'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            {t.categories}
          </h2>
          <p className="text-xl text-gray-600">{t.categoriesSubtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-square"
            >
              {category.imageURL && (
                <img
                  src={getCategoryImageUrl(category.imageURL)}
                  alt={language === 'ro' ? category.name_ro : category.name_en}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {language === 'ro' ? category.name_ro : category.name_en}
                  </h3>
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