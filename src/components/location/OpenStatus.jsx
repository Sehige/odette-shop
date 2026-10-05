import React from 'react';
import { useOpenStatus } from '../../hooks/useOpeningHours';
import { statusText } from '../../lib/openingHours';

const DOT = { open: 'bg-green-500', closing: 'bg-amber-400', closed: 'bg-red-500' };

// "Deschis acum · închide la 19:00". Appears once the page has loaded (never in the
// prerendered HTML); its line is reserved, so nothing moves when it does. The dot is
// decorative, the text carries the meaning; not announced on every minute's update.
const OpenStatus = ({ language, className = '' }) => {
  const status = useOpenStatus();
  return (
    <p data-open-status className={`min-h-[1.5rem] flex items-center gap-2 ${className}`}>
      {status && (
        <>
          <span aria-hidden="true" className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${DOT[status.state]}`} />
          <span>{statusText(status, language)}</span>
        </>
      )}
    </p>
  );
};

export default OpenStatus;
