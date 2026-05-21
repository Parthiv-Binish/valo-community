import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase.js'

import LoadingScreen from './components/common/LoadingScreen'
import AllStreamersPage from './pages/AllStreamersPage'
import SubmitPage from './pages/SubmitPage'
import AboutPage from './pages/AboutPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminStreamersPage from './pages/AdminStreamersPage'
import AdminSubmissionsPage from './pages/AdminSubmissionsPage'
import AdminAnnouncements from './pages/AdminAnnouncements'
import ProtectedRoute from './components/common/ProtectedRoute'

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
      {/* 🎬 MOUNT CINEMATIC INTRO OVERLAY WINDOW */}
      <LoadingScreen isAppReady={dbLoaded} />

      {/* 💻 APPLICATION ROUTING CANVAS */}
      {/* Mobile Fix: Dropped 'scale-98' and 'blur-sm' which cause accidental horizontal overflow on thin viewports */}
      <div 
        className={`min-h-screen bg-black transition-opacity duration-1000 ease-in-out w-full overflow-x-hidden ${
          dbLoaded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<AllStreamersPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/leaderboard' element={<LeaderboardPage />} />
            
            {/* Admin Auth */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Protected */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminStreamersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/submissions"
              element={
                <ProtectedRoute>
                  <AdminSubmissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute>
                  <AdminAnnouncements />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-valo-dark flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-display font-bold text-6xl text-valo-red mb-4">404</h1>
      <p className="text-valo-muted font-body mb-8">This page doesn't exist in the VALO universe.</p>
      <a href="/" className="valo-btn px-8 py-3 font-display">Back to Home</a>
    </div>
  )
}
