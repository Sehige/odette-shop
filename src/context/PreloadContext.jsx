import React, { createContext, useContext } from 'react';

/**
 * Data a route loaded at build time (its loader), made available to the data
 * hooks below it. A hook that finds its key here starts with that data instead
 * of a loading state, so the prerendered HTML contains the real content; it then
 * refreshes in the background so edits in Supabase still show up immediately.
 */
const PreloadContext = createContext({});

export const Preload = ({ data, children }) => (
  <PreloadContext.Provider value={data || {}}>{children}</PreloadContext.Provider>
);

export const usePreloaded = (key) => useContext(PreloadContext)[key];
