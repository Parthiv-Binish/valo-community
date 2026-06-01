import { formatViewerCount } from '../../utils/format'
import NotifyButton from '../common/NotifyButton';

const PLATFORM_CONFIG = {
  youtube: {
    logo:        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    label:       'YouTube',
    accentColor: '#ff4444',
    bgClass:     'bg-[#ff0000]/10 text-[#ff4444] border-[#ff0000]/20',
  },
  kick: {
    logo:        'https://kick.com/img/kick-logo.svg',
    label:       'Kick',
    accentColor: '#53fc18',
    bgClass:     'bg-[#53fc18]/10 text-[#53fc18] border-[#53fc18]/20',
  },
}

function getKickEmbedUrl(streamer) {
  const channel = streamer.channelName || streamer.channelId;
  if (!channel) return null;
  return `https://player.kick.com/${channel}?autoplay=true&muted=true`;
}

function getYoutubeThumbnail(streamer) {
  return streamer.thumbnail || null;
}

export default function StreamerCard({ streamer }) {
  if (!streamer) return null;

  const isUnscrapedYoutube = streamer.platform === 'youtube' &&
    (!streamer.channelName || streamer.channelName.startsWith('UC'));
  const isUnscrapedKick = streamer.platform === 'kick' && !streamer.channelName;

  if (isUnscrapedYoutube || isUnscrapedKick) {
    return (
      <div className="bg-valo-card border border-valo-border rounded-xl p-6 flex flex-col items-center justify-center text-center h-[290px] md:h-[310px] animate-pulse">
        <div className="w-14 h-14 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500 font-mono text-lg shadow-inner">
          {loadingIcon()}
        </div>
        <h3 className="font-display font-bold text-sm text-white uppercase tracking-wide mb-1">
          Syncing Profile
        </h3>
        <p className="text-xs text-valo-muted font-body max-w-[210px] leading-relaxed">
          This may take a moment.
        </p>
      </div>
    );
  }

  const platform = streamer?.platform || 'youtube';
  const cfg = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube;
  const isLive = !!streamer.isLive;

  const href = isLive
    ? streamer?.streamUrl || streamer?.channelUrl || `https://${platform}.com/${streamer?.channelId}`
    : streamer?.channelUrl || (platform === 'youtube'
        ? `https://www.youtube.com/channel/${streamer?.channelId}`
        : `https://kick.com/${streamer?.channelId}`);

  const avatarLetter = (streamer?.channelName || '?').charAt(0).toUpperCase();
  const kickEmbedUrl = platform === 'kick' && isLive ? getKickEmbedUrl(streamer) : null;

  const watchBtnClass = [
    'flex-1 text-center text-xs font-display font-semibold py-2 rounded',
    'transition-all duration-150 decoration-transparent select-none',
    isLive
      ? 'bg-valo-red text-white hover:brightness-110'
      : 'border border-valo-border text-valo-muted hover:border-valo-muted hover:text-white',
  ].join(' ');

  return (
    <div className="group bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 animate-fade-in flex flex-col justify-between relative">

      {/* ── PREVIEW/AVATAR CANVAS AREA ── */}
      {platform === 'youtube' ? (
        /* 🔴 YOUTUBE PLATFORM SPECIFIC OVERRIDE: Large thumbnail box stripped, profile avatar prioritized */
        <a href={href} target="_blank" rel="noopener noreferrer" className="block relative p-6 bg-gradient-to-br from-neutral-950/60 to-neutral-900/10 border-b border-valo-border/40 select-none">
          
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            {/* Circular Identity Badge Wrapper */}
            <div className="relative">
              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className={`w-20 h-20 rounded-full object-cover border-2 transition-all duration-300
                    ${isLive ? 'border-valo-red shadow-[0_0_20px_rgba(255,70,85,0.25)] scale-105' : 'border-neutral-800'}`}
                  loading="lazy"
                />
              ) : (
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-bold border-2 border-neutral-800"
                  style={{ background: `${cfg.accentColor}15`, color: cfg.accentColor }}
                >
                  {avatarLetter}
                </div>
              )}

              {/* Status Dot Beacon Accent */}
              {isLive && (
                <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-valo-red border-2 border-[#0c0d10] rounded-full animate-pulse" />
              )}
            </div>

            {/* Platform Identity Module */}
            <div className="space-y-1.5 w-full">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-white font-display font-bold text-base line-clamp-1">
                  {streamer.channelName}
                </span>
                
                {/* Unified Name Status Badge */}
                <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${cfg.bgClass}`}>
                  <img src={cfg.logo} alt="" className="h-2.5 object-contain" />
                  <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      ) : (
        /* 🟢 KICK PLATFORM PREVIEW: Left exactly the same as your original style logic definitions */
        <div className="relative aspect-video bg-[#111] overflow-hidden">
          {kickEmbedUrl ? (
            <iframe
              src={kickEmbedUrl}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-4">
                {streamer.avatar ? (
                  <img
                    src={streamer.avatar}
                    alt={streamer.channelName}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/10 shadow-xl"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold"
                    style={{ background: `${cfg.accentColor}20`, color: cfg.accentColor }}
                  >
                    {avatarLetter}
                  </div>
                )}
                <div className="text-center space-y-1">
                  <p className="text-white font-display font-bold text-lg line-clamp-1">
                    {streamer.channelName}
                  </p>
                  <p className="text-sm text-valo-muted font-body">
                    {isLive ? `is live on ${cfg.label}` : `is offline on ${cfg.label}`}
                  </p>
                </div>
              </div>
            </a>
          )}

          {/* Floating Live Indicator Block Overlays */}
          {isLive && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="live-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
                LIVE
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
              <img src={cfg.logo} alt={cfg.label} className="h-3 object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE DATA METRIC LINE COUNTER OVERLAYS ── */}
      {isLive && streamer.viewerCount != null && (
        <div className="absolute top-3 right-3 z-10 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded border border-neutral-800">
          {formatViewerCount(streamer.viewerCount)} tracking
        </div>
      )}

      {/* Meta description row */}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        <div className="px-3.5 pt-3">
          <p className="text-xs font-body text-valo-muted line-clamp-1">
            {isLive
              ? (streamer.title || `${streamer.channelName} is currently live`)
              : `Visit ${streamer.channelName}'s connection line`}
          </p>
        </div>
      </a>

      {/* ── FOOTER ACTIONS CONTROLS CONSOLE ── */}
      <div className="p-3.5 pt-2 space-y-3">
        <div className="flex items-center justify-between gap-2 border-t border-neutral-900/60 pt-2">
          <div className="flex items-center gap-2 min-w-0">
            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={streamer.channelName}
                className="w-5 h-5 rounded-full object-cover shrink-0 border border-neutral-800"
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
                <svg className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
                </svg>
              )}
            </div>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-display font-semibold px-2 py-0.5 rounded ${cfg.bgClass}`}>
            <img src={cfg.logo} alt="" className="h-2.5 object-contain" />
            {cfg.label}
          </span>
        </div>

        <div className="flex gap-2 items-center w-full">
          <a href={href} target="_blank" rel="noopener noreferrer" className={watchBtnClass}>
            {isLive ? 'Watch Live' : 'View Channel'}
          </a>
          <NotifyButton streamerId={streamer.id || streamer.streamer_id || streamer.channelId} />
        </div>
      </div>

    </div>
  );
}

function loadingIcon() {
  return (
    <svg className="w-6 h-6 text-neutral-500 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="4" className="opacity-75" />
    </svg>
  );
}
