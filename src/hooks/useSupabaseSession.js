import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * useSupabaseSession
 *
 * Tracks the real Supabase auth session (used for the admin image tool).
 * Distinct from the mock localStorage-based useAuth hook.
 *
 * @returns {{ session: Object|null, isAdmin: boolean }}
 */
const useSupabaseSession = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => setSession(newSession)
    );

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Any authenticated Supabase user is treated as admin client-side;
  // actual write access is enforced by RLS (email-pinned policy).
  return { session, isAdmin: !!session };
};

export default useSupabaseSession;
