// ========================================
// SUPABASE CLIENT CONFIGURATION
// ========================================

import { createClient } from '../lib/supabase'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage, // Use localStorage for session persistence
    storageKey: 'odette-auth-token',
    flowType: 'pkce' // Use PKCE flow for better security
  },
  db: {
    schema: 'public' // Default schema
  },
  global: {
    headers: {
      'x-application-name': 'Odette Pastry'
    }
  }
})

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper function to get auth headers for API calls
export const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return {}
  }

  return {
    'Authorization': `Bearer ${session.access_token}`
  }
}

// Helper function to upload file to storage
export const uploadFile = async (bucket, path, file, options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      data: {
        ...data,
        publicUrl: urlData.publicUrl
      },
      error: null
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return { data: null, error }
  }
}

// Helper function to delete file from storage
export const deleteFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error deleting file:', error)
    return { data: null, error }
  }
}

// Helper function to get public URL for a file
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// Helper function to handle real-time subscriptions
export const subscribeToTable = (table, callback, filter = {}) => {
  const channel = supabase
    .channel(`public:${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        ...filter
      },
      callback
    )
    .subscribe()

  return channel
}

// Helper function to unsubscribe from real-time
export const unsubscribe = (channel) => {
  supabase.removeChannel(channel)
}

// Export default
export default supabase