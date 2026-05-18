import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/',          label: 'Live Now',       end: true,  icon: <LiveIcon /> },
  { to: '/streamers', label: 'All Streamers',  end: true,  icon: <GridIcon /> },
  { to: '/submit',    label: 'Submit Streamer', end: true,  icon: <SubmitIcon /> },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-valo-dark border-r border-valo-border flex flex-col hidden lg:flex z-40 overflow-y-auto">
      {/* Logo */}
      <div className="p-4 border-b border-valo-border">
        <div className="flex items-center gap-2">
          <img src="https://iili.io/Bp6m8Xa.png" alt="logo" className="h-7 w-7 rounded object-contain" />
          <div className="leading-tight">
            <p className="text-xs text-valo-muted font-display">Let's Build</p>
            <p className="text-xs font-display font-bold text-valo-red tracking-wide">VALO Community</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-all duration-150
               ${isActive
                ? 'bg-valo-red/10 text-valo-red border border-valo-red/20'
                : 'text-valo-muted hover:text-white hover:bg-valo-card'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Platforms */}
      <div className="p-4 border-t border-valo-border space-y-3">
        <p className="text-[10px] text-valo-muted font-display uppercase tracking-widest">Platforms</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/YouTube_2024.svg/500px-YouTube_2024.svg.png" className="h-3.5 object-contain" alt="YouTube" />
            <span className="text-xs text-valo-muted">YouTube Live</span>
          </div>
          <div className="flex items-center gap-2">
            <img src="https://kick.com/img/kick-logo.svg" className="h-3.5 object-contain" alt="Kick" onError={(e) => { e.target.style.display='none' }} />
            <span className="text-xs text-valo-muted">Kick.com</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-valo-border">
        <p className="text-[10px] text-valo-muted text-center leading-relaxed">
          Auto-refreshes every 60s
        </p>
      </div>
    </aside>
  )
}

function LiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}

function SubmitIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}