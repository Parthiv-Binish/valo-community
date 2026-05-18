import { useState, useEffect } from 'react'
import { getSession, onAuthStateChange } from '../services/authService'

export function useAuth() {
  const [session, setSession] = useState(undefined) // undefined = loading

  useEffect(() => {
    getSession().then(setSession)

    const { data: { subscription } } = onAuthStateChange(setSession)
    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    isLoading: session === undefined,
    isAdmin: !!session,
  }
}
