import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profilePath } from '../../utils/profile'
import { formatViewerCount, formatLiveDuration } from '../../utils/format'
import NotifyButton from '../common/NotifyButton';

// Live Kick cards used to autoplay a muted iframe player each, which loads N
// video players at once on a busy grid (heavy on phones / mobile data). By
// default the preview now loads on tap. Set to true to restore autoplay.
const AUTOPLAY_KICK_PREVIEWS = false

const PLATFORM_CONFIG = {
  youtube: {
    logo:        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    label:       'YouTube',
    accentColor: '#ff4444',
    bgClass:     'bg-[#ff0000]/10 text-[#ff4444]',
  },
  kick: {
    logo:        'https://kick.com/img/kick-logo.svg',
    label:       'Kick',
    accentColor: '#53fc18',
    bgClass:     'bg-[#53fc18]/10 text-[#53fc18]',
  },
}

function getKickEmbedUrl(streamer) {
  const channel = streamer.channelName || streamer.channelId;
  if (!channel) return null;
  return `https://player.kick.com/${channel}?autoplay=true&muted=true`;
}

export default function StreamerCard({ streamer }) {
  // Hooks must run before any early return (rules of hooks).
  const [previewOn, setPreviewOn] = useState(false);

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
  const isLive = streamer.isLive;

  const href = isLive
    ? streamer?.streamUrl || streamer?.channelUrl || `https://${platform}.com/${streamer?.channelId}`
    : streamer?.channelUrl || (platform === 'youtube'
        ? `https://www.youtube.com/channel/${streamer?.channelId}`
        : `https://kick.com/${streamer?.channelId}`);

  const avatarLetter = (streamer?.channelName || '?').charAt(0).toUpperCase();
  const kickEmbedUrl = platform === 'kick' && isLive ? getKickEmbedUrl(streamer) : null;
  const showKickPlayer = !!kickEmbedUrl && (AUTOPLAY_KICK_PREVIEWS || previewOn);
  // Only trust a thumbnail while the stream is live (stored ones go stale).
  const liveThumb = isLive && streamer.thumbnail ? streamer.thumbnail : null;
  const liveFor = isLive ? formatLiveDuration(streamer.startedAt) : null;

  const watchBtnClass = [
    'flex-1 text-center text-xs font-display font-semibold py-2 rounded',
    'transition-all duration-150 decoration-transparent select-none',
    isLive
      ? 'bg-valo-red text-white hover:brightness-110'
      : 'border border-valo-border text-valo-muted hover:border-valo-muted hover:text-white',
  ].join(' ');

  return (
    <div className="group bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 animate-fade-in flex flex-col justify-between">

      {/* Preview area */}
      <div className="relative aspect-video bg-[#111] overflow-hidden">

        {platform === 'kick' && kickEmbedUrl && showKickPlayer ? (
          /* Kick live: iframe embed (loaded on tap unless autoplay is enabled) */
          <iframe
            src={kickEmbedUrl}
            title={`${streamer.channelName} live preview`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : platform === 'kick' && kickEmbedUrl ? (
          /* Kick live: lightweight poster with a play-preview button */
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
            {liveThumb && (
              <img
                src={liveThumb}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            {!liveThumb && streamer.avatar && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  loading="lazy"
                  className="w-20 h-20 rounded-full object-cover shadow-xl border-4 border-white/10"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}
            <button
              type="button"
              onClick={() => setPreviewOn(true)}
              aria-label={`Play live preview of ${streamer.channelName}`}
              className="absolute inset-0 z-[5] flex items-center justify-center bg-black/25 hover:bg-black/40 transition-colors"
            >
              <span className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-xs font-display font-semibold px-3 py-1.5 rounded-full border border-white/10">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                Play preview
              </span>
            </button>
          </div>
        ) : (
          /* YouTube (Both Live & Offline) + Kick Offline */
          <a href={href} target="_blank" rel="noopener noreferrer" className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
            {platform === 'youtube' && liveThumb && (
              <img
                src={liveThumb}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 ${platform === 'youtube' && liveThumb ? 'opacity-0 pointer-events-none' : ''}`}>
              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className={`w-20 h-20 rounded-full object-cover shadow-xl border-4 ${
                    platform === 'youtube' && isLive ? 'border-valo-red shadow-valo-red/20' : 'border-white/10'
                  }`}
                  loading="lazy"
                  onError={(e) => { e.target.style.display = 'none' }}
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

        {/* Badges — always on top */}
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
            <img
              src={cfg.logo}
              alt={cfg.label}
              className="h-3 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
        </div>
        {isLive && streamer.viewerCount != null && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
            {formatViewerCount(streamer.viewerCount)} watching{liveFor ? ` · ${liveFor}` : ''}
          </div>
        )}
      </div>

      {/* Meta description row */}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        <div className="px-3 pt-3">
          {isLive && streamer.title && streamer.title !== 'Live Stream' ? (
            <p className="text-sm font-body text-white/90 line-clamp-2" title={streamer.title}>
              {streamer.title}
            </p>
          ) : (
            <p className="text-sm font-body text-valo-muted">
              {platform === 'youtube'
                ? (isLive ? `${streamer.channelName} is live on YouTube` : `${streamer.channelName} is offline`)
                : (isLive ? `${streamer.channelName} is currently live` : `Visit ${streamer.channelName}'s channel`)
              }
            </p>
          )}
          {(streamer.language || (isLive && streamer.category)) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {streamer.language && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                  {streamer.language}
                </span>
              )}
              {isLive && streamer.category && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-valo-red/10 text-valo-red border border-valo-red/20 truncate max-w-[160px]">
                  {streamer.category}
                </span>
              )}
            </div>
          )}
        </div>
      </a>

      {/* Footer */}
      <div className="p-3 pt-1 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Link
            to={profilePath(streamer)}
            title={`View ${streamer.channelName}'s profile`}
            className="group/profile flex items-center gap-2 min-w-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-valo-red"
          >
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
              <span className="text-xs text-valo-muted font-body truncate group-hover/profile:text-white group-hover/profile:underline underline-offset-2">
                {streamer.channelName}
              </span>
              {streamer.verified && (
                <svg className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
                </svg>
              )}
            </div>
          </Link>
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
