/**
 * Supabase Configuration
 *
 * The one Supabase client for the whole app (data, storage and admin auth).
 * Two clients on the same auth storage key race each other on token refresh,
 * so everything imports this instance.
 *
 * Path: /src/config/supabaseClient.js
 */

import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Missing Supabase environment variables!\n' +
    'Please make sure you have created a .env file with:\n' +
    '- REACT_APP_SUPABASE_URL\n' +
    '- REACT_APP_SUPABASE_ANON_KEY\n'
  );
}

// Sessions only make sense in a browser; when the code runs in Node (build-time
// rendering) the client just reads public data and keeps no session.
const inBrowser = typeof window !== 'undefined';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: inBrowser,
    persistSession: inBrowser,
    detectSessionInUrl: inBrowser
  }
});
