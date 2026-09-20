import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const avatarImage = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name

  const mobileNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Submit', path: '/submit' },
    { name: 'About', path: '/about' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Radar Forecast', path: '/predictions' },
    { name: 'Privacy Policy', path: '/privacy' }
  ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-14 sm:h-16 border-b border-white/[0.07] bg-[#070707]/90 backdrop-blur-xl">
        <div className="relative mx-auto flex h-full w-full max-w-[1800px] items-center justify-between px-3 sm:px-5 lg:px-7">
          {/* Subtle esports HUD accent */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/50 to-transparent opacity-70" />

          {/* Brand */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
            aria-label="VALO Community Home"
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-lg bg-[#ff4655]/10 blur-md transition-opacity group-hover:opacity-100 opacity-60" />
              <img
                src="https://iili.io/C93RwPf.png"
                alt="VALO Community"
                className="relative h-8 w-auto rounded-md object-contain sm:h-9"
              />
            </div>

            <div className="hidden min-w-0 sm:block">
              <div className="font-display text-[11px] font-black uppercase tracking-[0.18em] text-white leading-none">
                LET'S BUILD VALO
              </div>
              <div className="mt-1 font-display text-[9px] font-black uppercase tracking-[0.2em] text-[#ff4655] leading-none">
                Community
              </div>
            </div>
          </Link>

          {/* Desktop navigation — intentionally lightweight so existing Sidebar remains the primary nav */}
          <div className="hidden md:flex items-center gap-1">
            <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.025] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff4655] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#ff4655]" />
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Community Online
              </span>
            </div>
          </div>

          {/* Account / controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <Link
              to="/admin/login"
              className="group flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-neutral-500 transition-all duration-200 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-neutral-200"
              title="Admin Dashboard"
              aria-label="Admin Dashboard"
            >
              <ShieldIcon />
            </Link>

            <div className="hidden h-5 w-px bg-white/[0.08] sm:block" />

            {!user ? (
              <button
                onClick={loginWithGoogle}
                className="group relative flex h-9 items-center gap-2 overflow-hidden rounded-lg border border-[#ff4655]/35 bg-[#ff4655]/[0.04] px-3 text-[9px] font-black uppercase tracking-[0.16em] text-white transition-all duration-200 hover:border-[#ff4655]/80 hover:bg-[#ff4655]/10 active:scale-[0.97]"
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
              <div className="group relative flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-1.5 sm:px-2">
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
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff4655] text-[10px] font-black text-white font-mono">
                    {displayName?.charAt(0)}
                  </div>
                )}

                <div className="hidden max-w-[90px] flex-col justify-center sm:flex">
                  <span className="truncate font-display text-[9px] font-bold uppercase tracking-[0.1em] leading-tight text-neutral-200 group-hover:text-white">
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

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.025] text-neutral-400 transition-all hover:border-[#ff4655]/30 hover:bg-[#ff4655]/5 hover:text-white md:hidden"
              aria-label="Toggle navigation drawer menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div
        className={`fixed inset-x-0 top-14 z-40 border-b border-white/[0.08] bg-[#080808]/95 px-3 pb-4 pt-3 shadow-2xl backdrop-blur-2xl transition-all duration-300 ease-out sm:top-16 md:hidden ${
          isOpen
            ? 'translate-y-0 opacity-100'
            : '-translate-y-3 opacity-0 pointer-events-none'
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
            Menu
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {mobileNavLinks.map((link) => {
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
                  className={`absolute left-0 top-0 h-full w-0.5 transition-colors ${
                    isActive ? 'bg-[#ff4655]' : 'bg-transparent'
                  }`}
                />
                <span className="block font-display text-[9px] font-black uppercase tracking-[0.12em]">
                  {link.name}
                </span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-widest text-neutral-600 group-hover:text-neutral-500">
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

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
