import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const PENDING_FOLLOW_KEY = 'valo_pending_follow'

export default function NotifyButton({ streamerId }) {
  const { user, loginWithGoogle } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // ── Verify subscription state ───────────────────────────────────────────
  useEffect(() => {
    async function checkSubscription() {
      if (!user || !streamerId || streamerId === 'undefined') return

      try {
        const { data, error } = await supabase
          .from('stream_subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId)
          .maybeSingle()

        if (data && !error) {
          setIsSubscribed(true)
        } else {
          setIsSubscribed(false)

          let pending = null
          try {
            pending = sessionStorage.getItem(PENDING_FOLLOW_KEY)
          } catch {
            /* storage unavailable */
          }

          if (!error && pending && pending === String(streamerId)) {
            try {
              sessionStorage.removeItem(PENDING_FOLLOW_KEY)
            } catch {
              /* ignore */
            }

            const { error: insertError } = await supabase
              .from('stream_subscriptions')
              .insert({
                user_id: user.id,
                streamer_id: streamerId
              })

            if (!insertError) setIsSubscribed(true)
          }
        }
      } catch (err) {
        console.error('Subscription verification failure:', err)
      }
    }

    checkSubscription()
  }, [user, streamerId])

  // ── Clear status message ─────────────────────────────────────────────────
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // ── Toggle subscription ──────────────────────────────────────────────────
  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      try {
        sessionStorage.setItem(PENDING_FOLLOW_KEY, String(streamerId))
      } catch {
        /* ignore */
      }

      setErrorMessage('SIGNING IN...')
      if (typeof loginWithGoogle === 'function') loginWithGoogle()
      return
    }

    if (!streamerId || streamerId === 'undefined') {
      setErrorMessage('SYNC ERROR')
      return
    }

    setLoading(true)

    try {
      if (isSubscribed) {
        const { error } = await supabase
          .from('stream_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId)

        if (!error) setIsSubscribed(false)
      } else {
        const { error } = await supabase
          .from('stream_subscriptions')
          .insert({
            user_id: user.id,
            streamer_id: streamerId
          })

        if (!error) setIsSubscribed(true)
      }
    } catch (err) {
      console.error('Failed to change subscription registry profile state:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`group relative inline-flex min-h-9 items-center justify-center gap-2 overflow-hidden rounded-lg border px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] select-none transition-all duration-200 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 ${
        errorMessage
          ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
          : isSubscribed
          ? 'border-[#ff4655]/30 bg-[#ff4655]/10 text-[#ff4655] hover:border-[#ff4655]/60 hover:bg-[#ff4655]/15'
          : 'border-white/[0.09] bg-white/[0.035] text-neutral-400 hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {/* Subtle hover sweep */}
      {!loading && !errorMessage && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      )}

      {loading ? (
        <>
          <svg className="relative z-10 h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="3" className="opacity-80" />
          </svg>
          <span className="relative z-10">SYNCING...</span>
        </>
      ) : errorMessage ? (
        <>
          <svg className="relative z-10 h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="relative z-10">{errorMessage}</span>
        </>
      ) : isSubscribed ? (
        <>
          <span className="relative z-10 h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.7)] animate-pulse" />
          <span className="relative z-10">SUBSCRIBED</span>
        </>
      ) : (
        <>
          <svg className="relative z-10 h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="relative z-10">NOTIFY ME</span>
        </>
      )}
    </button>
  )
}
