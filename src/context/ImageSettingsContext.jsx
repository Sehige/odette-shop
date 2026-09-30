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

// image_settings rows -> { [element_key]: { focalX, focalY, zoom } }
const toSettingsByKey = (rows) => {
  const byKey = {};
  (rows || []).forEach((row) => {
    byKey[row.element_key] = {
      focalX: Number(row.focal_x),
      focalY: Number(row.focal_y),
      zoom: Number(row.zoom)
    };
  });
  return byKey;
};

// initialRows: framing loaded at build time, so prerendered images are framed
// right away instead of jumping once the settings arrive.
export const ImageSettingsProvider = ({ initialRows, children }) => {
  const [settings, setSettings] = useState(() => toSettingsByKey(initialRows));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await getAllImageSettings();
      if (cancelled || !data) return;
      setSettings(toSettingsByKey(data));
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
