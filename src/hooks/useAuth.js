// ========================================
// FILE: src/hooks/useAuth.js
// ========================================

import { useState, useEffect, createContext, useContext } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: user } = await authService.getCurrentUser()
      setUser(user)
    } catch (err) {
      console.error('Error checking user:', err)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}