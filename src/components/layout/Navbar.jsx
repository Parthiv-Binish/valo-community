// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-md border-b border-neutral-800 flex items-center px-4 justify-between md:justify-start gap-4 md:gap-6">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img
          src="https://iili.io/C93RwPf.png"
          alt="VALO Community"
          className="h-9 w-auto rounded object-contain" 
        />
        <span className="block font-semibold text-xs sm:text-sm tracking-tight truncate max-w-[180px] sm:max-w-none">
          Let's Build VALO <span className="text-valo-red">Community</span>
        </span>
      </Link>

      {/* Right Side Items Container */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Desktop Links - Hidden completely on mobile viewports */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="text-neutral-400 hover:text-white transition-colors px-3 py-1.5 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            to="/submit"
            className="text-neutral-400 hover:text-white transition-colors px-3 py-1.5 text-sm font-medium"
          >
            Submit
          </Link>
          <Link
            to="/about"
            className="text-neutral-400 hover:text-white transition-colors px-3 py-1.5 text-sm font-medium"
          >
            About
          </Link>
          <Link
            to="/leaderboard"
            className="text-neutral-400 hover:text-white transition-colors px-3 py-1.5 text-sm font-medium"
          >
            Leaderboard
          </Link>
        </div>
<Link
          to="/about"
          className="md:hidden text-neutral-400 hover:text-white transition-colors px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider font-display"
        >
          <AboutIcon/>
        </Link>
        {/* Shield Admin icon stays global */}
        <Link
          to="/admin/login"
          className="text-neutral-500 hover:text-neutral-300 transition-colors p-1.5 ml-1"
          title="Admin"
        >
          <ShieldIcon />
        </Link>
      </div>
    </header>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function AboutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
