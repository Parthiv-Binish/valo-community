import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const primaryLinks = [
  { name: 'Home', path: '/', end: true },
  { name: 'Followed', path: '/subscriptions', end: true },
  { name: 'Forecast', path: '/predictions', end: true },
  { name: 'Rankings', path: '/leaderboard', end: true },
]

const secondaryLinks = [
  { name: 'Submit Streamer', path: '/submit' },
  { name: 'About', path: '/about' },
  { name: 'Privacy', path: '/privacy' },
]

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
    setMoreOpen(false)
  }, [location])

  const avatarImage = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name
  const isSecondaryActive = secondaryLinks.some(
    (link) => location.pathname === link.path
  )

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-14 sm:h-16 border-b border-white/[0.07] bg-[#060606]/92 backdrop-blur-2xl">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/55 to-transparent" />

        <div className="mx-auto flex h-full w-full max-w-[1800px] items-center gap-3 px-3 sm:px-5 lg:px-7">
          {/* Brand */}
          <Link
            to="/"
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="VALO Community Home"
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-xl bg-[#ff4655]/10 blur-lg opacity-70 transition-opacity group-hover:opacity-100" />
              <img
                src="https://iili.io/C93RwPf.png"
                alt="VALO Community"
                className="relative h-8 w-auto rounded-md object-contain sm:h-9"
              />
            </div>

            <div className="hidden xl:block">
              <div className="font-display text-[11px] font-black uppercase tracking-[0.18em] leading-none text-white">
                LET'S BUILD VALO
              </div>
              <div className="mt-1 font-display text-[9px] font-black uppercase tracking-[0.2em] leading-none text-[#ff4655]">
                Community
              </div>
            </div>
          </Link>

          <div className="hidden h-6 w-px bg-white/[0.08] md:block" />

          {/* Main navigation replaces the sidebar */}
          <nav className="hidden min-w-0 flex-1 items-center gap-1 md:flex">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `relative flex h-9 items-center rounded-lg px-3.5 font-display text-[9px] font-black uppercase tracking-[0.12em] transition-all lg:px-4 ${
                    isActive
                      ? 'bg-[#ff4655]/10 text-[#ff4655]'
                      : 'text-neutral-500 hover:bg-white/[0.04] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-px w-5 -translate-x-1/2 bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((value) => !value)}
                className={`flex h-9 items-center gap-1.5 rounded-lg px-3.5 font-display text-[9px] font-black uppercase tracking-[0.12em] transition-all lg:px-4 ${
                  isSecondaryActive || moreOpen
                    ? 'bg-white/[0.05] text-white'
                    : 'text-neutral-500 hover:bg-white/[0.04] hover:text-white'
                }`}
                aria-expanded={moreOpen}
              >
                More
                <ChevronIcon open={moreOpen} />
              </button>

              {moreOpen && (
                <div className="absolute left-0 top-[calc(100%+9px)] w-48 overflow-hidden rounded-xl border border-white/[0.08] bg-[#090909]/96 p-1.5 shadow-2xl backdrop-blur-2xl">
                  {secondaryLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center rounded-lg px-3 py-2.5 font-display text-[9px] font-black uppercase tracking-[0.1em] transition-colors ${
                          isActive
                            ? 'bg-[#ff4655]/10 text-[#ff4655]'
                            : 'text-neutral-400 hover:bg-white/[0.05] hover:text-white'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Compact online indicator */}
          <div className="ml-auto hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 lg:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4655] opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff4655]" />
            </span>
            <span className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-neutral-500">
              Network Live
            </span>
          </div>

          {/* Account */}
          <Link
            to="/admin/login"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-transparent text-neutral-600 transition-all hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-neutral-200 sm:flex"
            title="Admin Dashboard"
            aria-label="Admin Dashboard"
          >
            <ShieldIcon />
          </Link>

          <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

          {!user ? (
            <button
              onClick={loginWithGoogle}
              className="group relative flex h-9 shrink-0 items-center gap-2 overflow-hidden rounded-lg border border-[#ff4655]/35 bg-[#ff4655]/[0.04] px-3 text-[9px] font-black uppercase tracking-[0.13em] text-white transition-all hover:border-[#ff4655]/80 hover:bg-[#ff4655]/10 active:scale-[0.97]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#ff4655]/15 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              <svg className="relative z-10 h-3.5 w-3.5 fill-current text-[#ff4655]" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.427-3.3c-2.2-2.05-5.033-3.302-8.474-3.302-6.623 0-12 5.377-12 12s5.377 12 12 12c6.923 0 11.52-4.864 11.52-11.727 0-.788-.083-1.398-.183-1.926H12.24z" />
              </svg>
              <span className="relative z-10">
                Connect <span className="text-[#ff4655]">ID</span>
              </span>
            </button>
          ) : (
            <div className="group relative flex h-9 shrink-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-1.5 sm:px-2">
              <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt=""
                  className="h-6 w-6 rounded-md border border-white/10 object-cover transition-colors group-hover:border-[#ff4655]/50"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff4655] font-mono text-[10px] font-black text-white">
                  {displayName?.charAt(0)}
                </div>
              )}

              <div className="hidden max-w-[85px] flex-col justify-center sm:flex">
                <span className="truncate font-display text-[9px] font-bold uppercase tracking-[0.1em] leading-tight text-neutral-200">
                  {displayName?.split(' ')[0]}
                </span>
                <span className="mt-0.5 font-mono text-[7px] uppercase tracking-widest text-emerald-400">
                  Connected
                </span>
              </div>

              <button
                onClick={logout}
                className="rounded-md border border-white/[0.06] bg-black/30 px-1.5 py-1 font-mono text-[8px] font-bold text-neutral-500 transition-all hover:border-[#ff4655]/30 hover:bg-[#ff4655]/10 hover:text-[#ff4655]"
                title="Terminate Session"
              >
                ESC
              </button>
            </div>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-neutral-400 transition-all hover:border-[#ff4655]/30 hover:bg-[#ff4655]/5 hover:text-white md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div
        className={`fixed inset-x-0 top-14 z-40 border-b border-white/[0.08] bg-[#080808]/96 px-3 pb-4 pt-3 shadow-2xl backdrop-blur-2xl transition-all duration-300 sm:top-16 md:hidden ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-3 pointer-events-none opacity-0'
        }`}
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <div>
            <p className="font-mono text-[8px] font-bold uppercase tracking-[0.22em] text-[#ff4655]">
              Navigation
            </p>
            <p className="mt-1 font-display text-xs font-black uppercase tracking-wider text-white">
              VALO Community
            </p>
          </div>

          <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[7px] uppercase tracking-widest text-neutral-500">
            {primaryLinks.length + secondaryLinks.length} routes
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[...primaryLinks, ...secondaryLinks].map((link) => {
            const isActive = location.pathname === link.path

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`group relative overflow-hidden rounded-xl border px-3 py-3 text-left transition-all active:scale-[0.98] ${
                  isActive
                    ? 'border-[#ff4655]/35 bg-[#ff4655]/10 text-[#ff4655]'
                    : 'border-white/[0.06] bg-white/[0.025] text-neutral-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-0.5 ${
                    isActive ? 'bg-[#ff4655]' : 'bg-transparent'
                  }`}
                />
                <span className="block font-display text-[9px] font-black uppercase tracking-[0.12em]">
                  {link.name}
                </span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-widest text-neutral-600">
                  {isActive ? 'ACTIVE' : 'OPEN'}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

function MenuIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6-8 10-8 10z" />
    </svg>
  )
}
