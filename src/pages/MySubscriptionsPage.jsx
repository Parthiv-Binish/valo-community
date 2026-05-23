import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase' 
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import StreamerCard from '../components/stream/StreamCard'

export default function MySubscriptionsPage() {
  const { user } = useAuth()
  const [subscribedStreamers, setSubscribedStreamers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all') 

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        const { data: subData, error: subError } = await supabase
          .from('stream_subscriptions')
          .select('streamer_id')
          .eq('user_id', user.id)

        if (subError) throw subError

        if (!subData || subData.length === 0) {
          setSubscribedStreamers([])
          return
        }

        const trackedHandles = subData.map(sub => sub.streamer_id)

        const [ytResult, kickResult] = await Promise.all([
          supabase.from('streamers').select('id, platform, youtube_channel_id, kick_username').in('youtube_channel_id', trackedHandles),
          supabase.from('streamers').select('id, platform, youtube_channel_id, kick_username').in('kick_username', trackedHandles)
        ])

        const combinedRegistry = [...(ytResult.data || []), ...(kickResult.data || [])]
        if (combinedRegistry.length === 0) {
          setSubscribedStreamers([])
          return
        }

        const streamerUuids = combinedRegistry.map(s => s.id)

        const { data: metricsData, error: metricsError } = await supabase
          .from('streamer_data')
          .select('*')
          .in('streamer_id', streamerUuids)

        if (metricsError) throw metricsError

        const completeProfiles = (metricsData || []).map(metric => {
          const parent = combinedRegistry.find(s => s.id === metric.streamer_id)
          const rawHandle = parent?.platform === 'youtube' ? parent.youtube_channel_id : parent?.kick_username

          return {
            id: rawHandle, 
            channelId: rawHandle,
            channelName: metric.channel_name || rawHandle,
            platform: parent?.platform || 'youtube',
            avatar: metric.avatar,
            isLive: metric.is_live,
            title: metric.title,
            thumbnail: metric.thumbnail,
            viewerCount: metric.viewer_count,
            streamUrl: metric.stream_url,
            verified: false
          }
        })

        const sortedProfiles = completeProfiles.sort((a, b) => {
          if (a.isLive && !b.isLive) return -1
          if (!a.isLive && b.isLive) return 1
          return 0
        })

        setSubscribedStreamers(sortedProfiles)
      } catch (err) {
        console.error('Error matching dashboard records:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [user])

  const displayedStreamers = subscribedStreamers.filter(streamer => {
    if (activeTab === 'live') return streamer.isLive
    return true
  })

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
        
        <div className="border-b border-neutral-900 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#ff4655] tracking-widest uppercase mb-1">
              Live Stream Feed
            </div>
            <h1 className="font-display font-black text-2xl text-white uppercase tracking-wide">
              My Subscriptions
            </h1>
          </div>
          
          <div className="font-mono text-[11px] text-neutral-400 bg-neutral-900/50 border border-neutral-800 px-3 py-1.5 rounded uppercase tracking-wider select-none">
            Tracking: <span className="text-[#ff4655] font-black">{subscribedStreamers.length} Channels</span>
          </div>
        </div>

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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-neutral-950/40 border border-neutral-900 rounded-xl p-4 h-[290px] animate-pulse flex flex-col justify-between">
                <div className="w-full aspect-video bg-neutral-900/50 rounded-lg" />
                <div className="space-y-2 mt-4 flex-1">
                  <div className="h-4 bg-neutral-900/50 rounded w-2/3" />
                  <div className="h-3 bg-neutral-900/50 rounded w-1/2" />
                </div>
              </div>
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedStreamers.map((streamer) => (
              <StreamerCard key={streamer.id} streamer={streamer} />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  )
}