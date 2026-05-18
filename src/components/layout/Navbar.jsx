import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (onSearch) onSearch(query)
    navigate(`/?q=${encodeURIComponent(query)}`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-valo-dark/95 backdrop-blur border-b border-valo-border flex items-center px-4 gap-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
        <img
          src="https://iili.io/Bp6m8Xa.png"
          alt="VALO Community"
          className="h-8 w-8 rounded object-contain group-hover:scale-105 transition-transform"
        />
        <span className="hidden sm:block font-display font-bold text-base text-white leading-tight">
          Let's Build<br />
          <span className="text-valo-red text-sm">VALO Community</span>
        </span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search streamers or titles..."
            className="input-field pr-10 h-9 text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-valo-muted hover:text-valo-red transition-colors"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* Right side */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Mobile nav links */}
        <Link
          to="/streamers"
          className="lg:hidden text-valo-muted hover:text-white transition-colors p-2 rounded hover:bg-valo-card"
          title="All Streamers"
        >
          <GridIcon />
        </Link>
        <Link
          to="/submit"
          className="hidden sm:flex valo-btn-ghost text-xs py-1.5 px-3 items-center gap-1.5"
        >
          <PlusIcon />
          Submit
        </Link>
        <Link
          to="/admin/login"
          className="text-valo-muted hover:text-white transition-colors p-2 rounded hover:bg-valo-card"
          title="Admin"
        >
          <ShieldIcon />
        </Link>
      </div>
    </header>
  )
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )
}