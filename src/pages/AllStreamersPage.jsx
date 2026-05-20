import { useState, useMemo } from 'react'
import MainLayout from '../layouts/MainLayout'
import StreamerCard from '../components/stream/StreamCard'
import StreamerCardSkeleton from '../components/stream/StreamCardSkeleton'
import FilterBar from '../components/stream/FilterBar'
import { useAllStreamers } from '../hooks/useAllStreamers'

export default function AllStreamersPage() {
  const { streamers, isLoading, error, refresh, lastRefreshed } = useAllStreamers()
  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let s = streamers
    if (platformFilter !== 'all') s = s.filter((st) => st.platform === platformFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      s = s.filter((st) =>
        (st.channelName || '').toLowerCase().includes(q) ||
        (st.title       || '').toLowerCase().includes(q)
      )
    }
    return s
  }, [streamers, platformFilter, search])

  const counts = useMemo(() => ({
    all:     streamers.length,
    youtube: streamers.filter((s) => s.platform === 'youtube').length,
    kick:    streamers.filter((s) => s.platform === 'kick').length,
  }), [streamers])

  const liveCount    = filtered.filter((s) => s.isLive).length
  const offlineCount = filtered.filter((s) => !s.isLive).length

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white flex items-center gap-3">
              <span className="w-2 h-6 bg-valo-red rounded-full inline-block" />
              All Streamers
            </h1>
            {!isLoading && (
              <p className="text-valo-muted text-sm font-body mt-1 pl-5">
                <span className="text-green-400 font-semibold">{liveCount} live</span>
                <span className="mx-1.5 text-valo-border">·</span>
                <span>{offlineCount} offline</span>
                <span className="mx-1.5 text-valo-border">·</span>
                <span>{filtered.length} total</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-valo-muted font-mono hidden sm:block">
                Updated {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="valo-btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* ── Search + Filter ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-valo-muted"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search streamers..."
              className="input-field pl-9 h-9 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-valo-muted hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          {/* Platform filter */}
          <FilterBar active={platformFilter} onChange={setPlatformFilter} counts={counts} />
        </div>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-sm text-red-300 font-body">
            ⚠️ {error}
          </div>
        )}

        {/* ── Grid ───────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <StreamerCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState search={search} platform={platformFilter} />
        ) : (
          <>
            {/* Live section */}
            {liveCount > 0 && (
              <section className="space-y-3">
                <SectionLabel
                  icon={<LiveDot />}
                  label="Live Now"
                  count={liveCount}
                  accent
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered
                    .filter((s) => s.isLive)
                    .map((s, i) => (
                      <StreamerCard key={`${s.platform}-${s.dbId}-live-${i}`} streamer={s} />
                    ))}
                </div>
              </section>
            )}

            {/* Offline section */}
            {offlineCount > 0 && (
              <section className="space-y-3">
                <SectionLabel
                  icon={<OfflineDot />}
                  label="Offline"
                  count={offlineCount}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filtered
                    .filter((s) => !s.isLive)
                    .map((s, i) => (
                      <StreamerCard key={`${s.platform}-${s.dbId}-offline-${i}`} streamer={s} />
                    ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Footer note */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-xs text-valo-muted font-body pb-4">
            Auto-refreshes every 60 seconds · Live status fetched in real-time
          </p>
        )}
      </div>
    </MainLayout>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label, count, accent = false }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className={`font-display font-bold text-sm uppercase tracking-wider ${accent ? 'text-valo-red' : 'text-valo-muted'}`}>
        {label}
      </h2>
      <span className="text-xs font-mono text-valo-muted bg-valo-card border border-valo-border px-2 py-0.5 rounded-full">
        {count}
      </span>
      <div className="flex-1 h-px bg-valo-border ml-1" />
    </div>
  )
}

function LiveDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-valo-red animate-pulse-red shrink-0" />
  )
}

function OfflineDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-valo-muted shrink-0" />
  )
}

function EmptyState({ search, platform }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-valo-card border border-valo-border flex items-center justify-center mb-4">
        <span className="text-3xl">🎮</span>
      </div>
      <h3 className="font-display font-bold text-xl text-valo-text mb-2">No Streamers Found</h3>
      <p className="text-valo-muted text-sm max-w-xs font-body">
        {search
          ? `No streamers match "${search}"`
          : platform !== 'all'
          ? `No ${platform} streamers added yet`
          : 'No streamers have been added yet. Submit one!'}
      </p>
      {!search && (
        <a href="/submit" className="valo-btn mt-6 px-6">
          Submit a Streamer
        </a>
      )}
    </div>
  )
}

function RefreshIcon({ className = '' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}