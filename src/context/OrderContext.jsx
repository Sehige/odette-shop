import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { maxQuantity } from '../order/rules';

// The order list: products the visitor wants to order, kept in this browser between
// visits. Prices shown here are a convenience; the order uses the database's prices.
const STORAGE_KEY = 'odette_order';

const readStored = () => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(items) ? items.filter((i) => i && i.id && i.quantity > 0) : [];
  } catch {
    return [];
  }
};
const store = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage blocked (private mode): the list lasts until the page is closed
  }
};

// What the list keeps of a product: enough to show it
const snapshot = (product) => ({
  id: product.id,
  slug: product.slug,
  name_ro: product.name_ro,
  name_en: product.name_en,
  price: Number(product.price),
  price_unit: product.price_unit,
  image_url: (product.images && product.images[0]) || product.image_url,
});

const OrderContext = createContext({
  items: [], count: 0, ready: false, add: () => {}, setQuantity: () => {}, remove: () => {}, clear: () => {},
});

export function OrderProvider({ children }) {
  const [items, setItems] = useState([]);
  // The stored list is read after the first render, so the prerendered HTML (empty list) matches
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStored());
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) store(items);
  }, [items, ready]);

  const add = useCallback((product, quantity) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (!existing) return [...current, { ...snapshot(product), quantity }];
      const total = Math.min(existing.quantity + quantity, maxQuantity(product.price_unit));
      return current.map((i) => (i.id === product.id ? { ...snapshot(product), quantity: total } : i));
    });
  }, []);
  const setQuantity = useCallback((id, quantity) => {
    setItems((current) => current.map((i) => (i.id === id ? { ...i, quantity } : i)));
  }, []);
  const remove = useCallback((id) => setItems((current) => current.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, ready, add, setQuantity, remove, clear }),
    [items, ready, add, setQuantity, remove, clear]
  );
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => useContext(OrderContext);
