import { useState } from 'react'
import { useAllStreamers } from '../hooks/useAllStreamers'
import Leaderboard from '../components/stream/Leaderboard'
import MainLayout from '../layouts/MainLayout'

export default function LeaderboardPage() {
  const { streamers, isLoading } = useAllStreamers()
  // 'all' = both together, 'youtube' = only YT rankings, 'kick' = only Kick rankings
  const [activeTab, setActiveTab] = useState('all')

  // Calculate live counts for the badge metrics
  const totalLiveStreamers = streamers.filter(s => s.isLive).length
  const ytLiveCount = streamers.filter(s => s.platform === 'youtube' && s.isLive).length
  const kickLiveCount = streamers.filter(s => s.platform === 'kick' && s.isLive).length

  // Dynamic conditional filter filtering for the component rendering layout
  const filteredStreamers = streamers.filter(s => {
    if (activeTab === 'all') return true
    return s.platform === activeTab
  })

  // Determine if the currently filtered platform column has live streams
  const hasLiveStreams = filteredStreamers.some(s => s.isLive)

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1500px] space-y-6 pb-6">

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,70,85,0.11),transparent_34%),radial-gradient(circle_at_92%_100%,rgba(255,70,85,0.04),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/65 to-transparent" />

          <div className="relative flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#ff4655]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
                Live Intelligence // Rankings
              </div>

              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                Live Engagement <span className="text-[#ff4655]">Leaderboard</span>
              </h1>

              <p className="mt-2 max-w-2xl font-mono text-[10px] leading-5 text-neutral-500 sm:text-xs">
                Real-time metrics calculated from active broadcast channels across platforms.
              </p>
            </div>

            {!isLoading && (
              <div className="grid grid-cols-3 gap-2">
                <Metric label="Live" value={totalLiveStreamers} />
                <Metric label="YouTube" value={ytLiveCount} accent="youtube" />
                <Metric label="Kick" value={kickLiveCount} accent="kick" />
              </div>
            )}
          </div>
        </section>

        {/* Platform controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-white/[0.07] bg-[#09090a] p-1 scrollbar-none sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`min-h-10 shrink-0 rounded-xl px-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === 'all'
                  ? 'bg-[#ff4655] text-white shadow-[0_0_24px_rgba(255,70,85,0.13)]'
                  : 'text-neutral-500 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              All Ranks ({totalLiveStreamers})
            </button>

            <button
              onClick={() => setActiveTab('youtube')}
              className={`min-h-10 shrink-0 rounded-xl px-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === 'youtube'
                  ? 'border border-[#ff4444]/30 bg-[#ff4444]/[0.08] text-[#ff4444]'
                  : 'text-neutral-500 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              YouTube ({ytLiveCount})
            </button>

            <button
              onClick={() => setActiveTab('kick')}
              className={`min-h-10 shrink-0 rounded-xl px-4 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all ${
                activeTab === 'kick'
                  ? 'border border-[#53fc18]/25 bg-[#53fc18]/[0.07] text-[#53fc18]'
                  : 'text-neutral-500 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              Kick ({kickLiveCount})
            </button>
          </div>

          {!isLoading && (
            <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-700 sm:flex">
              <span className={`h-1.5 w-1.5 rounded-full ${hasLiveStreams ? 'animate-pulse bg-[#ff4655]' : 'bg-neutral-700'}`} />
              {hasLiveStreams ? 'Broadcast data active' : 'Awaiting broadcasts'}
            </div>
          )}
        </div>

        {/* Main data */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <LeaderboardSkeleton />
              <LeaderboardSkeleton />
            </div>
          ) : !hasLiveStreams ? (
            <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/[0.08] bg-[#09090a] px-5 py-16 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,70,85,0.055),transparent_45%)]" />

              <div className="relative">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111112] text-neutral-600 shadow-xl shadow-black/20">
                  <TrophyIcon />
                </div>

                <div className="mb-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff4655]/80">
                  Rankings Offline
                </div>

                <h3 className="font-display text-lg font-black uppercase tracking-wide text-white sm:text-xl">
                  {activeTab === 'all'
                    ? 'Leaderboards are Quiet'
                    : `No Active ${activeTab === 'youtube' ? 'YouTube' : 'Kick'} Ranks`}
                </h3>

                <p className="mx-auto mt-2 max-w-md font-mono text-[10px] leading-5 text-neutral-500">
                  No creators are live on {activeTab === 'all' ? 'any platform' : activeTab} right now.
                  Rankings will update automatically the second a broadcast starts.
                </p>
              </div>
            </div>
          ) : (
            <div className={`grid grid-cols-1 gap-4 ${activeTab === 'all' ? 'lg:grid-cols-2' : 'mx-auto max-w-2xl'}`}>
              {(activeTab === 'all' || activeTab === 'youtube') && (
                <LeaderboardColumn
                  platform="youtube"
                  logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930"
                  accentColor="#ff4444"
                  list={filteredStreamers.filter(s => s.platform === 'youtube' && s.isLive)}
                />
              )}

              {(activeTab === 'all' || activeTab === 'kick') && (
                <LeaderboardColumn
                  platform="kick"
                  logo="https://kick.com/img/kick-logo.svg"
                  accentColor="#53fc18"
                  list={filteredStreamers.filter(s => s.platform === 'kick' && s.isLive)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

function Metric({ label, value, accent }) {
  const accentClass = accent === 'youtube'
    ? 'text-[#ff4444]'
    : accent === 'kick'
      ? 'text-[#53fc18]'
      : 'text-[#ff4655]'

  return (
    <div className="min-w-[74px] rounded-2xl border border-white/[0.07] bg-black/25 px-3 py-2.5 text-center sm:min-w-[88px]">
      <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-700">{label}</div>
      <div className={`mt-0.5 font-display text-lg font-black ${accentClass}`}>{value}</div>
    </div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/[0.07] bg-[#09090a] p-4">
      <div className="mb-4 flex items-center gap-3 border-b border-white/[0.06] pb-4">
        <div className="h-5 w-16 rounded bg-white/[0.05]" />
        <div className="h-3 w-28 rounded bg-white/[0.05]" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3">
            <div className="h-7 w-7 rounded-lg bg-white/[0.05]" />
            <div className="h-9 w-9 rounded-full bg-white/[0.05]" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-2/5 rounded bg-white/[0.05]" />
              <div className="h-2.5 w-1/4 rounded bg-white/[0.04]" />
            </div>
            <div className="h-6 w-14 rounded bg-white/[0.05]" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Sub-Component: Clean, isolated single platform column
function LeaderboardColumn({ platform, logo, accentColor, list }) {
  const formatViewerCount = (count) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-4 sm:p-5">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)` }}
      />

      <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 min-w-9 items-center justify-center rounded-xl border"
            style={{ borderColor: `${accentColor}30`, background: `${accentColor}10` }}
          >
            <img
              src={logo}
              className="h-4 w-auto object-contain"
              alt={platform}
              onError={(e) => { if (platform === 'kick') e.target.style.display = 'none' }}
            />
          </div>
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: `${accentColor}99` }}>
              {platform} // Live
            </div>
            <h2 className="font-display text-sm font-black uppercase tracking-wide text-white">
              Live Rankings
            </h2>
          </div>
        </div>

        <div
          className="rounded-lg border px-2 py-1 font-mono text-[9px] font-bold"
          style={{ borderColor: `${accentColor}25`, color: accentColor, background: `${accentColor}08` }}
        >
          {list.length} LIVE
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.07] bg-black/20 py-12 text-center">
          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-600">
            No creators currently live
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((streamer, index) => (
            <a
              key={streamer.dbId || streamer.channelId}
              href={streamer.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex min-h-[62px] items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0d0d0e] p-2.5 transition-all duration-200 hover:border-white/[0.12] hover:bg-[#111112] active:scale-[0.99]"
            >
              {index === 0 && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-px"
                  style={{ background: accentColor, boxShadow: `0 0 14px ${accentColor}` }}
                />
              )}

              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-mono text-[10px] font-black ${
                  index === 0
                    ? 'bg-[#ff4655] text-white shadow-[0_0_15px_rgba(255,70,85,0.18)]'
                    : 'bg-white/[0.05] text-neutral-500'
                }`}
              >
                {index + 1}
              </div>

              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className="h-9 w-9 shrink-0 rounded-full border border-white/10 object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold font-display"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {(streamer.channelName || '?').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-bold text-white transition-colors group-hover:text-[#ff4655]">
                  {streamer.channelName}
                </p>
                <p className="truncate font-mono text-[9px] uppercase tracking-wider text-neutral-600">
                  Streaming Live
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.06] bg-black/40 px-2 py-1">
                <span className="animate-pulse font-mono text-[9px] text-[#ff4655]">●</span>
                <span className="font-mono text-[10px] font-bold text-white">
                  {formatViewerCount(streamer.viewerCount || 0)}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

function TrophyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a5 5 0 0 0-5 5v3.5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
    </svg>
  )
}
