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

/**
 * @returns {{ images: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export const useGalleryImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await getGalleryImages();

    if (error) {
      setError(error);
      setImages([]);
    } else {
      setImages(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return { images, loading, error, refetch: fetchImages };
};
