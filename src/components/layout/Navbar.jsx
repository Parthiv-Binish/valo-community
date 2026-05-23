import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext' // Double-check this relative path matches your folder tree setup

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // Automatically close the mobile slide-out menu when a user clicks a route link
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const avatarImage = user?.user_metadata?.avatar_url
  const displayName = user?.user_metadata?.full_name

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Subscriptions', path: '/subscriptions' },
    { name: 'Submit', path: '/submit' },
    { name: 'About', path: '/about' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-md border-b border-neutral-800 flex items-center px-4 justify-between gap-4">
        
        {/* LOGO BRAND SECTION */}
        <Link to="/" className="flex items-center gap-2 shrink-0 z-50">
          <img
            src="https://iili.io/C93RwPf.png"
            alt="VALO Community"
            className="h-9 w-auto rounded object-contain" 
          />
          <span className="block font-display font-bold text-sm tracking-wide text-white uppercase">
            VALO <span className="text-[#ff4655]">Community</span>
          </span>
        </Link>

        {/* DESKTOP LINKS - Hidden completely on mobile breakpoints */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 text-sm font-medium font-display tracking-wide uppercase transition-colors rounded ${
                location.pathname === link.path 
                  ? 'text-[#ff4655] bg-white/5' 
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE ACCOUNT ACTIONS INTERFACE */}
        <div className="flex items-center gap-2 ml-auto md:ml-0 z-50">
          
          {/* Shield Admin icon stays global */}
          <Link
            to="/admin/login"
            className="text-neutral-500 hover:text-neutral-300 transition-colors p-1.5"
            title="Admin Dashboard"
          >
            <ShieldIcon />
          </Link>

          <div className="h-4 w-[1px] bg-neutral-800 mx-0.5 hidden xs:block" />

          {/* 🌟 TACTICAL GOOGLE AUTH BADGE CONTAINER */}
          {!user ? (
            // 🔴 SIGNED OUT: Premium Outline Slide-Glow Component
            <button
              onClick={loginWithGoogle}
              className="group relative flex items-center gap-2 overflow-hidden bg-transparent border border-[#ff4655]/40 hover:border-[#ff4655] px-4 py-2 rounded font-display font-black text-xs uppercase tracking-widest text-white transition-all duration-200 active:scale-[0.97]"
            >
              <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-[#ff4655] transition-transform duration-200 ease-out z-0" />
              
              <svg className="w-3.5 h-3.5 fill-current text-[#ff4655] group-hover:text-white transition-colors duration-200 relative z-10" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.427-3.3c-2.2-2.05-5.033-3.302-8.474-3.302-6.623 0-12 5.377-12 12s5.377 12 12 12c6.923 0 11.52-4.864 11.52-11.727 0-.788-.083-1.398-.183-1.926H12.24z"/>
              </svg>
              
              <span className="relative z-10 font-medium tracking-widest transition-colors duration-200 group-hover:text-white">
                Connect <span className="text-[#ff4655] group-hover:text-white font-bold">ID</span>
              </span>
            </button>
          ) : (
            // 🟢 SIGNED IN: Cyber-Grid Dashboard Profile Panel
            <div className="flex items-center gap-2.5 bg-neutral-950 border border-neutral-800 rounded px-2 py-1 h-9 shadow-lg shadow-black/40 relative group">
              {/* Active Session Neon Status Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>

              {/* Avatar Frame with Border Clip */}
              <div className="relative shrink-0 select-none">
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt="" 
                    className="w-6 h-6 rounded object-cover border border-neutral-700 group-hover:border-[#ff4655] transition-colors" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-6 h-6 rounded bg-[#ff4655] flex items-center justify-center text-[11px] font-black text-white font-mono">
                    {displayName?.charAt(0)}
                  </div>
                )}
              </div>

              {/* User Identity String Output */}
              <div className="hidden xs:flex flex-col justify-center min-w-[60px] max-w-[100px]">
                <span className="text-neutral-200 text-[11px] font-bold tracking-wide font-display uppercase truncate leading-tight group-hover:text-white transition-colors">
                  {displayName?.split(' ')[0]}
                </span>
                <span className="text-[9px] text-neutral-500 font-mono tracking-tight leading-none">
                  AGENT_AUTH
                </span>
              </div>

              {/* Tactical Exit Node Button */}
              <button 
                onClick={logout}
                className="text-[10px] font-mono font-bold text-neutral-600 hover:text-[#ff4655] bg-neutral-900/40 hover:bg-[#ff4655]/10 border border-neutral-800/60 hover:border-[#ff4655]/30 rounded px-1.5 py-0.5 ml-1 transition-all duration-150"
                title="Terminate Session"
              >
                ESC
              </button>
            </div>
          )}

          {/* MOBILE RESPONSIVE HAMBURGER TRIGGER */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-400 hover:text-white transition-colors p-2 z-50 focus:outline-none"
            aria-label="Toggle navigation drawer menu"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* 📱 MOBILE RESPONSIVE SLIDE-OVERLAY MENU DRAWER */}
      <div
        className={`fixed inset-x-0 top-0 bg-black/95 backdrop-blur-lg border-b border-neutral-800 z-40 px-4 pt-20 pb-6 space-y-3 transition-all duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`w-full py-3 px-4 font-display font-bold uppercase text-sm tracking-widest text-center border rounded transition-all active:scale-[0.99] ${
              location.pathname === link.path
                ? 'bg-[#ff4655]/10 text-[#ff4655] border-[#ff4655]/30'
                : 'bg-neutral-900/40 text-neutral-300 border-neutral-800 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </>
  )
}

// =========================================================
// VECTOR GRAPHICS INTERFACE ASSETS (SVGs)
// =========================================================
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
