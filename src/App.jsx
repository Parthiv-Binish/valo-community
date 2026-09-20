import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase.js'
import { useAuth, AuthProvider } from './context/AuthContext.jsx'

import LoadingScreen from './components/common/LoadingScreen'
import AllStreamersPage from './pages/AllStreamersPage'
import SubmitPage from './pages/SubmitPage'
import LeaderboardPage from './pages/LeaderboardPage'
import MySubscriptionsPage from './pages/MySubscriptionsPage.jsx'
import SubscribedForecastPage from './pages/SubscribedForecastPage.jsx'

import MaintenancePage from './pages/MaintenancePage'
import ComingSoonPage from './pages/ComingSoonPage'

// Code-split: the admin console, About and Privacy pages are only needed by a
// small share of visitors, so they load on demand instead of in the main bundle.
const AboutPage = lazy(() => import('./pages/AboutPage'))
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.jsx'))
const StreamerProfilePage = lazy(() => import('./pages/StreamerProfilePage'))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'))
const AdminStreamersPage = lazy(() => import('./pages/AdminStreamersPage'))
const AdminSubmissionsPage = lazy(() => import('./pages/AdminSubmissionsPage'))
const AdminAnnouncements = lazy(() => import('./pages/AdminAnnouncements'))
const AdminBannersPage = lazy(() => import('./pages/AdminBannersPage.jsx'))
const AdminSettingsPage = lazy(() => import('./pages/AdminSettingsPage.jsx'))

// The cinematic intro is kept for first-time / returning-after-a-day visitors,
// but skipped for people who were here within the last 24h.
const INTRO_MS = 1200
const INTRO_REPEAT_AFTER_MS = 24 * 60 * 60 * 1000
function introDelay() {
  try {
    const last = Number(localStorage.getItem('valo_intro_seen') || 0)
    const now = Date.now()
    if (last && now - last < INTRO_REPEAT_AFTER_MS) return 0
    localStorage.setItem('valo_intro_seen', String(now))
  } catch {
    /* storage unavailable – just show the intro */
  }
  return INTRO_MS
}

const SITE = "Let's Build VALO Community"
const DEFAULT_DESCRIPTION =
  'VALORANT live streamer community platform – watch live streams from YouTube and Kick'
const ROUTE_META = {
  '/': { title: SITE, description: DEFAULT_DESCRIPTION },
  '/subscriptions': { title: `My Subscriptions | ${SITE}`, noindex: true },
  '/predictions': { title: `Radar Forecast | ${SITE}`, noindex: true },
  '/leaderboard': { title: `Live Leaderboard | ${SITE}`, description: 'Which VALORANT streamers are live right now, ranked by viewers.' },
  '/submit': { title: `Submit a Streamer | ${SITE}`, description: 'Know a VALORANT streamer we should feature? Send us their YouTube or Kick link.' },
  '/about': { title: `About | ${SITE}` },
  '/privacy': { title: `Privacy Policy | ${SITE}` },
}

// Per-route <title>, description and robots hints for the single-page app.
function RouteMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin')
    const meta = ROUTE_META[pathname] || (isAdmin ? { title: `Admin | ${SITE}`, noindex: true } : { title: SITE })
    document.title = meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', meta.description || DEFAULT_DESCRIPTION)
    const robots = document.querySelector('meta[name="robots"]')
    if (robots) robots.setAttribute('content', meta.noindex || isAdmin ? 'noindex, nofollow' : 'index, follow')
  }, [pathname])
  return null
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#ff4655] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouterContainer />
    </AuthProvider>
  )
}

