// src/components/layout/BottomBar.jsx
import { NavLink } from 'react-router-dom'

const mobileNavItems = [
  { to: '/', label: 'Home', end: true, icon: <HomeIcon /> },
  { to: '/subscriptions', label: 'Subscriptions', end: true, icon: <SubscriptionsIcon /> },
  { to: '/submit', label: 'Submit', end: true, icon: <SubmitIcon /> },
  { to: '/leaderboard', label: 'Leaderboard', end: true, icon: <LeaderboardIcon /> },
]

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-t border-neutral-800 flex lg:hidden z-50 px-2 safe-bottom">
      <nav className="flex w-full items-center justify-around">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 w-20 h-full text-[11px] font-medium transition-all duration-150
               ${isActive ? 'text-valo-red font-semibold' : 'text-neutral-400'}`
            }
          >
            <div className="shrink-0">{item.icon}</div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

function SubmitIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5v14" />
    </svg>
  )
}


function LeaderboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}
function SubscriptionsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}
