import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function BottomBar() {
  const [showRadialMenu, setShowRadialMenu] = useState(false)
  const location = useLocation()

  // Auto-collapse radial menu when navigating away
  useEffect(() => {
    setShowRadialMenu(false)
  }, [location])

  // Primary persistent bottom action items
  const primaryTabs = [
    { to: '/', label: 'Home', end: true, icon: <HomeIcon /> },
    { to: '/subscriptions', label: 'Followed', end: true, icon: <SubscriptionsIcon /> },
  ]

  // Overflow array designed to fan out symmetrically over the navigation bar
  const hiddenTabs = [
    { to: '/submit', label: 'Submit', icon: <SubmitIcon /> },
    { to: '/leaderboard', label: 'Rankings', icon: <LeaderboardIcon /> },
    { to: '/about', label: 'About', icon: <AboutIcon /> },
    { to: '/privacy', label: 'Privacy', icon: <PrivacyIcon /> }
  ]

  //Symmetric coordinate multipliers for radial distribution offsets
  const radialOffsets = [
    { x: -75, y: -75 }, // Submit (Top Left)
    { x: -30, y: -115 }, // Rankings (Top Center-Left)
    { x: 30, y: -115 },  // About (Top Center-Right)
    { x: 75, y: -75 }   // Privacy (Top Right)
  ]

  return (
    <>
      {/* SCREEN BACKDROP DIMMING FILTER */}
      <AnimatePresence>
        {showRadialMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRadialMenu(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* CORE FOOTER DOCK INTERFACE */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black via-black/95 to-neutral-950/90 border-t border-neutral-900/80 flex lg:hidden z-50 px-2 safe-bottom select-none">
        <nav className="flex w-full items-center justify-between relative">
          
          {/* PRIMARY APP NAVLINKS WITH DYNAMIC GLOW CAPSULES */}
          {primaryTabs.map((item) => {
            const isCurrentlyActive = location.pathname === item.to
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative z-10 no-underline"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center justify-center w-full h-full relative transition-colors duration-150 ${
                    isCurrentlyActive ? 'text-[#ff4655]' : 'text-neutral-500'
                  }`}
                >
                  {/* Active Link Sliding Spring Pill */}
                  {isCurrentlyActive && (
                    <motion.span
                      layoutId="activeTabIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-x-2.5 top-2 bottom-2 bg-gradient-to-b from-[#ff4655]/10 to-[#ff4655]/5 border-t border-[#ff4655]/20 rounded-xl -z-10 shadow-[0_0_15px_rgba(255,70,85,0.05)]"
                    />
                  )}
                  <div className="shrink-0 scale-105 mb-0.5">{item.icon}</div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-tight">{item.label}</span>
                </motion.div>
              </NavLink>
            )
          })}

          {/* GEOMETRIC EXPANDING RADIAL MENU DOCK */}
          <div className="flex-1 h-full flex items-center justify-center relative z-10">
            
            {/* RADIAL LINK HOVERS CONTAINER */}
            <AnimatePresence>
              {showRadialMenu && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {hiddenTabs.map((item, index) => {
                    const offset = radialOffsets[index] || { x: 0, y: -80 }
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, scale: 1, x: offset.x, y: offset.y }}
                        exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: index * 0.02 }}
                        className="absolute pointer-events-auto"
                      >
                        <Link
                          to={item.to}
                          className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800/80 shadow-2xl text-neutral-400 hover:text-white active:bg-neutral-800 transition-colors group relative"
                        >
                          {/* Inner glowing core trace matching active link layout styles */}
                          <div className="absolute inset-[2px] rounded-full bg-neutral-950 -z-10 group-active:bg-neutral-900" />
                          <div className="scale-105">{item.icon}</div>
                          
                          {/* Floating Micro Labels under geometric ring nodes */}
                          <span className="absolute -bottom-4 font-mono text-[7px] font-bold uppercase tracking-wider text-neutral-500 scale-90 select-none whitespace-nowrap pointer-events-none bg-black/40 px-1 rounded">
                            {item.label}
                          </span>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </AnimatePresence>

            {/* MAIN RADIAL CORE TRIGGER TOGGLE */}
            <button
              onClick={() => setShowRadialMenu(!showRadialMenu)}
              className="flex flex-col items-center justify-center w-full h-full focus:outline-none relative"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  showRadialMenu ? 'text-[#ff4655]' : 'text-neutral-500'
                }`}
              >
                {showRadialMenu && (
                  <div className="absolute inset-x-2.5 top-2 bottom-2 bg-neutral-900/50 border border-neutral-800 rounded-xl -z-10 animate-fade-in" />
                )}
                
                <motion.div
                  animate={{ rotate: showRadialMenu ? 135 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="shrink-0 mb-0.5"
                >
                  {/* Seamless cross-morphing center utility trigger button */}
                  {showRadialMenu ? <CloseIcon /> : <MoreIcon />}
                </motion.div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-tight">More</span>
              </motion.div>
            </button>

          </div>

        </nav>
      </div>
    </>
  )
}

// ── FIXED SYNCED SVG ICON CORE GRAPHICS INTERFACES ───────────────────────────────────
function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SubscriptionsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
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
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function AboutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
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
