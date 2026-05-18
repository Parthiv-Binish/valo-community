export default function StreamerCardSkeleton() {
  return (
    <div className="bg-valo-card rounded-xl overflow-hidden border border-valo-border">
      <div className="aspect-video shimmer" />
      <div className="p-3 space-y-2.5">
        <div className="h-3.5 rounded shimmer w-full" />
        <div className="h-3.5 rounded shimmer w-2/3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full shimmer" />
            <div className="h-3 rounded shimmer w-24" />
          </div>
          <div className="h-5 w-14 rounded shimmer" />
        </div>
        <div className="h-8 rounded shimmer w-full" />
      </div>
    </div>
  )
}