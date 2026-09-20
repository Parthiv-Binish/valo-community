// src/components/stream/Leaderboard.jsx
import { formatViewerCount } from '../../utils/format'

const PLATFORM_CONFIG = {
  youtube: {
    label: 'YouTube',
    shortLabel: 'YT',
    logo:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    accent: '#ff4444',
    glow: 'rgba(255, 68, 68, 0.18)',
  },
  kick: {
    label: 'Kick',
    shortLabel: 'KICK',
    logo: 'https://kick.com/img/kick-logo.svg',
    accent: '#53fc18',
    glow: 'rgba(83, 252, 24, 0.15)',
  },
}

function VerifiedIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Verified"
    >
      <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
    </svg>
  )
}

function CrownIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M3 7l4.5 4L12 4l4.5 7L21 7l-1.5 12h-15L3 7z" />
      <path d="M5 19h14" />
    </svg>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      {[0, 1].map((column) => (
        <div
          key={column}
          className="overflow-hidden rounded-2xl border border-valo-border bg-valo-card/80"
        >
          <div className="p-4 border-b border-valo-border">
            <div className="h-4 w-32 rounded bg-neutral-800 animate-pulse" />
            <div className="h-2.5 w-20 rounded bg-neutral-800/70 animate-pulse mt-2" />
          </div>

          <div className="p-3 space-y-2">
            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="h-[58px] rounded-xl bg-neutral-900/60 animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyLeaderboard({ platform, accent }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-neutral-800 bg-black/20 px-4 py-10 text-center">
      <div
        className="absolute inset-x-1/3 -top-12 h-24 blur-3xl opacity-20"
        style={{ background: accent }}
      />

      <div className="relative">
        <div
          className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl border"
          style={{
            borderColor: `${accent}35`,
            background: `${accent}10`,
            color: accent,
          }}
        >
          <span className="text-lg">⌁</span>
        </div>

        <p className="text-xs font-display font-semibold uppercase tracking-wider text-neutral-300">
          No live creators
        </p>

        <p className="mt-1 text-[11px] text-valo-muted">
          Nobody is currently streaming on {platform}
        </p>
      </div>
    </div>
  )
}

function LeaderboardRow({ streamer, index, platform }) {
  const rank = index + 1
  const isFirst = rank === 1
  const accent = platform.accent

  return (
    <a
      href={streamer.streamUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        group relative flex items-center gap-3 rounded-xl border
        px-3 py-2.5 overflow-hidden
        transition-all duration-200
        ${
          isFirst
            ? 'border-white/[0.10] bg-white/[0.045]'
            : 'border-white/[0.045] bg-black/20 hover:border-white/[0.10] hover:bg-white/[0.035]'
        }
      `}
      style={
        isFirst
          ? {
              boxShadow: `inset 2px 0 0 ${accent}, 0 0 24px ${platform.glow}`,
            }
          : undefined
      }
    >
      {/* Hover sweep */}
      <div
        className="absolute inset-y-0 left-0 w-0 group-hover:w-full opacity-[0.035] transition-all duration-300 pointer-events-none"
        style={{ background: accent }}
      />

      {/* Rank */}
      <div className="relative w-7 shrink-0 flex justify-center">
        {isFirst ? (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              background: `${accent}18`,
              color: accent,
              boxShadow: `0 0 14px ${platform.glow}`,
            }}
          >
            <CrownIcon />
          </div>
        ) : (
          <span className="font-mono text-xs font-bold text-neutral-500">
            {String(rank).padStart(2, '0')}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        {streamer.avatar ? (
          <img
            src={streamer.avatar}
            alt=""
            className={`
              h-9 w-9 rounded-full object-cover
              border transition-all duration-200
              ${isFirst ? 'border-white/20' : 'border-white/10'}
              group-hover:border-white/25
            `}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold font-display"
            style={{
              background: `${accent}12`,
              borderColor: `${accent}30`,
              color: accent,
            }}
          >
            {(streamer.channelName || '?').charAt(0).toUpperCase()}
          </div>
        )}

        {/* Live dot */}
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-valo-card animate-pulse"
          style={{ background: accent }}
        />
      </div>

      {/* Creator */}
      <div className="relative min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <p
            className={`
              min-w-0 truncate text-sm font-semibold
              transition-colors duration-150
              ${isFirst ? 'text-white' : 'text-neutral-200'}
              group-hover:text-white
            `}
          >
            {streamer.channelName}
          </p>

          {streamer.verified && <VerifiedIcon />}
        </div>

        <p className="mt-0.5 truncate text-[10px] leading-4 text-valo-muted">
          {streamer.title || 'Streaming live now'}
        </p>
      </div>

      {/* Viewers */}
      <div className="relative shrink-0 text-right">
        <div className="flex items-center justify-end gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: accent }}
          />

          <span className="font-mono text-xs font-bold text-white">
            {formatViewerCount(streamer.viewerCount || 0)}
          </span>
        </div>

        <span className="text-[9px] uppercase tracking-wider text-neutral-600">
          viewers
        </span>
      </div>

      {/* Arrow */}
      <svg
        className="relative h-3.5 w-3.5 shrink-0 text-neutral-700 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-neutral-400"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </a>
  )
}

function PlatformLeaderboard({ list, platform }) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-valo-border bg-valo-card/80 backdrop-blur-md">
      {/* Platform glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full blur-3xl opacity-[0.08]"
        style={{ background: platform.accent }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-valo-border px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border"
            style={{
              background: `${platform.accent}10`,
              borderColor: `${platform.accent}25`,
            }}
          >
            <img
              src={platform.logo}
              alt={platform.label}
              className="max-h-3.5 max-w-[26px] object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xs font-bold uppercase tracking-widest text-white">
                {platform.label}
              </h2>

              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ background: platform.accent }}
              />
            </div>

            <p className="mt-0.5 text-[9px] uppercase tracking-wider text-valo-muted">
              Live viewer rankings
            </p>
          </div>
        </div>

        <div
          className="rounded-md border px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-wider"
          style={{
            color: platform.accent,
            borderColor: `${platform.accent}25`,
            background: `${platform.accent}08`,
          }}
        >
          LIVE
        </div>
      </div>

      {/* Rows */}
      <div className="relative p-2.5">
        {list.length === 0 ? (
          <EmptyLeaderboard
            platform={platform.label}
            accent={platform.accent}
          />
        ) : (
          <div className="space-y-1.5">
            {list.map((streamer, index) => (
              <LeaderboardRow
                key={streamer.dbId || streamer.channelId}
                streamer={streamer}
                index={index}
                platform={platform}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {list.length > 0 && (
        <div className="flex items-center justify-between border-t border-valo-border px-4 py-2.5">
          <span className="text-[9px] uppercase tracking-wider text-neutral-600">
            Top {list.length} live creators
          </span>

          <span className="font-mono text-[9px] text-neutral-600">
            LIVE DATA
          </span>
        </div>
      )}
    </section>
  )
}

export default function Leaderboard({ streamers, isLoading }) {
  if (isLoading) {
    return <LeaderboardSkeleton />
  }

  const safeStreamers = Array.isArray(streamers) ? streamers : []

  const ytLeaderboard = safeStreamers
    .filter((streamer) => streamer.platform === 'youtube' && streamer.isLive)
    .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
    .slice(0, 5)

  const kickLeaderboard = safeStreamers
    .filter((streamer) => streamer.platform === 'kick' && streamer.isLive)
    .sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
    .slice(0, 5)

  return (
    <div className="mb-8">
      {/* Section heading */}
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-valo-red animate-pulse" />

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-valo-red">
              Live intelligence
            </span>
          </div>

          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-white">
            Live Rankings
          </h2>
        </div>

        <div className="hidden sm:block font-mono text-[9px] uppercase tracking-wider text-neutral-600">
          Ranked by current viewers
        </div>
      </div>

      {/* Platform leaderboards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PlatformLeaderboard
          list={ytLeaderboard}
          platform={PLATFORM_CONFIG.youtube}
        />

        <PlatformLeaderboard
          list={kickLeaderboard}
          platform={PLATFORM_CONFIG.kick}
        />
      </div>
    </div>
  )
}
