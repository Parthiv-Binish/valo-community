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

  const { streamers: allStreamers, isLoading: hooksLoading, error, refresh } = useAllStreamers()

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

        setSubscriptionHandles(data?.map(sub => sub.streamer_id) || [])
      } catch (err) {
        console.error('Error fetching subscription records:', err)
      } finally {
        setSubsLoading(false)
      }
    }

    fetchUserSubs()
  }, [user])

  const subscribedStreamers = useMemo(() => {
    if (!subscriptionHandles.length || !allStreamers.length) return []

    return allStreamers.filter((streamer) => {
      return (
        subscriptionHandles.includes(streamer.id) ||
        subscriptionHandles.includes(streamer.dbId) ||
        subscriptionHandles.includes(streamer.channelId) ||
        subscriptionHandles.includes(streamer.kick_username) ||
        subscriptionHandles.includes(streamer.youtube_channel_id)
      )
    })
  }, [allStreamers, subscriptionHandles])

  const displayedStreamers = useMemo(() => {
    return subscribedStreamers.filter(streamer => {
      if (activeTab === 'live') return streamer.isLive
      return true
    })
  }, [subscribedStreamers, activeTab])

  const combinedLoading = hooksLoading || subsLoading
  const liveCount = subscribedStreamers.filter(streamer => streamer.isLive).length

  if (!user) {
    return (
      <MainLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0a0a0b] p-8 text-center shadow-2xl shadow-black/30 sm:p-10">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#ff4655]/10 blur-3xl" />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff4655]/20 bg-[#ff4655]/[0.08] text-2xl shadow-[0_0_35px_rgba(255,70,85,0.08)]">
                🔒
              </div>
              <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff4655]">
                Private Feed
              </div>
              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white">
                Access Restricted
              </h1>
              <p className="mx-auto mt-3 max-w-sm font-mono text-xs leading-6 text-neutral-500">
                Sign in with Google to access your subscribed creators and live notification feed.
              </p>
              <div className="mx-auto mt-7 h-px w-20 bg-gradient-to-r from-transparent via-[#ff4655]/60 to-transparent" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1600px] space-y-6 pb-6">

        {/* Page header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(255,70,85,0.10),transparent_34%),radial-gradient(circle_at_90%_100%,rgba(255,70,85,0.045),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/60 to-transparent" />

          <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between lg:p-8">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff4655]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.7)]" />
                Personal Command Feed
              </div>

              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                My Subscriptions
              </h1>

              <p className="mt-2 max-w-xl font-mono text-[11px] leading-5 text-neutral-500 sm:text-xs">
                Track the creators you follow. See who is live and jump directly into their streams.
              </p>
            </div>

            {!combinedLoading && (
              <div className="grid grid-cols-2 gap-2 sm:flex">
                <div className="min-w-[125px] rounded-2xl border border-white/[0.07] bg-black/30 px-4 py-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600">
                    Following
                  </div>
                  <div className="mt-1 font-display text-lg font-black text-white">
                    {subscribedStreamers.length}
                  </div>
                </div>

                <div className="min-w-[125px] rounded-2xl border border-[#ff4655]/15 bg-[#ff4655]/[0.045] px-4 py-3">
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#ff4655]/70">
                    Live Now
                  </div>
                  <div className="mt-1 flex items-center gap-2 font-display text-lg font-black text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ff4655] shadow-[0_0_9px_rgba(255,70,85,0.8)]" />
                    {liveCount}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Tabs */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full gap-2 overflow-x-auto pb-1 scrollbar-none sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`group flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === 'all'
                  ? 'border-white/10 bg-white text-black shadow-lg shadow-white/[0.04]'
                  : 'border-white/[0.07] bg-[#0b0b0c] text-neutral-500 hover:border-white/[0.12] hover:bg-[#111112] hover:text-white'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${activeTab === 'all' ? 'bg-black' : 'bg-neutral-600 group-hover:bg-white'}`} />
              All Creators
            </button>

            <button
              onClick={() => setActiveTab('live')}
              className={`group flex min-h-10 shrink-0 items-center gap-2 rounded-xl border px-4 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === 'live'
                  ? 'border-[#ff4655]/40 bg-[#ff4655] text-white shadow-[0_0_25px_rgba(255,70,85,0.14)]'
                  : 'border-white/[0.07] bg-[#0b0b0c] text-neutral-500 hover:border-[#ff4655]/20 hover:bg-[#111112] hover:text-white'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${activeTab === 'live' ? 'bg-white animate-pulse' : 'bg-[#ff4655]'}`} />
              Live Now
              {!combinedLoading && (
                <span className={`rounded-md px-1.5 py-0.5 text-[9px] ${activeTab === 'live' ? 'bg-black/15 text-white' : 'bg-[#ff4655]/10 text-[#ff4655]'}`}>
                  {liveCount}
                </span>
              )}
            </button>
          </div>

          {!combinedLoading && subscribedStreamers.length > 0 && (
            <div className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700 sm:block">
              {displayedStreamers.length} visible / {subscribedStreamers.length} tracked
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="relative overflow-hidden rounded-2xl border border-red-500/15 bg-red-950/20 px-4 py-3.5 text-xs text-red-300">
            <div className="absolute inset-y-0 left-0 w-0.5 bg-red-500/60" />
            <div className="pl-2 font-mono">
              <span className="mr-2 text-red-400">⚠</span>
              {error}
            </div>
          </div>
        )}

        {/* Stream grid */}
        {combinedLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <StreamerCardSkeleton key={i} />
            ))}
          </div>
        ) : displayedStreamers.length === 0 ? (
          <div className="relative mx-auto mt-8 w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] px-6 py-14 text-center sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,70,85,0.08),transparent_45%)]" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111112] text-xl text-neutral-600 shadow-xl shadow-black/20">
                📡
              </div>

              <div className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff4655]/80">
                Feed Empty
              </div>

              <h3 className="font-display text-lg font-black uppercase tracking-wide text-white">
                {activeTab === 'live' ? 'No Subscribed Creators Live' : 'No Channels Found'}
              </h3>

              <p className="mx-auto mt-2 max-w-sm font-mono text-[11px] leading-5 text-neutral-500">
                {activeTab === 'live'
                  ? 'None of the creators you follow are broadcasting right now. Check back later.'
                  : 'Your subscription feed is empty. Discover creators and build your personal live feed.'}
              </p>

              <a
                href="/"
                className="mt-7 inline-flex min-h-10 items-center justify-center rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/[0.08] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff4655] transition-all hover:border-[#ff4655]/40 hover:bg-[#ff4655]/[0.14] hover:text-white active:scale-95"
              >
                Browse Creators
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedStreamers.map((streamer, i) => (
              <StreamerCard
                key={`${streamer.platform}-${streamer.dbId || streamer.id}-${i}`}
                streamer={streamer}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
