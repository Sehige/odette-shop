import React from 'react';
import { Link } from 'react-router-dom';
import { TreePine } from 'lucide-react';

// Christmas red with white: the "Crăciun" buttons and the homepage banner's "Comandă acum"
export const festiveColors = 'bg-[#b3121f] text-white ring-2 ring-white hover:bg-[#9a0f1a]';

/**
 * The festive "Crăciun" button to /craciun (header and shop), shown during the Christmas
 * season (useChristmasSeason). `iconClassName` sizes the tree icon (or hides it on narrow screens).
 */
const ChristmasButton = ({ language, className = '', iconClassName = 'w-5 h-5', onClick }) => (
  <Link
    to="/craciun"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap shadow-md transition ${festiveColors} ${className}`}
  >
    <TreePine className={`text-white shrink-0 ${iconClassName}`} aria-hidden="true" />
    {language === 'en' ? 'Christmas' : 'Crăciun'}
  </Link>
);

export default ChristmasButton;
