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
      { to: '/predictions', label: 'Radar Forecasts', end: true, icon: <PredictionsIcon /> },
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
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-black border-r border-neutral-900 flex flex-col hidden lg:flex z-40 select-none justify-between">
      
      {/* PRIMARY NAVIGATION LOOP BY CATEGORY */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-5 mt-2">
        {navigationMatrix.map((section) => (
          <div key={section.category} className="space-y-1">
            {/* Category Subtitle Header */}
            <h3 className="px-3.5 text-[9px] font-mono font-black text-neutral-500 uppercase tracking-widest select-none">
              {section.category}
            </h3>
            
            {/* Category Navigation Items */}
            <nav className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-150 border group
                     ${isActive
                      ? 'bg-[#ff4655]/10 border-[#ff4655]/20 text-[#ff4655] font-black'
                      : 'bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/40'
                     }`
                  }
                >
                  <span className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* SUPPORTED PLATFORMS FOOTER PANEL */}
      <div className="p-4 border-t border-neutral-900/60 bg-neutral-950/20 space-y-2.5">
        <div className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold px-1">
          Supported Platforms
        </div>

        <div className="space-y-1.5 font-mono text-[10px] text-neutral-300 font-bold uppercase tracking-wide">
          {/* YOUTUBE BRAND ROW */}
          <div className="flex items-center px-3 py-2 bg-neutral-950 border border-neutral-900/60 rounded-lg h-9">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930" 
              alt="YouTube Live"
              className="h-3 w-auto object-contain brightness-95"
            />
          </div>

          {/* KICK BRAND ROW */}
          <div className="flex items-center px-3 py-2 bg-neutral-950 border border-neutral-900/60 rounded-lg h-9">
            <img 
              src="https://kick.com/img/kick-logo.svg" 
              alt="Kick Streaming"
              className="h-3.5 w-auto object-contain"
            />
          </div>
        </div>
      </div>

    </aside>
  )
}

// ── NAVIGATIONAL VECTOR GRAPHICS ─────────────────────────────────────────────────────
function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
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

// Fixed minor typographic typo in paths from previous build for crisp line execution
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
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
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
