import { useEffect, useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { getOpenStatus } from '../lib/openingHours';

// Special days (holidays, special hours) from the Supabase table special_days, loaded once
// per page load and shared by every hours box. If the table can't be read, the weekly
// hours alone are used.
let specialDaysRequest = null;
const NONE = {};

function loadSpecialDays() {
  if (!specialDaysRequest) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Bucharest' }).format(new Date());
    specialDaysRequest = supabase
      .from('special_days')
      .select('day, opens, closes')
      .gte('day', today)
      .then(({ data, error }) => {
        if (error) return NONE;
        return Object.fromEntries(
          data.map((row) => [row.day, row.opens ? { open: row.opens.slice(0, 5), close: row.closes.slice(0, 5) } : null])
        );
      }, () => NONE);
  }
  return specialDaysRequest;
}

export function useSpecialDays() {
  const [specialDays, setSpecialDays] = useState(NONE);
  useEffect(() => {
    let current = true;
    loadSpecialDays().then((days) => { if (current) setSpecialDays(days); });
    return () => { current = false; };
  }, []);
  return specialDays;
}

// The live status, worked out in the browser only: prerendered pages would otherwise freeze
// it at build time. null until then. Refreshed every minute and when the tab comes back.
export function useOpenStatus() {
  const specialDays = useSpecialDays();
  const [status, setStatus] = useState(null);
  useEffect(() => {
    const update = () => setStatus(getOpenStatus(new Date(), specialDays));
    const onVisible = () => { if (document.visibilityState === 'visible') update(); };
    update();
    const timer = setInterval(update, 60 * 1000);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [specialDays]);
  return status;
}
