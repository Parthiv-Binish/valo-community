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
      {/* ========================================== */}
      {/* 📝 HEADER SECTION                          */}
      {/* ========================================== */}
     
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-1 h-8 bg-valo-red rounded-full" />
            <h1 className="font-display font-bold text-2xl text-white">Live Engagement Leaderboard
</h1>
          </div>
          <p className="text-valo-muted text-sm font-body leading-relaxed pl-4">
                       Real-time metrics calculated from active broadcast channels across platforms.

          </p>
        </div>
 <div className="max-w-lg mx-auto animate-fade-in">

        {/* ========================================== */}
        {/* 🎛️ PLATFORM FILTER TOGGLE BUTTONS          */}
        {/* ========================================== */}
        <div className="flex items-center gap-2 self-start sm:self-center bg-black/40 p-1 rounded-full border border-neutral-800/80">
          {/* ALL PLATFORMS TOGGLE */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-150 ${
              activeTab === 'all'
                ? 'bg-valo-red text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Ranks ({totalLiveStreamers})
          </button>

          {/* YOUTUBE TOGGLE */}
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-150 ${
              activeTab === 'youtube'
                ? 'bg-[#ff4444]/20 border border-[#ff4444]/40 text-[#ff4444]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            YouTube ({ytLiveCount})
          </button>

          {/* KICK TOGGLE */}
          <button
            onClick={() => setActiveTab('kick')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-display font-semibold transition-all duration-150 ${
              activeTab === 'kick'
                ? 'bg-[#53fc18]/20 border border-[#53fc18]/40 text-[#53fc18]'
                : 'text-neutral-400 hover:text-white border border-transparent'
            }`}
          >
            Kick ({kickLiveCount})
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🚀 MAIN DATA DISPLAY WIDGET WITH FALLBACKS */}
      {/* ========================================== */}
      <div className="w-full">
        {isLoading ? (
          /* 1. LOADING FALLBACK STATE */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            <div className="bg-valo-card border border-valo-border rounded-xl p-6 h-64 bg-neutral-900/40" />
            <div className="bg-valo-card border border-valo-border rounded-xl p-6 h-64 bg-neutral-900/40" />
          </div>
        ) : !hasLiveStreams ? (
          /* 2. NO LIVE STREAMS MATCHING SELECTION FALLBACK STATE */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/10 px-4">
            <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center text-neutral-500 mb-4 border border-neutral-800">
              <TrophyIcon />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-1">
              {activeTab === 'all' 
                ? 'Leaderboards are Quiet' 
                : `No Active ${activeTab === 'youtube' ? 'YouTube' : 'Kick'} Ranks`}
            </h3>
            <p className="text-valo-muted text-xs max-w-sm font-body">
              No creators are live on {activeTab === 'all' ? 'any platform' : activeTab} right now. Rankings will update automatically the second a broadcast starts!
            </p>
          </div>
        ) : (
          /* 3. ACTIVE LEADERBOARD GRID CONTAINER */
          <div className={`grid grid-cols-1 gap-6 ${activeTab === 'all' ? 'md:grid-cols-2' : 'max-w-2xl mx-auto'}`}>
            {/* Show YouTube Column if 'all' or explicit 'youtube' is toggled */}
            {(activeTab === 'all' || activeTab === 'youtube') && (
              <LeaderboardColumn 
                platform="youtube" 
                logo="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930"
                accentColor="#ff4444"
                list={filteredStreamers.filter(s => s.platform === 'youtube' && s.isLive)}
              />
            )}

            {/* Show Kick Column if 'all' or explicit 'kick' is toggled */}
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
    </MainLayout>
  )
}

// Sub-Component: Clean, isolated single platform column
function LeaderboardColumn({ platform, logo, accentColor, list }) {
  const formatViewerCount = (count) => {
    return count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count
  }

  return (
    <div className="bg-valo-card border border-valo-border rounded-xl p-4 h-fit">
      <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/60 pb-3">
        <img
          src={logo}
          className="h-4 object-contain"
          alt={platform}
          onError={(e) => { if(platform === 'kick') e.target.style.display = 'none' }}
        />
        <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
          Live Rankings
        </h2>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl bg-black/20">
          <p className="text-xs text-valo-muted">No creators currently live</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((streamer, index) => (
            <a
              key={streamer.dbId || streamer.channelId}
              href={streamer.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-neutral-900/60 border border-neutral-800/40 hover:border-neutral-700/60 hover:bg-neutral-900 rounded-lg transition-all duration-150 group"
            >
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                index === 0 ? 'bg-valo-red text-white scale-105' : 'bg-neutral-800 text-neutral-400'
              }`}>
                {index + 1}
              </div>

              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold font-display" style={{ background: `${accentColor}20`, color: accentColor }}>
                  {(streamer.channelName || '?').charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate group-hover:text-valo-red transition-colors">
                  {streamer.channelName}
                </p>
                <p className="text-[11px] text-valo-muted truncate font-body">
                  {streamer.title || 'Streaming Live'}
                </p>
              </div>

              <div className="shrink-0 bg-black/40 border border-neutral-800/80 rounded px-2 py-0.5">
                <span className="text-xs font-mono font-bold text-valo-red animate-pulse">● </span>
                <span className="text-xs font-mono text-white font-semibold">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34M12 2a5 5 0 0 0-5 5v3.5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"/>
    </svg>
  )
}