import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

export default function AdminGuard({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState(null)
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setCheckingRole(false)
        return
      }

      try {
        // Query our custom table to see what permission tier this account holds
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setRole(data.role)
        }
      } catch (err) {
        console.error('Role clearance failed:', err.message)
      } finally {
        setCheckingRole(false)
      }
    }

    if (!authLoading) {
      checkUserRole()
    }
  }, Packs, [user, authLoading])

  // Wait for both the auth token and database record to check out
  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-xs text-[#ff4655] tracking-widest uppercase animate-pulse">
        Verifying Security Clearances...
      </div>
    )
  }

  // 🛑 Boot out anyone who is not explicitly flagged as an admin in your DB
  if (!user || role !== 'admin') {
    console.warn(`[Security Alert]: Blocked unauthorized attempt from role tier: ${role}`)
    return <Navigate to="/" replace />
  }

  // ✅ Let them through
  return children
}