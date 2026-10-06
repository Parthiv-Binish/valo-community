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
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage.jsx'))
const StreamerProfilePage = lazy(() => import('./pages/StreamerProfilePage'))
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage.jsx'))
const AdminStreamersPage = lazy(() => import('./admin/pages/AdminStreamersPage.jsx'))
const AdminSubmissionsPage = lazy(() => import('./admin/pages/AdminSubmissionsPage.jsx'))
const AdminAnnouncements = lazy(() => import('./admin/pages/AdminAnnouncements.jsx'))
const AdminBannersPage = lazy(() => import('./admin/pages/AdminBannersPage.jsx'))
const AdminSettingsPage = lazy(() => import('./admin/pages/AdminSettingsPage.jsx'))
const AdminUsersPage = lazy(() => import('./admin/pages/AdminUsersPage.jsx'))
const AdminAnalyticsPage = lazy(() => import('./admin/pages/AdminAnalyticsPage.jsx'))
const AdminReportsPage = lazy(() => import('./admin/pages/AdminReportsPage.jsx'))
const AdminPostsPage = lazy(() => import('./admin/pages/AdminPostsPage.jsx'))
const AdminApiStatusPage = lazy(() => import('./admin/pages/AdminApiStatusPage.jsx'))
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'))
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage.jsx'))
const ContentPolicyPage = lazy(() => import('./pages/ContentPolicyPage.jsx'))
const HelpPage = lazy(() => import('./pages/HelpPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const DeleteAccountPage = lazy(() => import('./pages/DeleteAccountPage.jsx'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.jsx'))
const PostsPage = lazy(() => import('./pages/PostsPage.jsx'))
const CreatePostPage = lazy(() => import('./pages/CreatePostPage.jsx'))
const PostDetailPage = lazy(() => import('./pages/PostDetailPage.jsx'))
const ReportPage = lazy(() => import('./pages/ReportPage.jsx'))
const BookmarksPage = lazy(() => import('./pages/BookmarksPage.jsx'))
const FollowingPage = lazy(() => import('./pages/FollowingPage.jsx'))
const StatusPage = lazy(() => import('./pages/StatusPage.jsx'))

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
  '/cookies': { title: `Cookie Policy | ${SITE}` },
  '/terms': { title: `Terms & Conditions | ${SITE}` },
  '/community-guidelines': { title: `Community Guidelines | ${SITE}` },
  '/content-policy': { title: `Content Policy | ${SITE}` },
  '/help': { title: `Help Center | ${SITE}` },
  '/contact': { title: `Contact | ${SITE}` },
  '/posts': { title: `Community | ${SITE}` },
  '/posts/create': { title: `Create Post | ${SITE}`, noindex: true },
  '/notifications': { title: `Notifications | ${SITE}`, noindex: true },
  '/profile': { title: `My Profile | ${SITE}`, noindex: true },
  '/settings': { title: `Settings | ${SITE}`, noindex: true },
  '/account/delete': { title: `Delete Account | ${SITE}`, noindex: true },
  '/bookmarks': { title: `Saved Posts | ${SITE}`, noindex: true },
  '/following': { title: `Following | ${SITE}`, noindex: true },
  '/report': { title: `Report Content | ${SITE}`, noindex: true },
  '/status': { title: `System Status | ${SITE}` },
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
          <Route path="/admin/users" element={<AdminGuard><AdminUsersPage /></AdminGuard>} />
          <Route path="/admin/analytics" element={<AdminGuard><AdminAnalyticsPage /></AdminGuard>} />
          <Route path="/admin/reports" element={<AdminGuard><AdminReportsPage /></AdminGuard>} />
          <Route path="/admin/posts" element={<AdminGuard><AdminPostsPage /></AdminGuard>} />
          <Route path="/admin/api-status" element={<AdminGuard><AdminApiStatusPage /></AdminGuard>} />  

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
              <Route path='/cookies' element={<CookiePolicyPage />} />
              <Route path='/terms' element={<TermsPage />} />
              <Route path='/community-guidelines' element={<CommunityGuidelinesPage />} />
              <Route path='/content-policy' element={<ContentPolicyPage />} />
              <Route path='/help' element={<HelpPage />} />
              <Route path='/contact' element={<ContactPage />} />
              <Route path='/profile' element={<ProfilePage />} />
              <Route path='/profile/:id' element={<UserProfilePage />} />
              <Route path='/settings' element={<SettingsPage />} />
              <Route path='/account/delete' element={<DeleteAccountPage />} />
              <Route path='/notifications' element={<NotificationsPage />} />
              <Route path='/posts' element={<PostsPage />} />
              <Route path='/posts/create' element={<CreatePostPage />} />
              <Route path='/posts/:id' element={<PostDetailPage />} />
              <Route path='/report' element={<ReportPage />} />
              <Route path='/bookmarks' element={<BookmarksPage />} />
              <Route path='/following' element={<FollowingPage />} />
              <Route path='/status' element={<StatusPage />} />
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
    <div className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[75vh] max-w-xl items-center justify-center">
        <div className="relative w-full overflow-hidden rounded-[28px] border border-white/[.08] bg-[#0b0b10] p-7 text-center shadow-2xl sm:p-10">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl"/>
          <p className="relative font-mono text-[9px] font-bold uppercase tracking-[.28em] text-[#ff4655]">VALO COMMUNITY / SIGNAL LOST</p>
          <h1 className="relative mt-3 font-display text-7xl font-black tracking-tight text-white sm:text-8xl">404</h1>
          <p className="relative mt-3 text-sm leading-6 text-neutral-500">This page doesn't exist or the link is no longer available.</p>
          <div className="relative mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <a href="/" className="rounded-xl bg-[#ff4655] px-5 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#ff5967]">Back to Live</a>
            <a href="/posts" className="rounded-xl border border-white/10 px-5 py-3 text-xs font-black uppercase tracking-wider text-neutral-300 hover:bg-white/[.04]">Community</a>
          </div>
        </div>
      </div>
    </div>
  )
}
