import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import NotifyButton from '../components/common/NotifyButton'
import StreamCard from '../components/stream/StreamCard'
import { useAllStreamers } from '../hooks/useAllStreamers'
import { useStreamerInsights } from '../hooks/useStreamerInsights'
import { useStreamHistory } from '../hooks/useStreamHistory'
import { useStreamerStats } from '../hooks/useStreamerStats'
import { formatViewerCount, formatLiveDuration } from '../utils/format'
import { matchesProfile, profilePath, platformLabel } from '../utils/profile'

const SITE = "Let's Build VALO Community"
const ALSO_LIVE_LIMIT = 4

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════════ */

export default function StreamerProfilePage() {
  const { platform, handle } = useParams()
  const { streamers, isLoading } = useAllStreamers()

  const streamer = useMemo(
    () => streamers.find((s) => matchesProfile(s, platform, handle)) || null,
    [streamers, platform, handle]
  )

  const { slots: usualSlots } = useStreamerInsights(streamer?.dbId)

  const {
    streams: pastStreams,
    isLoading: historyLoading,
    hasMore: historyHasMore,
    loadMore: loadMoreHistory,
  } = useStreamHistory(streamer?.dbId)

  const {
    stats: streamerStats,
    isLoading: statsLoading,
  } = useStreamerStats(streamer?.dbId)

  // Other streamers who are live right now (same language first).
  const alsoLive = useMemo(() => {
    if (!streamer) return []

    const others = streamers.filter(
      (s) => s.isLive && s.dbId !== streamer.dbId
    )

    if (streamer.language) {
      others.sort(
        (a, b) =>
          Number(b.language === streamer.language) -
          Number(a.language === streamer.language)
      )
    }

    return others.slice(0, ALSO_LIVE_LIMIT)
  }, [streamers, streamer])

  // Page title / description.
  useEffect(() => {
    if (!streamer) return

    document.title =
      `${streamer.channelName} – VALORANT streamer | ${SITE}`

    const desc = document.querySelector('meta[name="description"]')

    if (desc) {
      desc.setAttribute(
        'content',
        streamer.isLive
          ? `${streamer.channelName} is live now on ${platformLabel(streamer.platform)}. Follow to get notified when they go live.`
          : `Follow ${streamer.channelName} on ${SITE} and get notified when they go live.`
      )
    }
  }, [streamer])

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">

        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-valo-muted hover:text-white transition-colors"
        >
          <span aria-hidden="true">←</span> All streamers
        </Link>

        {isLoading && !streamer ? (
          <ProfileSkeleton />
        ) : !streamer ? (
          <NotFound />
        ) : (
          <>
            <ProfileHeader streamer={streamer} />

            {streamer.isLive ? (
              <LivePanel streamer={streamer} />
            ) : (
              <OfflinePanel
                streamer={streamer}
                slots={usualSlots}
              />
            )}

            {/* STREAMING STATS */}
            <StreamingStats
              stats={streamerStats}
              isLoading={statsLoading}
            />

            {/* USUALLY LIVE */}
            {usualSlots.length > 0 && (
              <UsuallyLive
                slots={usualSlots}
                name={streamer.channelName}
              />
            )}

            {/* PAST STREAMS */}
            <PastStreams
              streams={pastStreams}
              isLoading={historyLoading}
              hasMore={historyHasMore}
              onLoadMore={loadMoreHistory}
            />

            {/* ALSO LIVE */}
            {alsoLive.length > 0 && (
              <section
                className="space-y-4"
                aria-label="Also live now"
              >
                <SectionTitle>Also live now</SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
                  {alsoLive.map((s) => (
                    <StreamCard
                      key={s.dbId || s.channelId}
                      streamer={s}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════════════════════════════════════ */

function ProfileHeader({ streamer }) {
  const isKick = streamer.platform === 'kick'
  const accent = isKick ? '#53fc18' : '#ff4444'
  const initial = (streamer.channelName || '?')
    .charAt(0)
    .toUpperCase()

  const watchUrl = streamer.isLive
    ? streamer.streamUrl
    : streamer.channelUrl

  return (
    <header className="relative overflow-hidden rounded-2xl border border-valo-border bg-valo-card">

      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            `radial-gradient(600px 200px at 0% 0%, ${accent}22, transparent 70%)`
        }}
      />

      <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center gap-5">

        <div className="relative shrink-0 self-start">

          {streamer.avatar ? (
            <img
              src={streamer.avatar}
              alt={streamer.channelName}
              referrerPolicy="no-referrer"
              className={`w-24 h-24 rounded-full object-cover border-4 ${
                streamer.isLive
                  ? 'border-valo-red'
                  : 'border-white/10'
              }`}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display font-black border-4 border-white/10"
              style={{
                background: `${accent}20`,
                color: accent
              }}
            >
              {initial}
            </div>
          )}

          {streamer.isLive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 live-badge">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">

          <div className="space-y-1.5">

            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">

              <h1 className="font-display font-black text-2xl sm:text-3xl text-white truncate max-w-full">
                {streamer.channelName}
              </h1>

              {streamer.verified && (
                <svg
                  className="w-5 h-5 shrink-0 text-[#3ea6ff]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-label="Verified"
                >
                  <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5a1.55 1.55 0 0 1 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57a1.55 1.55 0 0 1 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
                </svg>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">

              <span
                className={
                  isKick
                    ? 'platform-badge-kick'
                    : 'platform-badge-yt'
                }
              >
                {platformLabel(streamer.platform)}
              </span>

              {streamer.language && (
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-neutral-300 border border-white/10">
                  {streamer.language}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="valo-btn inline-flex items-center gap-2"
            >
              {streamer.isLive
                ? 'Watch live'
                : 'Visit channel'} on {platformLabel(streamer.platform)}

              <span aria-hidden="true">↗</span>
            </a>

            <NotifyButton streamerId={streamer.channelId} />

            <ShareButton streamer={streamer} />
          </div>
        </div>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE / OFFLINE PANELS
   ═══════════════════════════════════════════════════════════════════════════ */

function LivePanel({ streamer }) {
  const [previewOn, setPreviewOn] = useState(false)

  const isKick = streamer.platform === 'kick'
  const liveFor = formatLiveDuration(streamer.startedAt)
  const thumb = streamer.thumbnail || null

  const embed = isKick
    ? `https://player.kick.com/${streamer.channelId || streamer.channelName}?autoplay=true&muted=true`
    : null

  return (
    <section
      aria-label="Live now"
      className="grid md:grid-cols-5 gap-5 rounded-2xl border border-valo-red/30 bg-valo-card p-4 sm:p-5 border-glow"
    >

      <div className="md:col-span-3 relative aspect-video rounded-xl overflow-hidden bg-black">

        {embed && previewOn ? (
          <iframe
            src={embed}
            title={`${streamer.channelName} live preview`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <>
            {thumb ? (
              <img
                src={thumb}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
            )}

            {embed ? (
              <button
                type="button"
                onClick={() => setPreviewOn(true)}
                aria-label={`Play live preview of ${streamer.channelName}`}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/45 transition-colors"
              >
                <span className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-display font-semibold px-4 py-2 rounded-full border border-white/10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play preview
                </span>
              </button>
            ) : (
              <a
                href={streamer.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${streamer.channelName} live on YouTube`}
                className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors"
              >
                <span className="flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-display font-semibold px-4 py-2 rounded-full border border-white/10">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch on YouTube
                </span>
              </a>
            )}
          </>
        )}
      </div>

      <div className="md:col-span-2 flex flex-col justify-center gap-4 min-w-0">

        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-valo-red mb-1.5">
            Streaming now
          </p>

          <h2 className="font-display font-bold text-lg text-white leading-snug line-clamp-3">
            {streamer.title &&
            streamer.title !== 'Live Stream'
              ? streamer.title
              : `${streamer.channelName} is live`}
          </h2>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <Stat
            label="Watching"
            value={formatViewerCount(streamer.viewerCount || 0)}
          />

          <Stat
            label="Live for"
            value={liveFor || '—'}
          />

          {streamer.category && (
            <Stat
              label="Category"
              value={streamer.category}
              span
            />
          )}
        </dl>
      </div>
    </section>
  )
}

function OfflinePanel({ streamer, slots }) {
  return (
    <section
      aria-label="Offline"
      className="rounded-2xl border border-valo-border bg-valo-card p-5 sm:p-6 flex items-start gap-4"
    >
      <span
        className="w-2.5 h-2.5 mt-1.5 rounded-full bg-neutral-600 shrink-0"
        aria-hidden="true"
      />

      <div className="space-y-1">
        <h2 className="font-display font-bold text-base text-white">
          {streamer.channelName} is offline right now
        </h2>

        <p className="text-sm text-valo-muted">
          {slots.length > 0
            ? 'See when they usually stream below, or tap Notify me to get an alert the moment they go live.'
            : 'Tap Notify me to get an alert the moment they go live.'}
        </p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   STREAMING STATS
   ═══════════════════════════════════════════════════════════════════════════ */

function StreamingStats({ stats, isLoading }) {
  const formatDuration = (seconds) => {
    if (
      seconds == null ||
      Number.isNaN(Number(seconds))
    ) {
      return '—'
    }

    const total = Math.max(0, Number(seconds))
    const hours = Math.floor(total / 3600)
    const minutes = Math.floor((total % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }

    return `${minutes}m`
  }

  const formatHour = (hour) => {
    if (
      hour == null ||
      Number.isNaN(Number(hour))
    ) {
      return '—'
    }

    const h = Number(hour)
    const suffix = h >= 12 ? 'PM' : 'AM'
    const display = h % 12 || 12

    return `${display}:00 ${suffix}`
  }

  const dayName = (day) => {
    const names = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    if (
      day == null ||
      Number.isNaN(Number(day))
    ) {
      return '—'
    }

    // PostgreSQL ISODOW:
    // Monday = 1 ... Sunday = 7
    return names[Number(day) % 7]
  }

  const values = stats || {}

  const items = [
    [
      'Total streams',
      values.total_streams ?? 0
    ],
    [
      'Total live time',
      formatDuration(values.total_live_seconds)
    ],
    [
      'Avg. stream',
      formatDuration(values.average_stream_duration_seconds)
    ],
    [
      'Longest stream',
      formatDuration(values.longest_stream_seconds)
    ],
    [
      'Last 30 days',
      values.streams_last_30_days ?? 0
    ],
    [
      '30-day live time',
      formatDuration(values.live_seconds_last_30_days)
    ],
  ]

  return (
    <section
      className="space-y-4"
      aria-label="Streaming statistics"
    >
      <SectionTitle>
        Streaming Stats
      </SectionTitle>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {items.map(([label]) => (
            <div
              key={label}
              className="rounded-xl border border-valo-border bg-valo-card px-4 py-4 space-y-2"
            >
              <div className="h-3 w-2/3 rounded shimmer" />
              <div className="h-5 w-1/2 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : !stats ||
        Number(stats.total_streams || 0) === 0 ? (
        <div className="rounded-xl border border-valo-border bg-valo-card px-5 py-6 text-center">
          <p className="text-sm text-valo-muted">
            Streaming statistics will appear after stream history is recorded.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {items.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-valo-border bg-valo-card px-4 py-4"
              >
                <div className="text-[9px] font-mono uppercase tracking-widest text-valo-muted">
                  {label}
                </div>

                <div className="mt-1 font-display font-black text-lg text-white truncate">
                  {value}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="rounded-xl border border-valo-border bg-valo-card px-4 py-3">
              <div className="text-[9px] font-mono uppercase tracking-widest text-valo-muted">
                Usually starts
              </div>

              <div className="mt-1 font-display font-bold text-white">
                {formatHour(stats.most_common_start_hour)}
              </div>
            </div>

            <div className="rounded-xl border border-valo-border bg-valo-card px-4 py-3">
              <div className="text-[9px] font-mono uppercase tracking-widest text-valo-muted">
                Most active day
              </div>

              <div className="mt-1 font-display font-bold text-white">
                {dayName(stats.most_common_day_of_week)}
              </div>
            </div>

          </div>
        </>
      )}
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   USUALLY LIVE
   ═══════════════════════════════════════════════════════════════════════════ */

function UsuallyLive({ slots, name }) {
  return (
    <section
      className="space-y-4"
      aria-label="Usually live"
    >
      <SectionTitle>
        Usually live
      </SectionTitle>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

        {slots.map((slot) => (
          <li
            key={`${slot.day}-${slot.minuteOfDay}`}
            className="rounded-xl border border-valo-border bg-valo-card px-4 py-3 space-y-2"
          >

            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-display font-semibold text-white">
                {slot.label}
              </span>

              <span className="text-xs font-mono text-valo-muted">
                {slot.probability}%
              </span>
            </div>

            <div
              className="h-1 rounded-full bg-neutral-800 overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-valo-red"
                style={{
                  width: `${Math.min(100, slot.probability)}%`
                }}
              />
            </div>

          </li>
        ))}

      </ul>

      <p className="text-xs text-valo-muted">
        Estimated from {name}&apos;s past streams and shown in your local time. It&apos;s a pattern, not an official schedule.
      </p>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAST STREAMS
   ═══════════════════════════════════════════════════════════════════════════ */

function PastStreams({
  streams,
  isLoading,
  hasMore,
  onLoadMore
}) {
  const formatDate = (value) => {
    if (!value) return 'Unknown date'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return 'Unknown date'
    }

    return new Intl.DateTimeFormat(
      undefined,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    ).format(date)
  }

  const formatDuration = (seconds) => {
    if (
      seconds == null ||
      Number.isNaN(Number(seconds))
    ) {
      return '—'
    }

    const total = Math.max(
      0,
      Number(seconds)
    )

    const hours = Math.floor(
      total / 3600
    )

    const minutes = Math.floor(
      (total % 3600) / 60
    )

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }

    return `${minutes}m`
  }

  const platformName = (stream) => {
    if (stream.platform) {
      return String(stream.platform).toLowerCase() === 'kick'
        ? 'Kick'
        : 'YouTube'
    }

    return String(stream.stream_url || '')
      .includes('kick.com')
      ? 'Kick'
      : 'YouTube'
  }

  const platformClass = (stream) =>
    platformName(stream) === 'Kick'
      ? 'text-[#53fc18] border-[#53fc18]/20 bg-[#53fc18]/5'
      : 'text-[#ff4444] border-[#ff4444]/20 bg-[#ff4444]/5'

  return (
    <section
      className="space-y-4"
      aria-label="Past streams"
    >
      <SectionTitle>
        Past Streams
      </SectionTitle>

      {isLoading &&
      streams.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-valo-border bg-valo-card overflow-hidden"
            >
              <div className="aspect-video shimmer" />

              <div className="p-4 space-y-2">
                <div className="h-4 w-4/5 rounded shimmer" />
                <div className="h-3 w-2/5 rounded shimmer" />
              </div>
            </div>
          ))}

        </div>
      ) : streams.length === 0 ? (

        <div className="rounded-xl border border-valo-border bg-valo-card px-5 py-8 text-center">
          <p className="text-sm text-valo-muted">
            No past streams have been recorded yet.
          </p>
        </div>

      ) : (

        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {streams.map((stream) => {
              const url =
                stream.stream_url ||
                stream.streamUrl

              const thumbnail =
                stream.thumbnail_url ||
                stream.thumbnail

              const title =
                stream.title ||
                'Untitled stream'

              return (
                <article
                  key={stream.id}
                  className="group overflow-hidden rounded-xl border border-valo-border bg-valo-card hover:border-white/15 transition-colors"
                >

                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Watch ${title}`}
                      className="block"
                    >
                      <StreamHistoryThumbnail
                        src={thumbnail}
                        title={title}
                        platform={platformName(stream)}
                      />
                    </a>
                  ) : (
                    <StreamHistoryThumbnail
                      src={thumbnail}
                      title={title}
                      platform={platformName(stream)}
                    />
                  )}

                  <div className="p-4 space-y-3">

                    <h3 className="font-display font-bold text-sm text-white leading-snug line-clamp-2">
                      {title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">

                      <span
                        className={`px-2 py-1 rounded border ${platformClass(stream)}`}
                      >
                        {platformName(stream)}
                      </span>

                      <span className="text-valo-muted">
                        {formatDate(stream.went_live_at)}
                      </span>

                      <span className="text-neutral-500">
                        •
                      </span>

                      <span className="text-valo-muted">
                        {formatDuration(
                          stream.duration_seconds
                        )}
                      </span>

                    </div>

                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                      >
                        Watch stream
                        <span aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    )}

                  </div>
                </article>
              )
            })}

          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">

              <button
                type="button"
                onClick={onLoadMore}
                disabled={isLoading}
                className="valo-btn-ghost disabled:opacity-50 disabled:pointer-events-none"
              >
                {isLoading
                  ? 'Loading…'
                  : 'Load more'}
              </button>

            </div>
          )}

        </>
      )}

    </section>
  )
}

function StreamHistoryThumbnail({
  src,
  title,
  platform
}) {
  return (
    <div className="relative aspect-video overflow-hidden bg-neutral-950">

      {src ? (
        <img
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c1c1c] to-[#111]" />
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      <span className="absolute left-3 bottom-3 px-2 py-1 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[9px] font-mono uppercase tracking-wider text-white">
        {platform}
      </span>

      {title && (
        <span className="sr-only">
          {title}
        </span>
      )}

    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMALL PIECES
   ═══════════════════════════════════════════════════════════════════════════ */

function ShareButton({ streamer }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const url =
      `${window.location.origin}${profilePath(streamer)}`

    const title =
      `${streamer.channelName} on ${SITE}`

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url
        })

        return
      }
    } catch (err) {
      if (err?.name === 'AbortError') {
        return
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)

      setTimeout(
        () => setCopied(false),
        2000
      )
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded font-mono text-[10px] font-bold tracking-wider uppercase border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white hover:border-neutral-600 select-none transition-all duration-150 active:scale-95"
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
      </svg>

      <span aria-live="polite">
        {copied
          ? 'Link copied'
          : 'Share'}
      </span>
    </button>
  )
}

function Stat({
  label,
  value,
  span = false
}) {
  return (
    <div
      className={`rounded-lg bg-black/30 border border-white/5 px-3 py-2 min-w-0 ${
        span
          ? 'col-span-2'
          : ''
      }`}
    >
      <dt className="text-[10px] font-mono uppercase tracking-widest text-valo-muted">
        {label}
      </dt>

      <dd className="font-display font-bold text-white truncate">
        {value}
      </dd>
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-2.5 select-none">

      <h2 className="font-display font-black text-xs uppercase tracking-widest text-neutral-400">
        {children}
      </h2>

      <div className="flex-1 h-px bg-neutral-900" />

    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-label="Loading streamer profile"
    >

      <div className="rounded-2xl border border-valo-border bg-valo-card p-7 flex items-center gap-5">

        <div className="w-24 h-24 rounded-full shimmer shrink-0" />

        <div className="flex-1 space-y-3">

          <div className="h-7 w-48 rounded shimmer" />
          <div className="h-5 w-24 rounded shimmer" />
          <div className="h-10 w-64 rounded shimmer" />

        </div>
      </div>

      <div className="h-56 rounded-2xl shimmer" />

    </div>
  )
}

function NotFound() {
  return (
    <div className="flex flex-col items-center text-center py-20 rounded-2xl border border-valo-border bg-valo-card px-6">

      <div
        className="w-14 h-14 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-center mb-4 text-xl"
        aria-hidden="true"
      >
        🔎
      </div>

      <h1 className="font-display font-black text-lg text-white mb-1">
        Streamer not found
      </h1>

      <p className="text-sm text-valo-muted max-w-sm mb-6">
        This streamer isn&apos;t on the site (or has been removed). Check the link, or browse everyone who&apos;s live.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="valo-btn"
        >
          Browse streamers
        </Link>

        <Link
          to="/submit"
          className="valo-btn-ghost"
        >
          Suggest a streamer
        </Link>
      </div>

    </div>
  )
}
