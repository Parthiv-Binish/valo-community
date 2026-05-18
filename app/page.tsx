'use client'

import { useLiveStreams } from './hooks/useLiveStreams'
import StreamCard from './components/stream/StreamCard'

export default function Home() {
  const { streams, isLoading, error } = useLiveStreams()

  return (
    <main className="min-h-screen bg-valo-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
            <span className="text-gradient">Live Now</span>
          </h1>
          <p className="text-valo-muted">Find all live Valorant streamers in one place</p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-valo-muted">
              <div className="w-8 h-8 border-2 border-valo-border rounded-full border-t-valo-red animate-spin mx-auto mb-2"></div>
              <p className="text-sm">Loading live streams...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
            <p className="font-semibold">Error loading streams</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && streams.length === 0 && (
          <div className="text-center py-12">
            <p className="text-valo-muted text-lg">No one is streaming right now</p>
            <p className="text-valo-muted text-sm mt-2">Check back later or view all streamers</p>
            <a
              href="/streamers"
              className="inline-block mt-4 px-6 py-2 bg-valo-red text-white font-display font-semibold rounded hover:brightness-110 transition-all"
            >
              View All Streamers
            </a>
          </div>
        )}

        {/* Stream grid */}
        {!isLoading && streams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {streams.map((stream) => (
              <StreamCard key={stream.dbId || stream.channelId || stream.username} streamer={stream} />
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
