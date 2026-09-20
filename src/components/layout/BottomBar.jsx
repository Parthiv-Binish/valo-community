import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// ── MOBILE NAVIGATION STRUCTURE ─────────────────────────────────────────────
export default function BottomBar() {
  const [showRadialMenu, setShowRadialMenu] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setShowRadialMenu(false)
  }, [location])

  const primaryTabs = [
    { to: '/', label: 'Home', end: true, icon: <HomeIcon /> },
    { to: '/subscriptions', label: 'Followed', end: true, icon: <SubscriptionsIcon /> },
    { to: '/predictions', label: 'Forecast', end: true, icon: <PredictionsIcon /> }
  ]

  const hiddenTabs = [
    { to: '/submit', label: 'Submit', icon: <SubmitIcon /> },
    { to: '/leaderboard', label: 'Rankings', icon: <LeaderboardIcon /> },
    { to: '/predictions', label: 'Radar', icon: <PredictionsIcon /> },
    { to: '/about', label: 'About', icon: <AboutIcon /> },
    { to: '/privacy', label: 'Privacy', icon: <PrivacyIcon /> }
  ]

  // Positions are intentionally compact so the radial menu works on smaller phones.
  const radialOffsets = [
    { x: -88, y: -72 },
    { x: -44, y: -116 },
    { x: 0, y: -132 },
    { x: 44, y: -116 },
    { x: 88, y: -72 }
  ]

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {showRadialMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRadialMenu(false)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[3px] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* VCT Tactical HUD mobile dock */}
      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-50 lg:hidden px-2 sm:px-3 pb-2 sm:pb-3">
        <div className="relative mx-auto max-w-[560px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#070707]/95 shadow-[0_-18px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

          <nav className="grid h-[68px] grid-cols-4 items-stretch">
            {primaryTabs.map((item) => {
              const isCurrentlyActive = location.pathname === item.to

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className="relative flex min-w-0 items-center justify-center no-underline"
                >
                  <motion.div
                    whileTap={{ scale: 0.94 }}
                    className={`relative flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
                      isCurrentlyActive ? 'text-[#ff4655]' : 'text-neutral-500'
                    }`}
                  >
                    {isCurrentlyActive && (
                      <motion.span
                        layoutId="activeTabIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-[#ff4655] shadow-[0_0_12px_rgba(255,70,85,0.75)]"
                      />
                    )}

                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        isCurrentlyActive
                          ? 'bg-[#ff4655]/[0.09] text-[#ff4655]'
                          : 'bg-white/[0.02] text-neutral-500'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span className="relative z-10 truncate px-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                      {item.label}
                    </span>
                  </motion.div>
                </NavLink>
              )
            })}

            <div className="relative flex min-w-0 items-center justify-center">
              <AnimatePresence>
                {showRadialMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16 }}
                    className="absolute bottom-[76px] right-1 w-[190px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#090909]/98 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-2xl"
                  >
                    <div className="mb-1 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                      Navigation // More
                    </div>

                    {hiddenTabs.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-colors hover:bg-white/[0.05]"
                      >
                        <span className="text-neutral-500 transition-colors group-hover:text-[#ff4655]">
                          {item.icon}
                        </span>
                        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-neutral-400 group-hover:text-white">
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setShowRadialMenu(!showRadialMenu)}
                aria-label={showRadialMenu ? 'Close more navigation' : 'Open more navigation'}
                aria-expanded={showRadialMenu}
                className="relative flex h-full w-full items-center justify-center outline-none"
              >
                <motion.div
                  whileTap={{ scale: 0.94 }}
                  className={`relative flex h-full w-full flex-col items-center justify-center gap-1 transition-colors ${
                    showRadialMenu ? 'text-[#ff4655]' : 'text-neutral-500'
                  }`}
                >
                  {showRadialMenu && (
                    <span className="absolute inset-x-3 top-0 h-[2px] rounded-full bg-[#ff4655] shadow-[0_0_12px_rgba(255,70,85,0.75)]" />
                  )}

                  <span
                    className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                      showRadialMenu
                        ? 'bg-[#ff4655]/[0.09] text-[#ff4655]'
                        : 'bg-white/[0.02] text-neutral-500'
                    }`}
                  >
                    <motion.span
                      animate={{ rotate: showRadialMenu ? 45 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                      {showRadialMenu ? <CloseIcon /> : <MoreIcon />}
                    </motion.span>
                  </span>

                  <span className="relative z-10 font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                    More
                  </span>
                </motion.div>
              </button>
            </div>
          </nav>

          <div className="pointer-events-none absolute left-2 top-2 h-2 w-2 border-l border-t border-[#ff4655]/40" />
          <div className="pointer-events-none absolute right-2 top-2 h-2 w-2 border-r border-t border-[#ff4655]/40" />
          <div className="pointer-events-none absolute bottom-2 left-2 h-2 w-2 border-b border-l border-white/[0.12]" />
          <div className="pointer-events-none absolute bottom-2 right-2 h-2 w-2 border-b border-r border-white/[0.12]" />
        </div>
      </div>
              )}
            </AnimatePresence>

            {/* More trigger */}
            <button
              type="button"
              onClick={() => setShowRadialMenu(!showRadialMenu)}
              aria-label={showRadialMenu ? 'Close more navigation' : 'Open more navigation'}
              aria-expanded={showRadialMenu}
              className="relative flex h-full w-full items-center justify-center outline-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`relative flex h-[52px] w-full max-w-[100px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                  showRadialMenu ? 'text-[#ff4655]' : 'text-neutral-500'
                }`}
              >
                <span
                  className={`absolute inset-0 rounded-xl border transition-all ${
                    showRadialMenu
                      ? 'border-[#ff4655]/25 bg-[#ff4655]/[0.08] shadow-[0_0_24px_rgba(255,70,85,0.08)]'
                      : 'border-transparent'
                  }`}
                />

                <motion.span
                  animate={{ rotate: showRadialMenu ? 135 : 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative z-10"
                >
                  {showRadialMenu ? <CloseIcon /> : <MoreIcon />}
                </motion.span>

                <span className="relative z-10 font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                  More
                </span>
              </motion.div>
            </button>
          </div>

          {/* Balanced right-side navigation space.
              Keeps the center control visually centered on all phone widths. */}
          <div className="flex-1" />
        </nav>
      </div>
    </>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SubscriptionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  )
}

function PredictionsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function MoreIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function SubmitIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function AboutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function PrivacyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 4 8 4z" />
    </svg>
  )
}
