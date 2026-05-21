import { formatViewerCount } from '../../utils/format'

const PLATFORM_CONFIG = {
  youtube: {
    logo:       'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    label:      'YouTube',
    accentColor: '#ff4444',
    bgClass:    'bg-[#ff0000]/10 text-[#ff4444]',
  },
  kick: {
    logo:       'https://kick.com/img/kick-logo.svg',
    label:      'Kick',
    accentColor: '#53fc18',
    bgClass:    'bg-[#53fc18]/10 text-[#53fc18]',
  },
}

export default function StreamerCard({ streamer }) {
  // 1. Prevent crashes if streamer data is missing entirely
  if (!streamer) {
    return null
  }

  // 🕵️ 2. NEW LOGIC GATE: Catch un-scraped channels before they render a broken layout
  const isUnscrapedYoutube = streamer.platform === 'youtube' && 
    (!streamer.channelName || streamer.channelName.startsWith('UC'));
  
  const isUnscrapedKick = streamer.platform === 'kick' && !streamer.channelName;

  if (isUnscrapedYoutube || isUnscrapedKick) {
    const fallbackPlatformLabel = streamer.platform === 'kick' ? 'Kick' : 'YouTube';
    return (
      <div className="bg-valo-card border border-valo-border rounded-xl p-6 flex flex-col items-center justify-center text-center h-[290px] md:h-[310px] animate-pulse">
        {/* Animated placeholder loop container */}
        <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500 font-mono text-lg shadow-inner">
          <loadingIcon />
        </div>
        
        {/* Syncing Labels Layout */}
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide mb-1">
          Syncing Profile
        </h3>
        <p className="text-xs text-valo-muted font-body max-w-[210px] leading-relaxed">
           This may take a moment.
        </p>
      </div>
    );
  }

  // =========================================================
  // 🚀 ORIGINAL FULLY SCRAPED RENDER ENGINE CONTENT
  // =========================================================
  const platform = streamer?.platform || 'youtube'
  const cfg = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube

  // IRONCLAD LINK FALLBACK: Guarantees a working channel link when they are offline
  const href = streamer?.isLive
    ? streamer?.streamUrl || streamer?.channelUrl || `https://${platform}.com/${streamer?.channelId}`
    : streamer?.channelUrl || (platform === 'youtube'
        ? `https://www.youtube.com/channel/${streamer?.channelId}`
        : `https://kick.com/${streamer?.channelId}`)

  const avatarLetter = (streamer?.channelName || '?')
    .charAt(0)
    .toUpperCase()

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-hover bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 animate-fade-in"
    >
      {/* Live / Avatar area */}
      <div className="relative aspect-video bg-[#111] overflow-hidden">
        {/* Background Canvas */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />

        {/* Center Card Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
          {/* Avatar Image or fallback Letter Icon */}
          {streamer.avatar ? (
            <img
              src={streamer.avatar}
              alt={streamer.channelName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-xl"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold"
              style={{
                background: `${cfg.accentColor}20`,
                color: cfg.accentColor
              }}
            >
              {avatarLetter}
            </div>
          )}

          {/* Status Meta Texts */}
          <div className="text-center space-y-1">
            <p className="text-white font-display font-bold text-lg line-clamp-1">
              {streamer.channelName}
            </p>

            <p className="text-sm text-valo-muted font-body">
              {streamer.isLive
                ? `is live on ${cfg.label}`
                : `is offline on ${cfg.label}`
              }
            </p>
          </div>
        </div>

        {/* LIVE badge overlay */}
        {streamer.isLive && (
          <div className="absolute top-3 left-3">
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
              LIVE
            </span>
          </div>
        )}

        {/* Platform dynamic logo container */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
            <img
              src={cfg.logo}
              alt={cfg.label}
              className="h-3 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        {/* Live viewer count metric pill */}
        {streamer.isLive && streamer.viewerCount != null && (
          <div className="absolute bottom-3 left-3 bg-black/77 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
            {formatViewerCount(streamer.viewerCount)} watching
          </div>
        )}
      </div>

      {/* Footer Info Area */}
      <div className="p-3 space-y-2">
        <p className="text-sm font-body text-valo-muted">
          {streamer.isLive
            ? `${streamer.channelName} is currently live`
            : `Visit ${streamer.channelName}'s channel`
          }
        </p>

        {/* Channel verification and badge styling rows */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={streamer.channelName}
                className="w-5 h-5 rounded-full object-cover shrink-0"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold font-display"
                style={{ background: `${cfg.accentColor}20`, color: cfg.accentColor }}
              >
                {avatarLetter}
              </div>
            )}
           
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-valo-muted font-body truncate">
                {streamer.channelName}
              </span>

              {streamer.verified && (
                <svg
                  className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z"/>
                </svg>
              )}
            </div>
          </div>

          <span className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-display font-semibold px-2 py-0.5 rounded ${cfg.bgClass}`}>
            <img
              src={cfg.logo}
              alt={cfg.label}
              className="h-2.5 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            {cfg.label}
          </span>
        </div>

        {/* Dynamic CTA button display styles */}
        <div
          className={`
            w-full text-center text-xs font-display font-semibold py-2 rounded mt-1 transition-all duration-150
            ${streamer.isLive
              ? 'bg-valo-red text-white group-hover:brightness-110'
              : 'border border-valo-border text-valo-muted group-hover:border-valo-muted group-hover:text-white'
            }
          `}
        >
          {streamer.isLive ? 'Watch Live' : 'View Channel'}
        </div>
      </div>
    </a>
  )
}function loadingIcon() {
  return (
    <svg className="w-6 h-6 text-neutral-500 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="4" className="opacity-75" />
    </svg>
  )
}
