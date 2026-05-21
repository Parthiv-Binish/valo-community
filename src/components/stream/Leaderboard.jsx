// src/components/stream/Leaderboard.jsx
import { formatViewerCount } from '../../utils/format'

export default function Leaderboard({ streamers, isLoading }) {
  if (isLoading) {
    return (
      <div className="w-full bg-valo-card border border-valo-border rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-5 bg-neutral-800 rounded w-1/3 mb-4" />
        <div className="h-12 bg-neutral-800 rounded w-full" />
        <div className="h-12 bg-neutral-800 rounded w-full" />
      </div>
    )
  }

  // Filter and sort active live streams for each platform
  const ytLeaderboard = streamers
    .filter((s) => s.platform === 'youtube' && s.isLive)
    .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
    .slice(0, 5) // Top 5

  const kickLeaderboard = streamers
    .filter((s) => s.platform === 'kick' && s.isLive)
    .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
    .slice(0, 5) // Top 5

  const renderLeaderboardRows = (list, platformName, accentColor) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-8 border border-dashed border-neutral-800 rounded-xl bg-black/20">
          <p className="text-xs text-valo-muted">No creators currently live on {platformName}</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {list.map((streamer, index) => {
          const rank = index + 1
          const isTopRank = rank === 1

          return (
            <a
              key={streamer.dbId || streamer.channelId}
              href={streamer.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 bg-neutral-900/60 border border-neutral-800/40 hover:border-neutral-700/60 hover:bg-neutral-900 rounded-lg transition-all duration-150 group"
            >
              {/* Rank Position Identifier */}
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0
                  ${isTopRank 
                    ? 'bg-valo-red text-white scale-105 shadow-md shadow-valo-red/20' 
                    : 'bg-neutral-800 text-neutral-400'
                  }`}
              >
                {rank}
              </div>

              {/* Avatar Frame */}
              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className="w-8 h-8 rounded-full object-cover border border-white/10 shrink-0"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold font-display"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                >
                  {(streamer.channelName || '?').charAt(0).toUpperCase()}
                </div>
              )}

              {/* Content text */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-valo-red transition-colors">
                    {streamer.channelName}
                  </p>
                  {streamer.verified && (
                    <svg className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z"/>
                    </svg>
                  )}
                </div>
                <p className="text-[11px] text-valo-muted truncate line-clamp-1 font-body">
                  {streamer.title || 'Streaming Live'}
                </p>
              </div>

              {/* Viewers Pill */}
              <div className="shrink-0 bg-black/40 border border-neutral-800/80 rounded px-2 py-0.5 text-right">
                <span className="text-xs font-mono font-bold text-valo-red animate-pulse">● </span>
                <span className="text-xs font-mono text-white font-semibold">
                  {formatViewerCount(streamer.viewerCount || 0)}
                </span>
              </div>
            </a>
          )
        })}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* YouTube Leaderboard Column */}
      <div className="bg-valo-card border border-valo-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/60 pb-3">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930"
            className="h-4 object-contain"
            alt="YouTube"
          />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            Live Rankings
          </h2>
        </div>
        {renderLeaderboardRows(ytLeaderboard, 'YouTube', '#ff4444')}
      </div>

      {/* Kick Leaderboard Column */}
      <div className="bg-valo-card border border-valo-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4 border-b border-neutral-800/60 pb-3">
          <img
            src="https://kick.com/img/kick-logo.svg"
            className="h-4 object-contain"
            alt="Kick"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            Live Rankings
          </h2>
        </div>
        {renderLeaderboardRows(kickLeaderboard, 'Kick', '#53fc18')}
      </div>
    </div>
  )
}