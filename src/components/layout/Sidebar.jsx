// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'All Streamers', end: true, icon: <HomeIcon /> },
  { to: '/submit', label: 'Submit Streamer', end: true, icon: <SubmitIcon /> },
  { to: '/about', label: 'About', end: true, icon: <AboutIcon /> },
  { to: '/leaderboard', label: 'Leaderboard', end: true, icon: <LeaderboardIcon /> },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-black border-r border-neutral-800 flex flex-col hidden lg:flex z-40">
      <nav className="flex-1 p-3 space-y-0.5 mt-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150
               ${isActive
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-neutral-800 space-y-3">
        <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Platforms</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930" className="h-3.5 object-contain" alt="YouTube" />
            <span className="text-xs text-neutral-500">YouTube Live</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://kick.com/img/kick-logo.svg" className="h-3.5 object-contain" alt="Kick" onError={(e) => { e.target.style.display='none' }} />
            <span className="text-xs text-neutral-500">Kick.com</span>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-neutral-800">
        <p className="text-[10px] text-neutral-600 text-center">Updates every 60s</p>
      </div>
    </aside>
  )
}

function SubmitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function AboutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="12" x2="12" y2="16" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function LeaderboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}
