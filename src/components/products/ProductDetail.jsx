import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../../data/translations';
import { useAuth } from '../../hooks/useAuth';
import { getProductDetailImageUrl, getThumbnailUrl } from '../../utils/imageOptimizer';
import AdjustableImage from '../common/AdjustableImage';

const ProductDetail = ({ product, language, onClose }) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : null);
  const [selectedFlavor, setSelectedFlavor] = useState(
    product.flavors ? product.flavors[language][0] : null
  );
  const { isAuthenticated } = useAuth();
  const t = translations[language];

  const modalContentRef = useRef(null);
  const thumbnailContainerRef = useRef(null);

  // Image carousel state
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.image_url];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto-scroll thumbnail strip when selected image changes
  useEffect(() => {
    if (thumbnailContainerRef.current && images.length > 1) {
      const container = thumbnailContainerRef.current;
      const thumbnails = container.children;
      if (thumbnails[selectedImageIndex]) {
        const thumbnail = thumbnails[selectedImageIndex];
        const containerRect = container.getBoundingClientRect();
        const thumbnailRect = thumbnail.getBoundingClientRect();

        if (thumbnailRect.left < containerRect.left || thumbnailRect.right > containerRect.right) {
          thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    }
  }, [selectedImageIndex, images.length]);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Handle browser back button - push state when modal opens, close on back
  useEffect(() => {
    // Push a new history state when modal opens
    window.history.pushState({ modal: 'product' }, '');

    const handlePopState = () => {
      // When back is pressed, close the modal
      onClose();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // ✅ NEW: Handle click outside modal
  const handleBackdropClick = (event) => {
    if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
      onClose();
    }
  };

  const handleContactUs = () => {
    // Close modal and navigate to contact page
    onClose();
    navigate('/contact');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalContentRef}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        {/* Sticky Close Button */}
        <div className="sticky top-0 z-20 flex justify-end p-3 bg-gradient-to-b from-white via-white to-transparent">
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition shadow-md"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-4">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Image Carousel */}
            <div>
              {/* Main Image with Navigation */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                <AdjustableImage
                  elementKey={images[selectedImageIndex]}
                  src={getProductDetailImageUrl(images[selectedImageIndex])}
                  alt={language === 'ro' ? product.name_ro : product.name_en}
                  className="w-full h-full"
                />

                {/* Easter Special Badge */}
                {product.isEasterFeatured && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                      <span className="text-lg">🐰</span>
                      <span>{language === 'ro' ? 'Ediție de Paște' : 'Easter Edition'}</span>
                    </span>
                  </div>
                )}

                {/* Navigation Arrows - only show if multiple images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-800" />
                    </button>
                    {/* Image counter */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {selectedImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Strip - only show if multiple images */}
              {images.length > 1 && (
                <div className="relative flex items-center gap-2">
                  {/* Left arrow for thumbnails */}
                  <button
                    onClick={prevImage}
                    className="flex-shrink-0 p-1.5 bg-white hover:bg-gray-100 rounded-full shadow-md border border-gray-200 transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>

                  {/* Thumbnails container */}
                  <div
                    ref={thumbnailContainerRef}
                    className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1"
                  >
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition ${
                          selectedImageIndex === index
                            ? 'border-blue-600'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <AdjustableImage
                          editable={false}
                          elementKey={img}
                          src={getThumbnailUrl(img)}
                          alt={`${language === 'ro' ? product.name_ro : product.name_en} - ${index + 1}`}
                          className="w-full h-full"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Right arrow for thumbnails */}
                  <button
                    onClick={nextImage}
                    className="flex-shrink-0 p-1.5 bg-white hover:bg-gray-100 rounded-full shadow-md border border-gray-200 transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {/* Product Name */}
              <h2 className="text-3xl md:text-6xl font-bold text-gray-900 mb-3">
                {language === 'ro' ? product.name_ro : product.name_en}
              </h2>

              {/* Description */}
              <div className="mb-4">
                <p className="text-gray-600">{language === 'ro' ? product.description_ro : product.description_en}</p>
              </div>

              {/* Quantity and Price - same line, opposite sides */}
              <div className="flex justify-between items-center mb-6 py-3 ">
                {product.quantity && (
                  <span className="text-gray-600 font-medium">{product.quantity}</span>
                )}
                {!product.quantity && <span></span>}
                <span className="text-2xl font-bold" style={{ color: '#1e40af' }}>
                  {product.price} {t.lei}{product.price_unit && `/${product.price_unit}`}
                </span>
              </div>

              {/* Dropdown Menus */}
              <div className="border-t border-gray-200 mb-6">
                {/* Ingredients, Allergens, Nutritional - Hidden for Easter Boxes category */}
                {!(product.categoryName?.toLowerCase().includes('easter') || product.categoryNameRo?.toLowerCase().includes('paște')) && (
                  <>
                    {/* Ingredients Dropdown */}
                    <div className="border-b border-gray-200">
                      <button
                        onClick={() => toggleDropdown('ingredients')}
                        className="w-full flex justify-between items-center py-4 hover:opacity-70 transition"
                      >
                        <span className="text-sm font-medium text-gray-900">{t.ingredients}</span>
                        {openDropdown === 'ingredients' ? (
                          <Minus className="w-4 h-4 text-gray-900" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-900" />
                        )}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'ingredients' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {(product.ingredients_ro || product.ingredients_en)
                            ? (language === 'ro' ? product.ingredients_ro : product.ingredients_en)
                            : (language === 'ro' ? 'Informații indisponibile' : 'Information unavailable')}
                        </p>
                      </div>
                    </div>

                    {/* Allergens Dropdown */}
                    <div className="border-b border-gray-200">
                      <button
                        onClick={() => toggleDropdown('allergens')}
                        className="w-full flex justify-between items-center py-4 hover:opacity-70 transition"
                      >
                        <span className="text-sm font-medium text-gray-900">{t.allergens}</span>
                        {openDropdown === 'allergens' ? (
                          <Minus className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'allergens' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {(product.allergens_ro || product.allergens_en)
                            ? (language === 'ro' ? product.allergens_ro : product.allergens_en)
                            : (language === 'ro' ? 'Informații indisponibile' : 'Information unavailable')}
                        </p>
                      </div>
                    </div>

                    {/* Nutritional Values Dropdown */}
                    <div className="border-b border-gray-200">
                      <button
                        onClick={() => toggleDropdown('nutritional')}
                        className="w-full flex justify-between items-center py-4 hover:opacity-70 transition"
                      >
                        <span className="text-sm font-medium text-gray-900">{t.nutritionalInfo}</span>
                        {openDropdown === 'nutritional' ? (
                          <Minus className="w-4 h-4 text-gray-900" />
                        ) : (
                          <Plus className="w-4 h-4 text-gray-900" />
                        )}
                      </button>
                      <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'nutritional' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                        {product.nutritional_info ? (
                          <table className="w-full text-sm text-gray-900">
                            <tbody>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.calories}</td>
                                <td className="py-2 text-right">{product.nutritional_info.energy_kcal} kcal</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.fat}</td>
                                <td className="py-2 text-right">{product.nutritional_info.fat_g}g</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.saturatedFat}</td>
                                <td className="py-2 text-right">{product.nutritional_info.saturated_fat_g}g</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.carbs}</td>
                                <td className="py-2 text-right">{product.nutritional_info.carbohydrates_g}g</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.sugars}</td>
                                <td className="py-2 text-right">{product.nutritional_info.sugars_g}g</td>
                              </tr>
                              <tr className="border-b border-gray-100">
                                <td className="py-2">{t.protein}</td>
                                <td className="py-2 text-right">{product.nutritional_info.protein_g}g</td>
                              </tr>
                              <tr>
                                <td className="py-2">{t.salt}</td>
                                <td className="py-2 text-right">{product.nutritional_info.salt_g}g</td>
                              </tr>
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-gray-900 text-sm">
                            {language === 'ro' ? 'Informații indisponibile' : 'Information unavailable'}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Transport Dropdown */}
                <div className="border-b border-gray-200">
                  <button
                    onClick={() => toggleDropdown('transport')}
                    className="w-full flex justify-between items-center py-4 hover:opacity-70 transition"
                  >
                    <span className="text-sm font-medium text-gray-900">{language === 'ro' ? 'Transport' : 'Shipping'}</span>
                    {openDropdown === 'transport' ? (
                      <Minus className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openDropdown === 'transport' ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {language === 'ro'
                        ? 'Beneficiezi de livrare gratuită pentru comenzile de peste 200 lei. Pentru comenzile sub această valoare se percepe o taxă de transport de 15 lei în Cluj-Napoca și 25 lei în afara orașului.'
                        : 'Free delivery for orders over 200 RON. For orders below this amount, the delivery fee is 15 RON in Cluj-Napoca and 25 RON outside the city.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Us Button */}
              <button
                onClick={handleContactUs}
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#1e40af' }}
              >
                {language === 'ro' ? 'Contactează-ne' : 'Contact Us'}
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;