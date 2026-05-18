'use client'

import { useMemo, useState } from 'react'
import { useAllStreamers } from '../hooks/useAllStreamers'
import StreamCard from '../components/stream/StreamCard'

export default function StreamersPage() {
  const { streamers, isLoading, error } = useAllStreamers()
  const [filter, setFilter] = useState<'all' | 'live' | 'offline'>('all')

  const filtered = useMemo(() => {
    if (filter === 'live') return streamers.filter((s) => s.isLive)
    if (filter === 'offline') return streamers.filter((s) => !s.isLive)
    return streamers
  }, [streamers, filter])

  const liveCount = streamers.filter((s) => s.isLive).length
  const offlineCount = streamers.filter((s) => !s.isLive).length

  return (
    <main className="min-h-screen bg-valo-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            All Streamers
          </h1>
          <p className="text-valo-muted">
            {streamers.length} streamers ({liveCount} live, {offlineCount} offline)
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 border-b border-valo-border pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-display font-semibold rounded transition-all ${
              filter === 'all'
                ? 'bg-valo-red text-white'
                : 'text-valo-muted hover:text-white border border-valo-border hover:border-valo-red'
            }`}
          >
            All ({streamers.length})
          </button>
          <button
            onClick={() => setFilter('live')}
            className={`px-4 py-2 font-display font-semibold rounded transition-all ${
              filter === 'live'
                ? 'bg-valo-red text-white'
                : 'text-valo-muted hover:text-white border border-valo-border hover:border-valo-red'
            }`}
          >
            Live ({liveCount})
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 font-display font-semibold rounded transition-all ${
              filter === 'offline'
                ? 'bg-valo-red text-white'
                : 'text-valo-muted hover:text-white border border-valo-border hover:border-valo-red'
            }`}
          >
            Offline ({offlineCount})
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-valo-muted">
              <div className="w-8 h-8 border-2 border-valo-border rounded-full border-t-valo-red animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Loading streamers...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
            <p className="font-semibold">Error loading streamers</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-valo-muted text-lg">No streamers found</p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((streamer) => (
              <StreamCard
                key={streamer.dbId || streamer.channelId || streamer.username}
                streamer={streamer}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-valo-border text-center text-valo-muted text-sm">
          <p>Want to add your stream? <a href="/submit" className="text-valo-red hover:underline">Submit here</a></p>
        </div>
      </div>
    </main>
  )
}
