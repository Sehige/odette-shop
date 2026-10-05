import React, { useEffect, useState } from 'react';
import { translations } from '../../data/translations';
import { useSpecialDays } from '../../hooks/useOpeningHours';
import { upcomingSpecialDays, weeklyRows } from '../../lib/openingHours';
import OpenStatus from './OpenStatus';

// Live status, the weekly hours, and any special days in the next 30 days.
// tone="dark" on the navy footer.
const HoursBox = ({ language, tone = 'light' }) => {
  const t = translations[language].location;
  const specialDays = useSpecialDays();
  const [upcoming, setUpcoming] = useState([]);
  useEffect(() => {
    setUpcoming(upcomingSpecialDays(new Date(), specialDays, language));
  }, [specialDays, language]);

  const dark = tone === 'dark';
  const muted = dark ? 'text-blue-100' : 'text-gray-600';
  const strong = dark ? 'text-white' : 'text-gray-900';
  const rows = (list) => list.map((row) => (
    <div key={row.days} className="flex justify-between gap-6">
      <dt>{row.days}</dt>
      <dd className="whitespace-nowrap">{row.hours}</dd>
    </div>
  ));

  return (
    <div>
      <OpenStatus language={language} className={`mb-2 font-semibold ${strong}`} />
      <dl className={`space-y-1 ${muted}`}>{rows(weeklyRows(language))}</dl>
      {upcoming.length > 0 && (
        <div className="mt-3">
          <p className={`font-semibold ${strong}`}>{t.special}</p>
          <dl className={`space-y-1 ${muted}`}>{rows(upcoming.map((d) => ({ days: d.day, hours: d.hours })))}</dl>
        </div>
      )}
    </div>
  );
};

export default HoursBox;
