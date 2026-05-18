import StreamCard from './StreamCard'
import StreamCardSkeleton from './StreamCardSkeleton'

export default function StreamGrid({ streams, isLoading, emptyMessage }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StreamCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!streams || streams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        
        <h3 className="font-display font-bold text-xl text-valo-text mb-2">No Live Streams</h3>
        <p className="text-valo-muted text-sm max-w-xs">
          {emptyMessage || 'No streamers are live right now. Check back soon!'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {streams.map((stream, i) => (
        <StreamCard key={`${stream.platform}-${stream.channelId || stream.username}-${i}`} stream={stream} />
      ))}
    </div>
  )
}