function AppRouterContainer() {
  const { user, loading: authLoading } = useAuth()
  const [dbLoaded, setDbLoaded] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [checkingRole, setCheckingRole] = useState(true)

  // 🎯 UNIFIED MAP STATE ENGINE FOR EVERY RESOURCE PAGE ROUTE
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false)
  const [pageGates, setPageGates] = useState({
    home: true,
    subscriptions: true,
    submit: true,
    about: true,
    leaderboard: true,
    predictions: true
  })

  useEffect(() => {
    const bootstrapPlatform = async () => {
      try {
        // Warm-up ping and config download run together (they used to be sequential).
        const [, { data: flags, error: flagError }] = await Promise.all([
          supabase.from('streamers').select('id').limit(1),
          supabase.from('app_settings').select('key, value_bool'),
        ])

        if (flags && !flagError) {
          const maintenanceFlag = flags.find(f => f.key === 'maintenance_mode')
          if (maintenanceFlag) setIsMaintenanceActive(maintenanceFlag.value_bool)

          // Map dynamic database properties to our layout router config state
          setPageGates({
            home: flags.find(f => f.key === 'page_home')?.value_bool ?? true,
            subscriptions: flags.find(f => f.key === 'page_subscriptions')?.value_bool ?? true,
            submit: flags.find(f => f.key === 'page_submit')?.value_bool ?? true,
            about: flags.find(f => f.key === 'page_about')?.value_bool ?? true,
            leaderboard: flags.find(f => f.key === 'page_leaderboard')?.value_bool ?? true,
            predictions: flags.find(f => f.key === 'page_predictions')?.value_bool ?? true,
          })
        }

        setTimeout(() => setDbLoaded(true), introDelay())
      } catch (err) {
        console.error("Platform boot error:", err)
        setDbLoaded(true)
      }
    }
    bootstrapPlatform()
  }, [])

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setUserRole(null)
        setCheckingRole(false)
        return
      }
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        if (data) setUserRole(data.role)
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingRole(false)
      }
    }
    if (!authLoading) fetchUserRole()
  }, [user, authLoading])

  if (!dbLoaded || authLoading || (user && checkingRole)) {
    return <LoadingScreen isAppReady={dbLoaded && !authLoading && !checkingRole} />
  }

  const isAdminUser = userRole === 'admin'

  // overflow-x-clip clips like "hidden" but does NOT turn this div into a scroll container
  // (which silently breaks position: sticky inside it). "hidden" stays as the fallback for
  // older browsers that don't understand "clip".
  return (
    <div className="min-h-screen bg-black w-full overflow-x-hidden overflow-x-clip">
      <BrowserRouter>
        <RouteMeta />
        <Suspense fallback={<RouteFallback />}>
        <Routes>
          
          {/* 🔓 SECURE MANAGEMENT CONTROL CONSOLES */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminGuard><AdminStreamersPage /></AdminGuard>} />
          <Route path="/admin/submissions" element={<AdminGuard><AdminSubmissionsPage /></AdminGuard>} />
          <Route path="/admin/announcements" element={<AdminGuard><AdminAnnouncements /></AdminGuard>} />
          <Route path="/admin/banners" element={<AdminGuard><AdminBannersPage /></AdminGuard>} />  
          <Route path="/admin/settings" element={<AdminGuard><AdminSettingsPage /></AdminGuard>} />  

          {/* 🚨 DYNAMIC INTERCEPT ROUTER ENGINE */}
          {isMaintenanceActive && !isAdminUser ? (
            <>
              <Route path="/" element={<MaintenancePage />} />
              <Route path="/subscriptions" element={<MaintenancePage />} />
              <Route path="/submit" element={<MaintenancePage />} />
              <Route path="/about" element={<MaintenancePage />} />
              <Route path="/leaderboard" element={<MaintenancePage />} />
              <Route path="/predictions" element={<MaintenancePage />} />
              <Route path="/privacy" element={<MaintenancePage />} />
              <Route path="*" element={<MaintenancePage />} />
            </>
          ) : (
            <>
              {/* CONDITIONAL COMPONENT GATEWAY EVALUATIONS */}
              <Route path="/" element={pageGates.home || isAdminUser ? <AllStreamersPage /> : <ComingSoonPage />} />
              <Route path="/streamer/:platform/:handle" element={pageGates.home || isAdminUser ? <StreamerProfilePage /> : <ComingSoonPage />} />
              <Route path="/subscriptions" element={pageGates.subscriptions || isAdminUser ? <MySubscriptionsPage /> : <ComingSoonPage />} />
              <Route path="/submit" element={pageGates.submit || isAdminUser ? <SubmitPage /> : <ComingSoonPage />} />
              <Route path='/about' element={pageGates.about || isAdminUser ? <AboutPage /> : <ComingSoonPage />} />
              <Route path='/leaderboard' element={pageGates.leaderboard || isAdminUser ? <LeaderboardPage /> : <ComingSoonPage />} />
              <Route path='/predictions' element={pageGates.predictions || isAdminUser ? <SubscribedForecastPage /> : <ComingSoonPage />} />
              
              <Route path='/privacy' element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}

        </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  )
}

function AdminGuard({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [role, setRole] = useState(null)
  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    async function checkUserRole() {
      if (!user) { setCheckingRole(false); return; }
      try {
        const { data } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
        if (data) setRole(data.role)
      } catch (err) { console.error(err) }
      finally { setCheckingRole(false) }
    }
    if (!authLoading) checkUserRole()
  }, [user, authLoading])

  if (authLoading || checkingRole) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-xs tracking-widest text-[#ff4655] uppercase">
        <div className="w-5 h-5 border-2 border-[#ff4655] border-t-transparent rounded-full animate-spin mb-3" />
        Checking Access Clearances...
      </div>
    )
  }
  if (!user || role !== 'admin') return <Navigate to="/" replace />
  return children
}

function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-center p-4">
      <h1 className="font-display font-bold text-6xl text-[#ff4655] mb-4">404</h1>
      <p className="text-neutral-400 font-body mb-8">This page does not exist.</p>
      <a href="/" className="bg-[#ff4655] hover:bg-[#e03e4b] text-white px-8 py-3 font-display uppercase tracking-widest text-xs font-black rounded transition-all active:scale-95">
        Back to Home
      </a>
    </div>
  )
}
