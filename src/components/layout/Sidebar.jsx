import { NavLink } from 'react-router-dom'

// ── CATEGORIZED NAVIGATION STRUCTURE ─────────────────────────────────────────
const navigationMatrix = [
  {
    category: 'Discover',
    items: [
      { to: '/', label: 'All Streamers', end: true, icon: <HomeIcon /> },
      { to: '/subscriptions', label: 'My Subscriptions', end: true, icon: <SubscriptionsIcon /> },
    ]
  },
  {
    category: 'Analytics & Tools',
    items: [
      { to: '/predictions', label: 'Radar Forecast', end: true, icon: <PredictionsIcon /> },
      { to: '/leaderboard', label: 'Leaderboard', end: true, icon: <LeaderboardIcon /> },
      { to: '/submit', label: 'Submit Streamer', end: true, icon: <SubmitIcon /> },
    ]
  },
  {
    category: 'System Info',
    items: [
      { to: '/about', label: 'About App', end: true, icon: <AboutIcon /> },
      { to: '/privacy', label: 'Privacy Policy', end: true, icon: <PrivacyIcon /> }
    ]
  }
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 bottom-0 z-40 hidden w-56 select-none flex-col border-r border-white/[0.06] bg-[#070707]/95 backdrop-blur-xl lg:flex">
      {/* Subtle vertical HUD accent */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-gradient-to-b from-[#ff4655]/35 via-transparent to-transparent" />

      {/* Navigation */}
      <div className="no-scrollbar mt-2 flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {navigationMatrix.map((section) => (
          <div key={section.category} className="space-y-2">
            <div className="flex items-center gap-2 px-3">
              <span className="h-px w-3 bg-[#ff4655]/50" />
              <h3 className="font-mono text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600">
                {section.category}
              </h3>
            </div>

            <nav className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 overflow-hidden rounded-xl border px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-[0.08em] transition-all duration-200
                    ${
                      isActive
                        ? 'border-[#ff4655]/25 bg-[#ff4655]/10 text-[#ff4655] shadow-[inset_3px_0_0_#ff4655]'
                        : 'border-transparent bg-transparent text-neutral-500 hover:border-white/[0.06] hover:bg-white/[0.035] hover:text-neutral-200'
                    }`
                  }
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                      'group-hover:scale-105'
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="truncate">{item.label}</span>

                  <span className="ml-auto h-1 w-1 shrink-0 rounded-full bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-40" />
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Platform status panel */}
      <div className="border-t border-white/[0.06] bg-white/[0.015] p-4">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-neutral-600">
            Supported Platforms
          </span>
          <span className="flex items-center gap-1 font-mono text-[7px] uppercase tracking-widest text-emerald-500/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Ready
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex h-9 items-center rounded-lg border border-white/[0.06] bg-black/40 px-3 transition-colors hover:border-white/[0.1]">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930"
              alt="YouTube Live"
              className="h-3 w-auto object-contain opacity-80"
            />
          </div>

          <div className="flex h-9 items-center rounded-lg border border-white/[0.06] bg-black/40 px-3 transition-colors hover:border-white/[0.1]">
            <img
              src="https://kick.com/img/kick-logo.svg"
              alt="Kick Streaming"
              className="h-3.5 w-auto object-contain opacity-80"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SubscriptionsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  )
}

function SubmitIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function AboutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function PredictionsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function PrivacyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 4 8 4z" />
    </svg>
  )
}
