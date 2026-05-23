import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase' 
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import StreamerCard from '../components/stream/StreamCard'
import StreamerCardSkeleton from '../components/stream/StreamCardSkeleton'
import { useAllStreamers } from '../hooks/useAllStreamers'

export default function MySubscriptionsPage() {
  const { user } = useAuth()
  const [subscriptionHandles, setSubscriptionHandles] = useState([])
  const [subsLoading, setSubsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  // 1. Leverage the exact same hook used on AllStreamersPage for unified data structures
  const { streamers: allStreamers, isLoading: hooksLoading, error, refresh } = useAllStreamers()

  // 2. Fetch the user's raw subscription strings from the database
  useEffect(() => {
    async function fetchUserSubs() {
      if (!user) {
        setSubsLoading(false)
        return
      }
      try {
        setSubsLoading(true)
        const { data, error: subError } = await supabase
          .from('stream_subscriptions')
          .select('streamer_id')
          .eq('user_id', user.id)

        if (subError) throw subError
        
        // Map out the flat strings array (handles or IDs)
        setSubscriptionHandles(data?.map(sub => sub.streamer_id) || [])
      } catch (err) {
        console.error('Error fetching subscription records:', err)
      } finally {
        setSubsLoading(false)
      }
    }

    fetchUserSubs()
  }, [user])

  // 3. Match and filter the data using useMemo, matching the AllStreamersPage filter pattern
  const subscribedStreamers = useMemo(() => {
    if (!subscriptionHandles.length || !allStreamers.length) return []

    return allStreamers.filter((streamer) => {
      // Check every potential key variable that could map to your subscription tracking string
      return (
        subscriptionHandles.includes(streamer.id) ||
        subscriptionHandles.includes(streamer.dbId) ||
        subscriptionHandles.includes(streamer.channelId) ||
        subscriptionHandles.includes(streamer.kick_username) ||
        subscriptionHandles.includes(streamer.youtube_channel_id)
      )
    })
  }, [allStreamers, subscriptionHandles])

  // 4. Client-side live tab filtering
  const displayedStreamers = useMemo(() => {
    return subscribedStreamers.filter(streamer => {
      if (activeTab === 'live') return streamer.isLive
      return true
    })
  }, [subscribedStreamers, activeTab])

  const combinedLoading = hooksLoading || subsLoading

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-14 h-14 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-center text-[#ff4655] mb-4 text-xl">
            🔒
          </div>
          <h1 className="font-display font-black text-xl text-white uppercase tracking-wider mb-2">
            Access Restricted
          </h1>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed font-mono uppercase tracking-tight">
            Please sign in with Google to view and manage your custom notification feed.
          </p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        
        {/* Header Display Sub-Panel */}
        <div className="border-b border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#ff4655] tracking-widest uppercase mb-1">
              Live Stream Feed
            </div>
            <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide">
              My Subscriptions
            </h1>
          </div>
          
          {!combinedLoading && (
            <div className="font-mono text-[11px] text-neutral-400 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded uppercase tracking-wider select-none">
              Tracking: <span className="text-[#ff4655] font-black">{subscribedStreamers.length} Channels</span>
            </div>
          )}
        </div>

        {/* Tab Selection Filter Controls */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all select-none whitespace-nowrap ${
              activeTab === 'all' 
                ? 'bg-white text-black font-semibold' 
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800/60 hover:text-white hover:bg-neutral-800/80'
            }`}
          >
            All Creators
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all select-none whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'live' 
                ? 'bg-[#ff4655] text-white font-semibold' 
                : 'bg-neutral-900 text-neutral-400 border border-neutral-800/60 hover:text-white hover:bg-neutral-800/80'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'live' ? 'bg-white animate-pulse' : 'bg-[#ff4655]'}`} />
            Live Now
          </button>
        </div>

        {/* Error Alert Display Box */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-sm text-red-300 font-body">
            ⚠️ {error}
          </div>
        )}

        {/* Grid Viewport */}
        {combinedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StreamerCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedStreamers.length === 0 ? (
          <div className="bg-neutral-950/20 border border-neutral-900 rounded-2xl p-12 text-center max-w-sm mx-auto flex flex-col items-center justify-center mt-8">
            <div className="w-12 h-12 bg-neutral-900/60 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 font-mono text-lg mb-4 select-none">
              📡
            </div>
            <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide mb-1.5">
              No Channels Found
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed font-mono uppercase tracking-tight mb-5">
              There are no creators matching this category selection right now.
            </p>
            <a
              href="/"
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded transition-all duration-150 active:scale-95"
            >
              Browse Creators
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedStreamers.map((streamer, i) => (
              <StreamerCard key={`${streamer.platform}-${streamer.dbId || streamer.id}-${i}`} streamer={streamer} />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}
