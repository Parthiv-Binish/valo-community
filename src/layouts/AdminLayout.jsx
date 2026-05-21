import { Link, useNavigate, NavLink } from 'react-router-dom'
import { adminSignOut } from '../services/authService'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await adminSignOut()
    navigate('/admin/login')
  }

  const navItems = [
    { to: '/admin', label: 'Streamers', end: true },
    { to: '/admin/submissions', label: 'Submissions' },
    { to: '/admin/announcements', label: 'Announcements' }, // 👈 Added Announcements view link
  ]

  return (
    <div className="min-h-screen bg-valo-dark flex flex-col">
      {/* Admin Navbar */}
      <header className="h-14 bg-valo-card border-b border-valo-border flex items-center px-6 gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="https://iili.io/Bp6m8Xa.png" alt="logo" className="h-7 w-7 rounded object-contain" />
          <div className="leading-tight">
            <p className="text-[10px] text-valo-muted font-display">Admin Panel</p>
            <p className="text-xs font-display font-bold text-valo-red">VALO Community</p>
          </div>
        </Link>

        <nav className="flex gap-1 ml-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded text-sm font-display font-semibold transition-colors
                 ${isActive ? 'bg-valo-red text-white' : 'text-valo-muted hover:text-white hover:bg-valo-border'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link to="/" className="text-xs text-valo-muted hover:text-white transition-colors">
            ← Public Site
          </Link>
          <button
            onClick={handleSignOut}
            className="valo-btn-ghost text-xs py-1.5 px-3"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
