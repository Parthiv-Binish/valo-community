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



  // Prevent crashes
  if (!streamer) {
    return null
  }

  // Safe fallback
  const platform =
    streamer?.platform || 'youtube'

  const cfg =
    PLATFORM_CONFIG[platform]
    || PLATFORM_CONFIG.youtube

  const href =
    streamer?.isLive
      ? streamer?.streamUrl
      : streamer?.channelUrl

  const avatarLetter =
    (streamer?.channelName || '?')
      .charAt(0)
      .toUpperCase()

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-hover bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 animate-fade-in"
    >
      {/* Thumbnail / Avatar area */}
      <div className="relative aspect-video bg-[#111] overflow-hidden">
        {streamer.isLive && streamer.thumbnail ? (
          <>
            <img
              src={streamer.thumbnail}
              alt={streamer.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => { e.target.src = `https://placehold.co/640x360/181818/ff4655?text=LIVE` }}
            />
            {/* Dark overlay for offline feel on live */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          /* Offline state — stylised avatar background */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1c1c1c] to-[#111] gap-3">
            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={streamer.channelName}
                className="w-14 h-14 rounded-full object-cover border-2 border-valo-border opacity-60 group-hover:opacity-90 transition-opacity"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display font-bold border-2 border-valo-border/50 opacity-70"
                style={{ background: `${cfg.accentColor}15`, color: cfg.accentColor }}
              >
                {avatarLetter}
              </div>
            )}
            <span className="text-valo-muted text-xs font-body opacity-70">Offline</span>
          </div>
        )}

        {/* LIVE badge */}
        {streamer.isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
              LIVE
            </span>
          </div>
        )}

        {/* OFFLINE badge */}
        {!streamer.isLive && (
          <div className="absolute top-2 left-2">
            <span className="inline-flex items-center gap-1 bg-black/60 text-valo-muted text-xs font-display font-semibold px-2 py-0.5 rounded uppercase tracking-wider border border-valo-border/40">
              Offline
            </span>
          </div>
        )}

        {/* Viewer count */}
        {streamer.isLive && streamer.viewerCount != null && (
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-0.5 rounded">
            {formatViewerCount(streamer.viewerCount)} viewers
          </div>
        )}

        {/* Platform logo */}
        <div className="absolute top-2 right-2">
          <div className="bg-red/70 backdrop-blur-sm rounded p-1">
            <img
              src={cfg.logo}
              alt={cfg.label}
              className="h-3.5 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>

        {/* Hover play / visit overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-11 h-11 rounded-full bg-valo-red/90 flex items-center justify-center shadow-lg">
            {streamer.isLive ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {/* Title (live) or placeholder (offline) */}
        {streamer.isLive && streamer.title ? (
          <p className="text-sm font-body font-medium text-valo-text line-clamp-2 leading-snug">
            {streamer.title}
          </p>
        ) : (
          <p className="text-sm font-body text-valo-muted italic">
            Not streaming right now
          </p>
        )}

        {/* Channel name + platform */}
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

        {/* CTA button */}
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
}