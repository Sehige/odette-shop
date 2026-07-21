import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Instagram } from 'lucide-react';
import { translations } from '../../data/translations';
import { siteConfig } from '../../data/siteConfig';
// White wordmark for the navy header
import odetteLogo from '../../Odette_Confiserie.svg';
// White swan logo mark (sits left of the wordmark)
import logoMark from '../../Stickere.svg';

const NAVY = '#1e3a8a';

const Header = ({ language, setLanguage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[language];

  // Wedding / events offer URL
  const weddingOfferUrl = 'https://www.canva.com/design/DAG9eAIoAiU/4Wzi004UggxTwSxsU1Wp8Q/view';

  const go = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Nav items (routes unchanged; only labels were renamed)
  const navLinkClass = 'text-white/90 hover:text-white transition font-semibold whitespace-nowrap text-lg xl:text-xl';

  return (
    <header
      className="fixed w-full top-0 z-40 border-y border-white/40"
      style={{ backgroundColor: NAVY }}
    >
      {/* Full-width with small safe padding: logo hugs the left, socials/lang hug the right */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="relative flex items-center justify-between h-20 lg:h-[124px]">
          {/* LEFT: swan + Odette Confiserie wordmark (both white on navy) */}
          <button
            onClick={() => go('/')}
            aria-label="Odette Confiserie - Acasă"
            className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
          >
            <img
              src={logoMark}
              alt=""
              className="h-16 sm:h-[4.5rem] lg:h-[106px] w-auto object-contain"
            />
            <img
              src={odetteLogo}
              alt="Odette Confiserie"
              className="h-12 sm:h-16 lg:h-[92px] w-auto"
            />
          </button>

          {/* CENTER: navigation (desktop), absolutely centered on the header */}
          <nav className="hidden lg:flex items-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <button onClick={() => go('/')} className={navLinkClass}>
              {t.home}
            </button>
            <button onClick={() => go('/shop')} className={navLinkClass}>
              {t.shopNav}
            </button>
            <a
              href={weddingOfferUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={navLinkClass}
            >
              {t.weddingNav}
            </a>
            <button onClick={() => go('/contact')} className={navLinkClass}>
              {t.contactNav}
            </button>
          </nav>

          {/* RIGHT: socials + language (desktop) / menu button (mobile) */}
          <div className="flex items-center gap-4 sm:gap-5">
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hidden lg:inline text-white/90 hover:text-white transition"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href={siteConfig.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hidden lg:inline text-white/90 hover:text-white transition"
            >
              <Facebook className="w-6 h-6" />
            </a>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'ro' ? 'en' : 'ro')}
              className="text-lg font-semibold text-white/90 hover:text-white transition"
            >
              {language === 'ro' ? 'Ro' : 'En'}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/30">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => go('/')} className="text-left text-white/90 hover:text-white py-2 font-semibold">
                {t.home}
              </button>
              <button onClick={() => go('/shop')} className="text-left text-white/90 hover:text-white py-2 font-semibold">
                {t.shopNav}
              </button>
              <a
                href={weddingOfferUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-white/90 hover:text-white py-2 font-semibold"
              >
                {t.weddingNav}
              </a>
              <button onClick={() => go('/contact')} className="text-left text-white/90 hover:text-white py-2 font-semibold">
                {t.contactNav}
              </button>

              {/* Socials in mobile menu */}
              <div className="flex items-center gap-4 pt-2">
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/90 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/90 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
