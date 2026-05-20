// Navbar.jsx
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-md border-b border-neutral-800 flex items-center px-4 gap-6">
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <img
          src="https://iili.io/C93RwPf.png"
          alt="VALO Community"
          className="h-25 w-20 rounded object-contain"
        />
        <span className="hidden sm:block font-semibold text-sm tracking-tight">
       Let's Build VALO <span className="text-valo-red">Community</span>
        </span>
      </Link>

      <div className="flex items-center gap-1 ml-auto">
      <Link          to="/"
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
          to="/admin/login"
          className="ml-2 text-neutral-500 hover:text-neutral-300 transition-colors p-1.5"
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}