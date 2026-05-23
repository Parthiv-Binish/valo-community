import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase' // Path structured for your v0 project setup
import { useAuth } from '../../context/AuthContext'

export default function NotifyButton({ streamerId }) {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 🔍 1. Verify subscription state on viewport synchronization hook
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
        }
      } catch (err) {
        console.error('Subscription verification failure:', err)
      }
    }
    
    checkSubscription()
  }, [user, streamerId])

  // ⏳ Clear errors automatically after a small duration window
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // ⚡ 2. Handle interactive state transformations
  const handleToggle = async (e) => {
    e.preventDefault() // Prevents triggering container card link click triggers
    e.stopPropagation() // Double containment safety layer to lock execution bubbles
    
    if (!user) {
      setErrorMessage('SIGN IN REQUIRED')
      return
    }

    if (!streamerId || streamerId === 'undefined') {
      setErrorMessage('SYNC ERROR')
      return
    }

    setLoading(true)
    try {
      if (isSubscribed) {
        // 🛑 Unsubscribe payload execution link
        const { error } = await supabase
          .from('stream_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('streamer_id', streamerId)

        if (!error) setIsSubscribed(false)
      } else {
        // 🔔 Subscribe payload execution link
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
      className={`relative inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded font-mono text-[10px] font-bold tracking-wider uppercase border select-none transition-all duration-150 active:scale-95 disabled:opacity-75 ${
        errorMessage
          ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
          : isSubscribed
          ? 'bg-[#ff4655]/10 text-[#ff4655] border-[#ff4655]/30 hover:bg-[#ff4655]/20 hover:border-[#ff4655]'
          : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white hover:bg-neutral-900'
      }`}
    >
      {loading ? (
        <>
          <svg className="w-3 h-3 text-current animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="4" className="opacity-75" />
          </svg>
          <span>SYNCING...</span>
        </>
      ) : errorMessage ? (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{errorMessage}</span>
        </>
      ) : isSubscribed ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4655] animate-pulse" />
          <span>SUBSCRIBED</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3 transition-transform duration-150 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>NOTIFY ME</span>
        </>
      )}
    </button>
  )
}