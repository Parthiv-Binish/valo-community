import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profilePath } from '../../utils/profile'
import { formatViewerCount, formatLiveDuration } from '../../utils/format'
import NotifyButton from '../common/NotifyButton'

/*
 * Kick live streams automatically load the muted player.
 *
 * The player uses autoplay=true&muted=true, so users can see
 * the live stream directly inside the VALO Community card
 * without audio unexpectedly playing.
 */
const AUTOPLAY_KICK_PREVIEWS = true

const PLATFORM_CONFIG = {
  youtube: {
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    label: 'YouTube',
    accentColor: '#ff4444',
    bgClass: 'bg-[#ff0000]/10 text-[#ff4444]',
  },

  kick: {
    logo: 'https://kick.com/img/kick-logo.svg',
    label: 'Kick',
    accentColor: '#53fc18',
    bgClass: 'bg-[#53fc18]/10 text-[#53fc18]',
  },
}

function getKickEmbedUrl(streamer) {
  const channel =
    streamer.channelName ||
    streamer.channelId

  if (!channel) return null

  return `https://player.kick.com/${channel}?autoplay=true&muted=true`
}

export default function StreamerCard({ streamer }) {
  const [previewOn, setPreviewOn] = useState(false)

  // Hooks must run before any early return.
  if (!streamer) return null

  const isUnscrapedYoutube =
    streamer.platform === 'youtube' &&
    (!streamer.channelName ||
      streamer.channelName.startsWith('UC'))

  const isUnscrapedKick =
    streamer.platform === 'kick' &&
    !streamer.channelName

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
    )
  }

  const platform =
    streamer?.platform || 'youtube'

  const cfg =
    PLATFORM_CONFIG[platform] ||
    PLATFORM_CONFIG.youtube

  const isLive = streamer.isLive

  /*
   * External destination.
   *
   * Used ONLY by Watch Live / View Channel.
   */
  const externalUrl =
    isLive
      ? streamer?.streamUrl ||
        streamer?.channelUrl ||
        `https://${platform}.com/${streamer?.channelId}`
      : streamer?.channelUrl ||
        (
          platform === 'youtube'
            ? `https://www.youtube.com/channel/${streamer?.channelId}`
            : `https://kick.com/${streamer?.channelId}`
        )

  /*
   * Internal VALO Community profile.
   */
  const profileUrl = profilePath(streamer)

  const avatarLetter =
    (streamer?.channelName || '?')
      .charAt(0)
      .toUpperCase()

  /*
   * Kick embed only exists while live.
   */
  const kickEmbedUrl =
    platform === 'kick' && isLive
      ? getKickEmbedUrl(streamer)
      : null

  /*
   * Since AUTOPLAY_KICK_PREVIEWS is true,
   * live Kick streams automatically show the iframe.
   */
  const showKickPlayer =
    !!kickEmbedUrl &&
    (AUTOPLAY_KICK_PREVIEWS || previewOn)

  /*
   * Only trust a thumbnail while live.
   */
  const liveThumb =
    isLive && streamer.thumbnail
      ? streamer.thumbnail
      : null

  const liveFor =
    isLive
      ? formatLiveDuration(streamer.startedAt)
      : null

  const watchBtnClass = [
    'flex-1',
    'text-center',
    'text-xs',
    'font-display',
    'font-semibold',
    'py-2',
    'rounded',
    'transition-all',
    'duration-150',
    'decoration-transparent',
    'select-none',
    isLive
      ? 'bg-valo-red text-white hover:brightness-110'
      : 'border border-valo-border text-valo-muted hover:border-valo-muted hover:text-white',
  ].join(' ')

  return (
    <article className="group bg-valo-card rounded-xl overflow-hidden border border-valo-border hover:border-valo-red/40 hover:shadow-[0_0_30px_rgba(255,68,68,0.08)] transition-all duration-200 animate-fade-in flex flex-col justify-between">

      {/* ═══════════════════════════════════════════════════════════════════
          PREVIEW AREA
          ═══════════════════════════════════════════════════════════════════ */}

      <div className="relative aspect-video bg-[#111] overflow-hidden">

        {/* ═══════════════════════════════════════════════════════════════
            KICK LIVE
            ═══════════════════════════════════════════════════════════════ */}

        {platform === 'kick' &&
        kickEmbedUrl &&
        showKickPlayer ? (
          <>
            <iframe
              src={kickEmbedUrl}
              title={`${streamer.channelName} live stream`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups"
            />

            {/* Kick live indicator */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-black/75 backdrop-blur-sm border border-[#53fc18]/30 text-[#53fc18] text-[9px] font-mono font-bold tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-[#53fc18] animate-pulse" />
                LIVE
              </span>
            </div>

            {/* Kick platform badge */}
            <div className="absolute top-3 right-3 z-20 pointer-events-none">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5 border border-white/10">
                <img
                  src={cfg.logo}
                  alt={cfg.label}
                  className="h-3 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />

                <span className="text-[9px] font-mono font-bold text-white">
                  KICK
                </span>
              </div>
            </div>

            {/* Viewer count */}
            {streamer.viewerCount != null && (
              <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-black/75 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
                {formatViewerCount(streamer.viewerCount)}
                {' watching'}
                {liveFor
                  ? ` · ${liveFor}`
                  : ''}
              </div>
            )}

            {/* Open profile */}
            <Link
              to={profileUrl}
              aria-label={`View ${streamer.channelName}'s profile`}
              className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/75 backdrop-blur-sm border border-white/10 hover:border-[#53fc18]/50 text-white hover:text-[#53fc18] text-[9px] font-mono uppercase tracking-wider px-2.5 py-1.5 rounded"
            >
              Profile →
            </Link>
          </>

        ) : platform === 'kick' ? (

          /* ═══════════════════════════════════════════════════════════════
             KICK OFFLINE / FALLBACK
             ═══════════════════════════════════════════════════════════════ */

          <Link
            to={profileUrl}
            aria-label={`View ${streamer.channelName}'s profile`}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(
                    circle at 50% 35%,
                    rgba(83, 252, 24, 0.18),
                    transparent 45%
                  ),
                  radial-gradient(
                    circle at 15% 90%,
                    rgba(83, 252, 24, 0.08),
                    transparent 40%
                  ),
                  linear-gradient(
                    135deg,
                    #101510 0%,
                    #080b08 55%,
                    #050505 100%
                  )
                `,
              }}
            />

            {liveThumb && (
              <img
                src={liveThumb}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}

            <div className="absolute inset-0 bg-black/35" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">

              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  loading="lazy"
                  className="
                    w-20 h-20
                    rounded-full
                    object-cover
                    border-2
                    border-[#53fc18]/60
                    shadow-[0_0_35px_rgba(83,252,24,0.3)]
                  "
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div
                  className="
                    w-20 h-20
                    rounded-full
                    flex items-center justify-center
                    text-3xl
                    font-display
                    font-bold
                    border-2
                    border-[#53fc18]/50
                  "
                  style={{
                    background:
                      'rgba(83,252,24,0.12)',
                    color: '#53fc18',
                  }}
                >
                  {avatarLetter}
                </div>
              )}

              <div className="text-center space-y-1">

                <p className="text-white font-display font-bold text-lg line-clamp-1">
                  {streamer.channelName}
                </p>

                <p className="text-[#53fc18] text-[10px] font-mono uppercase tracking-widest">
                  Offline on Kick
                </p>

              </div>

              <span className="
                absolute
                bottom-4
                px-3
                py-1.5
                rounded-full
                bg-black/75
                backdrop-blur-sm
                border
                border-[#53fc18]/20
                text-[#53fc18]
                text-[9px]
                font-mono
                uppercase
                tracking-widest
              ">
                View Profile →
              </span>

            </div>
          </Link>

        ) : (

          /* ═══════════════════════════════════════════════════════════════
             YOUTUBE LIVE / OFFLINE
             ═══════════════════════════════════════════════════════════════ */

          <Link
            to={profileUrl}
            aria-label={`View ${streamer.channelName}'s profile`}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />

            {platform === 'youtube' && liveThumb && (
              <img
                src={liveThumb}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}

            <div
              className={`absolute inset-0 flex flex-col items-center justify-center gap-4 p-4 ${
                platform === 'youtube' && liveThumb
                  ? 'opacity-0 group-hover:opacity-100 bg-black/45 transition-opacity duration-200'
                  : ''
              }`}
            >

              {streamer.avatar ? (
                <img
                  src={streamer.avatar}
                  alt={streamer.channelName}
                  className={`w-20 h-20 rounded-full object-cover shadow-xl border-4 ${
                    platform === 'youtube' && isLive
                      ? 'border-valo-red shadow-valo-red/20'
                      : 'border-white/10'
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold"
                  style={{
                    background:
                      `${cfg.accentColor}20`,
                    color: cfg.accentColor,
                  }}
                >
                  {avatarLetter}
                </div>
              )}

              <div className="text-center space-y-1">

                <p className="text-white font-display font-bold text-lg line-clamp-1">
                  {streamer.channelName}
                </p>

                <p className="text-sm text-valo-muted font-body">
                  {isLive
                    ? `is live on ${cfg.label}`
                    : `is offline on ${cfg.label}`}
                </p>

              </div>

              {liveThumb && (
                <span className="absolute bottom-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white">
                  View Profile →
                </span>
              )}

            </div>
          </Link>
        )}

        {/* ═════════════════════════════════════════════════════════════════
            GLOBAL LIVE BADGE
            ═════════════════════════════════════════════════════════════════ */}

        {isLive && platform !== 'kick' && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
              LIVE
            </span>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
            PLATFORM BADGE
            ═════════════════════════════════════════════════════════════════ */}

        {platform !== 'kick' && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">

              <img
                src={cfg.logo}
                alt={cfg.label}
                className="h-3 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════
            YOUTUBE VIEWER COUNT
            ═════════════════════════════════════════════════════════════════ */}

        {isLive &&
        platform !== 'kick' &&
        streamer.viewerCount != null && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-xs font-mono px-2 py-1 rounded">
            {formatViewerCount(streamer.viewerCount)}
            {' watching'}
            {liveFor
              ? ` · ${liveFor}`
              : ''}
          </div>
        )}

      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          STREAM META
          ═══════════════════════════════════════════════════════════════════ */}

      <Link
        to={profileUrl}
        aria-label={`View ${streamer.channelName}'s profile`}
        className="block group/meta"
      >
        <div className="px-3 pt-3">

          {isLive &&
          streamer.title &&
          streamer.title !== 'Live Stream' ? (
            <p
              className="text-sm font-body text-white/90 line-clamp-2 group-hover/meta:text-white transition-colors"
              title={streamer.title}
            >
              {streamer.title}
            </p>
          ) : (
            <p className="text-sm font-body text-valo-muted group-hover/meta:text-white transition-colors">

              {platform === 'youtube'
                ? (
                    isLive
                      ? `${streamer.channelName} is live on YouTube`
                      : `${streamer.channelName} is offline`
                  )
                : (
                    isLive
                      ? `${streamer.channelName} is currently live`
                      : `Visit ${streamer.channelName}'s channel`
                  )}

            </p>
          )}

          {(streamer.language ||
            (isLive && streamer.category)) && (
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
      </Link>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════════ */}

      <div className="p-3 pt-2 space-y-3">

        {/* Streamer identity */}

        <div className="flex items-center justify-between gap-2">

          <Link
            to={profileUrl}
            title={`View ${streamer.channelName}'s profile`}
            className="group/profile flex items-center gap-2 min-w-0 rounded-md px-1.5 py-1 -ml-1.5 hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-valo-red"
          >

            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={streamer.channelName}
                className="w-6 h-6 rounded-full object-cover shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold font-display"
                style={{
                  background:
                    `${cfg.accentColor}20`,
                  color:
                    cfg.accentColor,
                }}
              >
                {avatarLetter}
              </div>
            )}

            <div className="flex items-center gap-1 min-w-0">

              <span className="text-xs text-valo-muted font-body truncate group-hover/profile:text-white group-hover/profile:underline underline-offset-2">
                {streamer.channelName}
              </span>

              {streamer.verified && (
                <svg
                  className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-label="Verified"
                >
                  <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5a1.55 1.55 0 0 1 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57a1.55 1.55 0 0 1 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
                </svg>
              )}

            </div>
          </Link>

          {/* Platform */}

          <span
            className={`shrink-0 inline-flex items-center gap-1.5 text-xs font-display font-semibold px-2 py-0.5 rounded ${cfg.bgClass}`}
          >
            <img
              src={cfg.logo}
              alt={cfg.label}
              className="h-2.5 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />

            {cfg.label}
          </span>

        </div>

        {/* ═════════════════════════════════════════════════════════════════
            ACTIONS
            ═════════════════════════════════════════════════════════════════ */}

        <div className="flex gap-2 items-center w-full">

          {/* External platform */}

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={watchBtnClass}
          >
            {isLive
              ? 'Watch Live'
              : 'View Channel'}
          </a>

          {/* Internal VALO Community profile */}

          <Link
            to={profileUrl}
            className="flex-1 text-center text-xs font-display font-semibold py-2 rounded border border-valo-border text-valo-muted hover:border-valo-red/60 hover:text-white hover:bg-valo-red/5 transition-all duration-150"
          >
            Profile →
          </Link>

          {/* Notification */}

          <NotifyButton
            streamerId={
              streamer.id ||
              streamer.streamer_id ||
              streamer.channelId
            }
          />

        </div>

      </div>

    </article>
  )
}

function loadingIcon() {
  return (
    <svg
      className="w-6 h-6 text-neutral-500 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-25"
      />

      <path
        d="M2 12a10 10 0 0 1 10-10"
        stroke="currentColor"
        strokeWidth="4"
        className="opacity-75"
      />
    </svg>
  )
}
