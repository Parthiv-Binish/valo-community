// StreamCardSkeleton.jsx
export default function StreamerCardSkeleton() {
  return (
    <div className="bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800">
      <div className="aspect-video bg-neutral-800 animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-neutral-800 rounded animate-pulse w-full" />
        <div className="h-3 bg-neutral-800 rounded animate-pulse w-2/3" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-3 bg-neutral-800 rounded animate-pulse w-20" />
          <div className="h-3 bg-neutral-800 rounded animate-pulse w-10" />
        </div>
      </div>
    </div>
  )
}