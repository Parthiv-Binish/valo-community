import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import StreamGrid from '../components/stream/StreamGrid'
import FilterBar from '../components/stream/FilterBar'
import { useLiveStreams } from '../hooks/useLiveStreams'

export default function HomePage() {
  const [searchParams] = useSearchParams()
  const [platformFilter, setPlatformFilter] = useState('all')
  const { streams, isLoading, error, refresh, lastRefreshed } = useLiveStreams()
  const query = searchParams.get('q') || ''

  const filtered = useMemo(() => {
    let s = streams
    if (platformFilter !== 'all') s = s.filter((st) => st.platform === platformFilter)
    if (query) {
      const q = query.toLowerCase()
      s = s.filter(
        (st) =>
          (st.channelName || '').toLowerCase().includes(q) ||
          (st.title || '').toLowerCase().includes(q)
      )
    }
    return s
  }, [streams, platformFilter, query])

  const counts = useMemo(() => ({
    all: streams.length,
    youtube: streams.filter((s) => s.platform === 'youtube').length,
    kick: streams.filter((s) => s.platform === 'kick').length,
  }), [streams])

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white flex items-center gap-3">
              <span className="w-2 h-6 bg-valo-red rounded-full inline-block" />
              Live Streams
              {!isLoading && (
                <span className="text-sm font-normal font-body text-valo-muted">
                  {filtered.length} live
                </span>
              )}
            </h1>
            {query && (
              <p className="text-sm text-valo-muted mt-1 font-body">
                Searching: <span className="text-valo-red">"{query}"</span>
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

        {/* Filters */}
        <FilterBar active={platformFilter} onChange={setPlatformFilter} counts={counts} />

        {/* Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-sm text-red-300 font-body">
            ⚠️ {error}
          </div>
        )}

        {/* Stream grid */}
        <StreamGrid
          streams={filtered}
          isLoading={isLoading}
          emptyMessage={
            query
              ? `No live streams match "${query}"`
              : platformFilter !== 'all'
              ? `No ${platformFilter} streams live right now`
              : 'No streamers are live right now. Check back soon!'
          }
        />

        {/* Auto-refresh hint */}
        {!isLoading && (
          <p className="text-center text-xs text-valo-muted font-body pb-4">
           
          </p>
        )}
      </div>
    </MainLayout>
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
