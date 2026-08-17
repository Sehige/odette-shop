import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { translations } from '../../data/translations';
import ProductCard from '../products/ProductCard';
import TrustBadges from '../home/TrustBadges';
import MetaTags from '../SEO/MetaTags';
import BreadcrumbSchema from '../SEO/BreadcrumbSchema';
import { seoConfig } from '../../config/seoConfig';

import { useAllProducts, useCategories } from '../../hooks/useProducts';
import { useGalleryImages } from '../../hooks/useGallery';
import useSupabaseSession from '../../hooks/useSupabaseSession';
import CakeGalleryCarousel from './CakeGalleryCarousel';
import CakeOrderSteps from './CakeOrderSteps';

const ShopPage = ({ language, setSelectedProduct, selectedProduct }) => {
  const t = translations[language];
  const shopT = translations[language].shop;
  const [searchParams, setSearchParams] = useSearchParams();
  // Product counts in section titles are shown only to the logged-in admin
  const { isAdmin } = useSupabaseSession();

  const { products: allProducts, loading: productsLoading, error: productsError } = useAllProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { images: galleryImages } = useGalleryImages();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  // Past-work photos for the selected category (e.g. Torturi). Empty on "all".
  const galleryForCategory = selectedCategory === 'all'
    ? []
    : galleryImages.filter((g) => g.category_id === selectedCategory);

  // Whether the selected category is cakes (Torturi), to show the how-to-order steps.
  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);
  const isCakeCategory = !!selectedCategoryObj && (
    (selectedCategoryObj.name_ro || '').toLowerCase().includes('tort') ||
    (selectedCategoryObj.name_en || '').toLowerCase().includes('cake')
  );

  // Keep the selected category in sync with the URL (?filter=<categoryId>) so
  // category selections are shareable and shared links land pre-filtered.
  useEffect(() => {
    setSelectedCategory(searchParams.get('filter') || 'all');
  }, [searchParams]);

  // Select a category by writing it to the URL (state follows via the effect
  // above). 'all' clears the filter param. Other params (e.g. product) are kept.
  const selectCategory = (id) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (id && id !== 'all') params.set('filter', id);
      else params.delete('filter');
      return params;
    });
  };

  // Open a product and reflect it in the URL (?product=<id>) so it's shareable.
  // `replace` avoids stacking an extra history entry on top of the modal's own.
  const openProduct = (product) => {
    setSelectedProduct(product);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('product', product.id);
      return params;
    }, { replace: true });
  };

  // Open the product named in the URL once products have loaded (shared link).
  useEffect(() => {
    const productId = searchParams.get('product');
    if (!productId || !allProducts.length) return;
    if (!selectedProduct || selectedProduct.id !== productId) {
      const product = allProducts.find((p) => p.id === productId);
      if (product) setSelectedProduct(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allProducts]);

  // When the modal closes (product -> null), drop the ?product param.
  const prevProductRef = React.useRef(null);
  useEffect(() => {
    const prev = prevProductRef.current;
    prevProductRef.current = selectedProduct;
    if (prev && !selectedProduct && searchParams.get('product')) {
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.delete('product');
        return next;
      }, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  console.log('Categories in ShopPage:', categories);
  
  const filteredProducts = (selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory)
  ).sort((a, b) => {
    const orderA = a.order_index ?? 1000;
    const orderB = b.order_index ?? 1000;
    if (orderA !== orderB) return orderA - orderB;
    const nameA = (language === 'ro' ? a.name_ro : a.name_en) || '';
    const nameB = (language === 'ro' ? b.name_ro : b.name_en) || '';
    return nameA.localeCompare(nameB, language);
  });

  const pageData = {
    title: language === 'ro' ? 'Magazin Online - Prajituri si Torturi' : 'Online Shop - Pastries and Cakes',
    description: language === 'ro'
      ? `Descopera ${allProducts.length} prajituri artizanale si torturi premium. Comanda online cu livrare in Cluj-Napoca.`
      : `Discover ${allProducts.length} artisan pastries and premium cakes. Order online with delivery in Cluj-Napoca.`,
    keywords: language === 'ro'
      ? 'prajituri online, torturi comanda, cofetarie Cluj, deserturi premium'
      : 'pastries online, cake order, Cluj bakery, premium desserts'
  };

  const breadcrumbItems = [
    { name: language === 'ro' ? 'Acasa' : 'Home', url: seoConfig.siteUrl },
    { name: language === 'ro' ? 'Magazin' : 'Shop', url: `${seoConfig.siteUrl}/shop` }
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageData.title,
    "numberOfItems": filteredProducts.length,
    "itemListElement": filteredProducts.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": language === 'ro' ? product.name_ro : product.name_en,
        "image": product.image_url,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "RON"
        }
      }
    }))
  };

  // Loading state - use skeleton that matches final layout to prevent CLS
  if (productsLoading || categoriesLoading) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton Header */}
          <div className="text-center mb-6 sm:mb-12 min-h-[80px] sm:min-h-[120px]">
            <div className="h-8 sm:h-12 bg-gray-200 rounded-lg w-36 sm:w-48 mx-auto mb-2 sm:mb-4 animate-pulse"></div>
            <div className="h-5 sm:h-6 bg-gray-200 rounded w-48 sm:w-64 mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton Filter */}
          <div className="mb-4 sm:mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[36px] sm:min-h-[44px]">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 sm:h-10 w-20 sm:w-24 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3 sm:p-6">
                  <div className="h-4 sm:h-6 bg-gray-200 rounded mb-2 sm:mb-3 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 sm:mb-4 hidden sm:block animate-pulse"></div>
                  <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {shopT.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
          >
            {shopT.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  
  return (
    <>
      <MetaTags
        title={pageData.title}
        description={pageData.description}
        keywords={pageData.keywords}
        url={`${seoConfig.siteUrl}/shop`}
        structuredData={itemListSchema}
        lang={language}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <div className="pt-32 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - min-height matches skeleton to prevent CLS */}
        <div className="text-center mb-6 sm:mb-12 min-h-[80px] sm:min-h-[120px]">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 sm:mb-4">
            {shopT.title}
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            {isAdmin
              ? (language === 'ro'
                  ? `Descoperă ${allProducts.length} ${shopT.productsCount}`
                  : `Discover ${allProducts.length} ${shopT.productsCount}`)
              : shopT.subtitle}
          </p>
        </div>
        
        {/* Category Filter - min-height to prevent CLS */}
        <div className="mb-4 sm:mb-8 flex flex-wrap justify-center gap-2 sm:gap-3 min-h-[36px] sm:min-h-[44px]">
          {/* Category Buttons - sorted by order_index then alphabetically */}
          {[...categories].sort((a, b) => {
            const orderA = a.order_index ?? 1000;
            const orderB = b.order_index ?? 1000;
            if (orderA !== orderB) return orderA - orderB;
            const nameA = (language === 'ro' ? a.name_ro : a.name_en) || '';
            const nameB = (language === 'ro' ? b.name_ro : b.name_en) || '';
            return nameA.localeCompare(nameB, language);
          }).map(category => {
            const count = allProducts.filter(p => p.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
                  selectedCategory === category.id
                    ? 'bg-blue-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {language === 'ro' ? category.name_ro : category.name_en}{isAdmin ? ` (${count})` : ''}
              </button>
            );
          })}

          {/* All Products Button - at the end */}
          <button
            onClick={() => selectCategory('all')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium transition ${
              selectedCategory === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {shopT.all}{isAdmin ? ` (${allProducts.length})` : ''}
          </button>
        </div>
                
        {/* "How to order a cake" steps — shown in the cakes (Torturi) category */}
        {isCakeCategory && <CakeOrderSteps language={language} />}

        {/* Past-work cake gallery (shown for categories that have gallery photos) */}
        <CakeGalleryCarousel images={galleryForCategory} language={language} />

        {/* "Arome" heading for the priced products, shown alongside the gallery */}
        {galleryForCategory.length > 0 && (
          <h2 className="text-left font-serif font-bold text-gray-900 text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6">
            {shopT.flavorsTitle}
          </h2>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                setSelectedProduct={openProduct}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              {shopT.noProducts}
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ShopPage;