import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine } from 'lucide-react';

/**
 * The festive "Crăciun" button to /craciun (header and shop), shown during the Christmas
 * season (useChristmasSeason). Red with a gold ring, so it stands out from the navy and white.
 * `iconClassName` sizes the tree icon (or hides it on narrow screens).
 */
const ChristmasButton = ({ language, className = '', iconClassName = 'w-5 h-5', onClick }) => (
  <Link
    to="/craciun"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#b3121f] text-white font-semibold whitespace-nowrap shadow-md ring-2 ring-[#d4af37] hover:bg-[#9a0f1a] transition ${className}`}
  >
    <TreePine className={`text-[#f5d76e] shrink-0 ${iconClassName}`} aria-hidden="true" />
    {language === 'en' ? 'Christmas' : 'Crăciun'}
  </Link>
);

export default ChristmasButton;
