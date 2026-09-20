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
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0c10] min-h-[290px] md:min-h-[310px] flex flex-col items-center justify-center text-center px-6 py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,68,68,0.07),transparent_42%)]" />
        <div className="relative w-14 h-14 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4 text-neutral-500 font-mono text-lg">
          {loadingIcon()}
        </div>

        <h3 className="relative font-display font-black text-sm text-white uppercase tracking-[0.16em] mb-2">
          Syncing Profile
        </h3>

        <p className="relative text-xs text-neutral-500 font-body max-w-[210px] leading-relaxed">
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
    'min-w-0',
    'text-center',
    'text-[11px]',
    'font-display',
    'font-bold',
    'uppercase',
    'tracking-wide',
    'py-2.5',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'decoration-transparent',
    'select-none',
    isLive
      ? 'bg-valo-red text-white hover:bg-[#ff5656] hover:shadow-[0_0_20px_rgba(255,68,68,0.18)]'
      : 'border border-white/[0.08] text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/[0.03]',
  ].join(' ')

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b0c10] hover:border-valo-red/30 hover:shadow-[0_18px_55px_rgba(0,0,0,0.35),0_0_35px_rgba(255,68,68,0.06)] transition-all duration-300 flex flex-col">
      {/* Preview */}
      <div className="relative aspect-video min-h-0 bg-[#08090c] overflow-hidden">
        {/* Subtle top lighting */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%,rgba(0,0,0,0.2))]" />

        {/* KICK LIVE */}
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

            <div className="absolute top-3 left-3 z-20 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/75 backdrop-blur-md border border-[#53fc18]/25 text-[#53fc18] text-[9px] font-mono font-bold tracking-[0.16em] shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#53fc18] animate-pulse" />
                LIVE
              </span>
            </div>

            {streamer.viewerCount != null && (
              <div className="absolute bottom-3 left-3 z-20 pointer-events-none bg-black/75 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-md">
                {formatViewerCount(streamer.viewerCount)}
                {' watching'}
                {liveFor
                  ? ` · ${liveFor}`
                  : ''}
              </div>
            )}

          </>
        ) : platform === 'kick' ? (
          /* KICK OFFLINE / FALLBACK */
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
                    rgba(83, 252, 24, 0.14),
                    transparent 45%
                  ),
                  radial-gradient(
                    circle at 15% 90%,
                    rgba(83, 252, 24, 0.06),
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
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
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
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#53fc18]/50 shadow-[0_0_35px_rgba(83,252,24,0.22)]"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-display font-bold border-2 border-[#53fc18]/40"
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

                <p className="text-[#53fc18] text-[10px] font-mono uppercase tracking-[0.16em]">
                  Offline on Kick
                </p>
              </div>

              <span className="absolute bottom-4 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#53fc18]/20 text-[#53fc18] text-[9px] font-mono uppercase tracking-widest">
                Offline
              </span>
            </div>
          </Link>
        ) : (
          /* YOUTUBE LIVE / OFFLINE */
          <Link
            to={profileUrl}
            aria-label={`View ${streamer.channelName}'s profile`}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#18191d] to-[#0a0b0e]" />

            {platform === 'youtube' && liveThumb && (
              <img
                src={liveThumb}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

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

                <p className="text-sm text-neutral-400 font-body">
                  {isLive
                    ? `is live on ${cfg.label}`
                    : `is offline on ${cfg.label}`}
                </p>
              </div>

              {liveThumb && (
                <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-widest text-white">
                  Open Profile
                </span>
              )}
            </div>
          </Link>
        )}

        {/* LIVE BADGE */}
        {isLive && platform !== 'kick' && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-valo-red px-2.5 py-1.5 text-[9px] font-mono font-bold tracking-[0.16em] text-white shadow-[0_0_18px_rgba(255,68,68,0.22)]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-red" />
              LIVE
            </span>
          </div>
        )}

        {/* YOUTUBE VIEWER COUNT */}
        {isLive &&
        platform !== 'kick' &&
        streamer.viewerCount != null && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none bg-black/70 backdrop-blur-md border border-white/10 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-md">
            {formatViewerCount(streamer.viewerCount)}
            {' watching'}
            {liveFor
              ? ` · ${liveFor}`
              : ''}
          </div>
        )}

        {/* Bottom cinematic gradient */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0b0c10] to-transparent pointer-events-none z-[2]" />
      </div>

      {/* STREAM META */}
      <Link
        to={profileUrl}
        aria-label={`View ${streamer.channelName}'s profile`}
        className="block group/meta"
      >
        <div className={`px-4 ${isLive || streamer.title || streamer.language || streamer.category ? 'pt-3.5' : 'pt-2'}`}>
          {isLive &&
          streamer.title &&
          streamer.title !== 'Live Stream' ? (
            <p
              className="text-[13px] leading-5 font-body font-medium text-white/90 line-clamp-2 group-hover/meta:text-white transition-colors"
              title={streamer.title}
            >
              {streamer.title}
            </p>
          ) : (
            <p className="text-[13px] leading-5 font-body text-neutral-400 group-hover/meta:text-white transition-colors">
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
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              {streamer.language && (
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md bg-white/[0.04] text-neutral-400 border border-white/[0.07]">
                  {streamer.language}
                </span>
              )}

              {isLive && streamer.category && (
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] px-2 py-1 rounded-md bg-valo-red/[0.08] text-valo-red border border-valo-red/15 truncate max-w-[160px]">
                  {streamer.category}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      {/* FOOTER */}
      <div className={`px-4 pb-4 ${isLive || streamer.title || streamer.language || streamer.category ? 'pt-3' : 'pt-2'}`}>
        {/* Streamer identity */}
        <div className="flex items-center justify-between gap-2">
          <Link
            to={profileUrl}
            title={`View ${streamer.channelName}'s profile`}
            className="group/profile flex items-center gap-2 min-w-0 rounded-lg px-1.5 py-1 -ml-1.5 hover:bg-white/[0.03] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-valo-red"
          >
            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={streamer.channelName}
                className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-white/10"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold font-display ring-1 ring-white/10"
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
              <span className="text-xs text-neutral-400 font-body truncate group-hover/profile:text-white transition-colors">
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
            className={`shrink-0 inline-flex items-center gap-1.5 text-[10px] font-display font-bold uppercase tracking-wide px-2 py-1 rounded-md ${cfg.bgClass}`}
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

        {/* ACTIONS */}
        <div className="flex gap-2 items-center w-full min-w-0">
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
            className="flex-1 min-w-0 text-center text-[11px] font-display font-bold uppercase tracking-wide py-2.5 rounded-lg border border-white/[0.08] text-neutral-400 hover:border-valo-red/40 hover:text-white hover:bg-valo-red/[0.04] transition-all duration-200"
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
