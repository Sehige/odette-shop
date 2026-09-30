import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';

const product = {
  id: 'b1d6a1f0-0000-4000-8000-000000000001',
  slug: 'tort-carrot-cake',
  name_ro: 'Tort Carrot Cake',
  name_en: 'Carrot Cake',
  price: 180,
  price_unit: 'kg',
  image_url: 'https://example.com/carrot-cake.jpg',
};

const renderCard = (setSelectedProduct) =>
  render(
    <MemoryRouter>
      <ProductCard product={product} language="ro" setSelectedProduct={setSelectedProduct} />
    </MemoryRouter>
  );

describe('product card', () => {
  it('is a real link to the product page', () => {
    renderCard(() => {});
    expect(screen.getByRole('link')).toHaveAttribute('href', '/produse/tort-carrot-cake');
  });

  it('opens the quick-view modal on a plain click', () => {
    const open = vi.fn();
    renderCard(open);
    fireEvent.click(screen.getByRole('link'));
    expect(open).toHaveBeenCalledWith(product);
  });

  it('leaves Ctrl/Cmd clicks to the browser (open in a new tab)', () => {
    const open = vi.fn();
    renderCard(open);
    fireEvent.click(screen.getByRole('link'), { ctrlKey: true });
    fireEvent.click(screen.getByRole('link'), { metaKey: true });
    expect(open).not.toHaveBeenCalled();
  });
});
