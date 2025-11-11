// ========================================
// FILE: src/lib/supabase.js
// PURPOSE: Supabase client configuration
// ========================================

import { createClient } from '@supabase/supabase-js'

// 🔑 Get credentials from environment variables
// These come from your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ⚠️ Validate that credentials exist
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase credentials! Check your .env file.'
  )
}

// 🚀 Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper: Check if user is logged in
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper: Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export default supabase