import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Check for an active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 2. Listen for changes (e.g., logging in, logging out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Login Trigger Function
  const loginWithGoogle = async () => {
    try {
      /**
       * DETECT ENVIRONMENT: 
       * If origin is localhost or doesn't start with http (file://), 
       * we treat it as the mobile app.
       */
      const isApp = window.location.hostname === 'localhost' || 
                    !window.location.origin.startsWith('http');
      
      /**
       * DYNAMIC REDIRECT:
       * Web uses standard origin.
       * App uses custom scheme to trigger Deep Linking back to the app.
       */
      const redirectUrl = isApp 
        ? 'valo-community://login-callback' 
        : window.location.origin;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl, 
        }
      })
      
      if (error) throw error
    } catch (err) {
      console.error('Google login initialization failed:', err.message)
    }
  }

  // Logout Trigger Function
  const logout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Custom Hook for easy consumption anywhere in the app
export const useAuth = () => useContext(AuthContext)
