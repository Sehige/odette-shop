import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAllImageSettings, upsertImageSetting } from '../services/imageSettingsService';

/**
 * ImageSettingsContext
 *
 * Loads all per-element image framing values (focal point + zoom) once and
 * exposes them to AdjustableImage instances. Saving updates local state
 * optimistically and persists to Supabase.
 */

const DEFAULT_SETTING = { focalX: 50, focalY: 50, zoom: 1 };

const ImageSettingsContext = createContext(null);

export const ImageSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await getAllImageSettings();
      if (cancelled || !data) return;
      const byKey = {};
      data.forEach((row) => {
        byKey[row.element_key] = {
          focalX: Number(row.focal_x),
          focalY: Number(row.focal_y),
          zoom: Number(row.zoom)
        };
      });
      setSettings(byKey);
    })();
    return () => { cancelled = true; };
  }, []);

  const getSetting = useCallback(
    (key) => settings[key] || DEFAULT_SETTING,
    [settings]
  );

  const saveSetting = useCallback(async (key, { focalX, focalY, zoom }) => {
    setSettings((prev) => ({ ...prev, [key]: { focalX, focalY, zoom } }));
    const { error } = await upsertImageSetting(key, {
      focal_x: focalX,
      focal_y: focalY,
      zoom
    });
    return { error };
  }, []);

  return (
    <ImageSettingsContext.Provider value={{ getSetting, saveSetting }}>
      {children}
    </ImageSettingsContext.Provider>
  );
};

export const useImageSettings = () => {
  const context = useContext(ImageSettingsContext);
  if (!context) {
    // Outside provider (e.g. tests): behave read-only with defaults
    return {
      getSetting: () => DEFAULT_SETTING,
      saveSetting: async () => ({ error: new Error('ImageSettingsProvider missing') })
    };
  }
  return context;
};
