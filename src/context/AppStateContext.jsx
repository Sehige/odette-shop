import { createContext, useContext } from 'react';

/**
 * App-wide UI state owned by the root route (src/root.jsx): the chosen language
 * and the product shown in the detail modal. Route modules read it and pass it
 * on to the page components as props.
 */
export const AppStateContext = createContext({
  language: 'ro',
  setLanguage: () => {},
  selectedProduct: null,
  setSelectedProduct: () => {},
});

export const useAppState = () => useContext(AppStateContext);
