import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminSignIn } from '../services/authService'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function AdminLoginPage() {
  const { session, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!isLoading && session) return <Navigate to="/admin" replace />

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminSignIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-valo-dark flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-valo-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://iili.io/Bp6m8Xa.png"
            alt="logo"
            className="h-14 w-14 rounded-xl object-contain mx-auto mb-4 border border-valo-border"
          />
          <h1 className="font-display font-bold text-2xl text-white">Admin Login</h1>
          <p className="text-valo-muted text-sm font-body mt-1">Let's Build VALO Community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-valo-card border border-valo-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
             
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-display font-semibold text-valo-muted uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded p-3 text-xs text-red-300 font-body">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="valo-btn w-full py-3 font-display tracking-wider"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-4 text-xs text-valo-muted font-body">
          <a href="/" className="hover:text-valo-red transition-colors">← Back to Public Site</a>
        </p>
      </div>
    </div>
  )
}
