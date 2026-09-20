// StreamCardSkeleton.jsx
export default function StreamerCardSkeleton() {
  return (
    <div className="group overflow-hidden rounded-2xl border border-white/[0.06] bg-[#080808] shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
      {/* Thumbnail skeleton */}
      <div className="relative aspect-video overflow-hidden bg-[#0d0d0d]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/[0.045] via-white/[0.02] to-transparent" />

        {/* Fake HUD elements */}
        <div className="absolute left-3 top-3 h-5 w-16 animate-pulse rounded-md bg-white/[0.06]" />
        <div className="absolute bottom-3 left-3 h-5 w-20 animate-pulse rounded-md bg-black/40" />
        <div className="absolute bottom-3 right-3 h-5 w-14 animate-pulse rounded-md bg-black/40" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-3 p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-white/[0.055]" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3.5 w-[78%] animate-pulse rounded bg-white/[0.06]" />
            <div className="h-2.5 w-[48%] animate-pulse rounded bg-white/[0.035]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-white/[0.045]" />
          <div className="h-3 w-[68%] animate-pulse rounded bg-white/[0.035]" />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="h-7 w-20 animate-pulse rounded-lg bg-white/[0.04]" />
          <div className="h-7 w-16 animate-pulse rounded-lg bg-white/[0.035]" />
        </div>
      </div>
    </div>
  )
}
