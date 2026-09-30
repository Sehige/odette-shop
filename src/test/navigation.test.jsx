import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import { CookieConsentProvider } from '../context/CookieConsentContext';

// Internal navigation must be real <a href> links: crawlers follow them and
// visitors can open them in a new tab.
const hrefs = (container) =>
  [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));

describe('crawlable navigation', () => {
  it('header links to home, shop and contact', () => {
    const { container } = render(
      <MemoryRouter><Header language="ro" setLanguage={() => {}} /></MemoryRouter>
    );
    expect(hrefs(container)).toEqual(expect.arrayContaining(['/', '/shop', '/contact']));
  });

  it('footer links to the main and legal pages', () => {
    const { container } = render(
      <CookieConsentProvider>
        <MemoryRouter><Footer language="ro" /></MemoryRouter>
      </CookieConsentProvider>
    );
    expect(hrefs(container)).toEqual(expect.arrayContaining([
      '/', '/shop', '/contact', '/terms-and-conditions', '/privacy-policy', '/cookie-policy',
    ]));
  });

  it('hero CTA links to the shop and the image is responsive with alt text', () => {
    const { container } = render(
      <MemoryRouter><HeroSection language="ro" /></MemoryRouter>
    );
    expect(hrefs(container)).toContain('/shop');
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', expect.stringMatching(/prăjitură/));
    expect(img.getAttribute('srcset').split(',')).toHaveLength(3);
  });
});
