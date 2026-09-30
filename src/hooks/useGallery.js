/**
 * useGallery Hook
 *
 * Fetches the cake gallery images (past-work photos) once on mount.
 * Mirrors useBestSellers in useProducts.js.
 *
 * Path: /src/hooks/useGallery.js
 */

import { useState, useEffect } from 'react';
import { getGalleryImages } from '../services/galleryService';
import { usePreloaded } from '../context/PreloadContext';

/**
 * @returns {{ images: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export const useGalleryImages = () => {
  // Prerendered pages start from build-time data (see PreloadContext)
  const preloaded = usePreloaded('galleryImages');
  const [images, setImages] = useState(preloaded || []);
  const [loading, setLoading] = useState(!preloaded);
  const [error, setError] = useState(null);

  const fetchImages = async ({ background = false } = {}) => {
    if (!background) setLoading(true);
    setError(null);

    const { data, error } = await getGalleryImages();

    if (error) {
      if (!background) {
        setError(error);
        setImages([]);
      }
    } else {
      setImages(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImages({ background: !!preloaded });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { images, loading, error, refetch: fetchImages };
};
