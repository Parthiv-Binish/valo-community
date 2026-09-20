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
    { to: '/subscriptions', label: 'Followed', end: true, icon: <SubscriptionsIcon /> }
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

      {/* Mobile dock */}
      <div className="safe-bottom fixed bottom-0 left-0 right-0 z-50 h-[68px] border-t border-white/[0.08] bg-[#070707]/95 px-2 shadow-[0_-12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl lg:hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/40 to-transparent" />

        <nav className="relative flex h-full w-full items-center">
          {primaryTabs.map((item) => {
            const isCurrentlyActive = location.pathname === item.to

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="relative z-10 flex h-full flex-1 items-center justify-center no-underline"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative flex h-[52px] w-full max-w-[100px] flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                    isCurrentlyActive ? 'text-[#ff4655]' : 'text-neutral-500'
                  }`}
                >
                  {isCurrentlyActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/[0.07] shadow-[0_0_24px_rgba(255,70,85,0.07)]"
                    />
                  )}

                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-mono text-[8px] font-bold uppercase tracking-[0.12em]">
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            )
          })}

          {/* Radial menu */}
          <div className="relative z-10 flex h-full flex-1 items-center justify-center">
            <AnimatePresence>
              {showRadialMenu && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {hiddenTabs.map((item, index) => {
                    const offset = radialOffsets[index] || { x: 0, y: -90 }

                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          x: offset.x,
                          y: offset.y
                        }}
                        exit={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 20,
                          delay: index * 0.025
                        }}
                        className="pointer-events-auto absolute"
                      >
                        <Link
                          to={item.to}
                          className="group relative flex h-12 w-12 flex-col items-center justify-center rounded-2xl border border-white/[0.1] bg-[#0b0b0b]/95 text-neutral-400 shadow-2xl backdrop-blur-xl transition-all active:scale-95 hover:border-[#ff4655]/30 hover:text-white"
                        >
                          <span className="absolute inset-[2px] rounded-[14px] border border-white/[0.03] bg-white/[0.02]" />
                          <span className="relative z-10">{item.icon}</span>
                          <span className="absolute -bottom-5 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider text-neutral-400">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    )
                  })}
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
