import { useEffect, useState } from 'react';
import { christmas } from '../data/christmas';
import { romaniaDate } from './openingHours';

/** Whether the Christmas banner and buttons show: until the last day to order, in Romania */
export const christmasBannerOn = (now = new Date()) => romaniaDate(now) <= christmas.bannerUntil;

// __BUILD_DAY__ is the day the site was built (vite.config.mjs)
/* global __BUILD_DAY__ */
const shownAtBuild = (typeof __BUILD_DAY__ === 'string' ? __BUILD_DAY__ : romaniaDate(new Date())) <= christmas.bannerUntil;

/**
 * The homepage banner and the "Crăciun" buttons (header, shop). The build day decides the
 * built HTML and the browser's first render, so the two always match; the browser then checks
 * today's date, so after the last day to order nothing shows even before the next build.
 */
export function useChristmasSeason() {
  const [on, setOn] = useState(shownAtBuild);
  useEffect(() => {
    if (on && !christmasBannerOn()) setOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return on;
}
