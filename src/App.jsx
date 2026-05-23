import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import { useAuth, AuthProvider } from './context/AuthContext.jsx'

import LoadingScreen from './components/common/LoadingScreen'
import AllStreamersPage from './pages/AllStreamersPage'
import SubmitPage from './pages/SubmitPage'
import AboutPage from './pages/AboutPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminStreamersPage from './pages/AdminStreamersPage'
import AdminSubmissionsPage from './pages/AdminSubmissionsPage'
import AdminAnnouncements from './pages/AdminAnnouncements'
import MySubscriptionsPage from './pages/MySubscriptionsPage.jsx'

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false)

  useEffect(() => {
    const bootstrapPlatform = async () => {
      try {
        // 🕵️ Warm up connection and verify system integrity
        await supabase.from('streamers').select('id').limit(1)
        
        // ⏱️ Cinematic Delay: Lets the user experience your slick metallic glint intro
        setTimeout(() => {
          setDbLoaded(true)
        }, 1200)
      } catch (err) {
        console.error("Platform boot error:", err)
        setDbLoaded(true) // Fallback to let users access pages if offline
      }
    }
    bootstrapPlatform()
  }, [])

  return (
    <>
      <AuthProvider>
        {/* 🎬 MOUNT CINEMATIC INTRO OVERLAY WINDOW */}
        <LoadingScreen isAppReady={dbLoaded} />

        {/* 💻 APPLICATION ROUTING CANVAS */}
        <div 
          className={`min-h-screen bg-black transition-opacity duration-1000 ease-in-out w-full overflow-x-hidden ${
            dbLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AllStreamersPage />} />
              <Route path="/subscriptions" element={<MySubscriptionsPage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/leaderboard' element={<LeaderboardPage />} />
              
              {/* Admin Auth Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* 🛡️ SECURED ADMIN PATHS USING THE DATABASE GUARD */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminStreamersPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <AdminGuard>
                    <AdminSubmissionsPage />
                  </AdminGuard>
                }
              />
              <Route
                path="/admin/announcements"
                element={
                  <AdminGuard>
                    <AdminAnnouncements />
                  </AdminGuard>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </>
  )
}

// 🔑 INTERNAL DATABASE ROLE GUARD COMPONENT
function AdminGuard({ children }) {
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
        // Query our custom profiles metadata block inside Supabase
        const { data, error } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (data && !error) {
          setRole(data.role)
        }
      } catch (err) {
        console.error('Database role verification exception:', err.message)
      } finally {
        setCheckingRole(false)
      }
    }

    if (!authLoading) {
      checkUserRole()
    }
  }, [user, authLoading])

  // While checking auth token state or loading database rows, show a clean loading frame
  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-xs tracking-widest text-[#ff4655] uppercase">
        <div className="w-5 h-5 border-2 border-[#ff4655] border-t-transparent rounded-full animate-spin mb-3"></div>
        Verifying Secure Clearances...
      </div>
    )
  }

  // 🛑 Boot out any account whose database profile is not flagged explicitly as 'admin'
  if (!user || role !== 'admin') {
    console.warn(`[Security Intervention]: Redirected unauthorized agent context. Role: ${role}`)
    return <Navigate to="/" replace />
  }

  // ✅ Authorized: Render out protected panel components safely
  return children
}

function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-display font-bold text-6xl text-[#ff4655] mb-4">404</h1>
      <p className="text-neutral-400 font-body mb-8">This page doesn't exist in the VALO universe.</p>
      <a href="/" className="bg-[#ff4655] hover:bg-[#e03e4b] text-white px-8 py-3 font-display uppercase tracking-widest text-xs font-black rounded transition-transform active:scale-[0.98]">
        Back to Home
      </a>
    </div>
  )
}
