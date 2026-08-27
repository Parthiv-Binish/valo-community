import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import MainLayout from '../layouts/MainLayout'
import StreamerCard from '../components/stream/StreamCard'
import StreamerCardSkeleton from '../components/stream/StreamCardSkeleton'
import FilterBar from '../components/stream/FilterBar'
import { useAllStreamers } from '../hooks/useAllStreamers'
import TacticalBanner from '../components/common/TacticalBanner'

export default function AllStreamersPage() {
  const {
    streamers,
    isLoading,
    error,
    refresh,
    lastRefreshed
  } = useAllStreamers()

  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [banners, setBanners] = useState([])

  // ── Fetch only active TOP-FEED advertisements ────────────────────────────
  useEffect(() => {
    async function fetchTopBanners() {
      try {
        const { data, error: bannerError } = await supabase
          .from('platform_banners')
          .select('*')
          .eq('is_active', true)
          .eq('placement', 'feed_top')
          .order('created_at', { ascending: false })

        if (bannerError) {
          console.error(
            'Failed fetching top advertisements:',
            bannerError
          )
          return
        }

        setBanners(data || [])
      } catch (err) {
        console.error(
          'Failed fetching top advertisements:',
          err
        )
      }
    }

    fetchTopBanners()
  }, [])

  // ── Streamer data ───────────────────────────────────────────────────────
  const safeStreamers = useMemo(
    () => streamers || [],
    [streamers]
  )

  const filtered = useMemo(() => {
    let s = safeStreamers

    if (platformFilter !== 'all') {
      s = s.filter(
        (st) => st.platform === platformFilter
      )
    }

    if (search.trim()) {
      const q = search.toLowerCase()

      s = s.filter(
        (st) =>
          (st.channelName || '')
            .toLowerCase()
            .includes(q) ||
          (st.title || '')
            .toLowerCase()
            .includes(q)
      )
    }

    return s
  }, [safeStreamers, platformFilter, search])

  // ── Platform counts ─────────────────────────────────────────────────────
  const counts = useMemo(
    () => ({
      all: safeStreamers.length,

      youtube: safeStreamers.filter(
        (s) => s.platform === 'youtube'
      ).length,

      kick: safeStreamers.filter(
        (s) => s.platform === 'kick'
      ).length,
    }),
    [safeStreamers]
  )

  // ── Live / Offline ──────────────────────────────────────────────────────
  const liveStreams = useMemo(
    () =>
      filtered.filter(
        (s) => s.isLive || s.is_live
      ),
    [filtered]
  )

  const offlineStreams = useMemo(
    () =>
      filtered.filter(
        (s) => !s.isLive && !s.is_live
      ),
    [filtered]
  )

  return (
    <MainLayout>
      <div className="space-y-8 max-w-[1680px] mx-auto px-4 animate-fade-in">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-neutral-900 pb-5">

          <div>
            <h1 className="font-display font-black text-2xl tracking-wider text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-valo-red rounded-full inline-block" />

              COMMUNITY

              <span className="text-valo-red">
                AGENTS
              </span>
            </h1>

            {!isLoading && (
              <p className="text-valo-muted text-xs font-mono uppercase tracking-widest mt-1.5 pl-5">
                <span className="text-green-400 font-bold">
                  {liveStreams.length} live
                </span>

                <span className="mx-2 text-neutral-800">
                  •
                </span>

                <span>
                  {offlineStreams.length} standby
                </span>

                <span className="mx-2 text-neutral-800">
                  •
                </span>

                <span>
                  {filtered.length} total
                </span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">

            {lastRefreshed && (
              <span className="text-xs text-valo-muted font-mono hidden sm:block uppercase tracking-wider">
                Sync //{' '}
                {typeof lastRefreshed === 'string'
                  ? lastRefreshed
                  : lastRefreshed.toLocaleTimeString()}
              </span>
            )}

            <button
              onClick={refresh}
              disabled={isLoading}
              className="valo-btn-ghost text-xs py-1.5 px-3.5 flex items-center gap-2 font-mono uppercase tracking-wider border border-neutral-800 bg-neutral-950 text-white"
            >
              <RefreshIcon
                className={
                  isLoading
                    ? 'animate-spin'
                    : ''
                }
              />

              Recalibrate
            </button>

          </div>
        </div>


        {/* ── Search + Filter Panel ─────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-neutral-950/40 p-2.5 border border-neutral-900 rounded-xl">

          <div className="relative flex-1 max-w-sm">

            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
              />

              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search agent broadcast lines..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-valo-red text-white placeholder-neutral-600 outline-none pl-9 pr-8 h-9 rounded-lg text-xs font-mono tracking-tight transition-all"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}

          </div>

          <FilterBar
            active={platformFilter}
            onChange={setPlatformFilter}
            counts={counts}
          />

        </div>


        {/* ═══════════════════════════════════════════════════════════════
            TOP ADVERTISEMENT
            ═══════════════════════════════════════════════════════════════ */}
        {!isLoading && banners.length > 0 && (
          <TopAdCarousel banners={banners} />
        )}


        {/* ── Error Messages ────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 text-xs text-red-400 font-mono uppercase tracking-wider">
            ⚠️ SYSTEM REJECTION // {error}
          </div>
        )}


        {/* ── STREAM CONTENT ────────────────────────────────────────────── */}
        <div className="space-y-12">

          {isLoading ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 8 }).map(
                (_, i) => (
                  <StreamerCardSkeleton key={i} />
                )
              )}
            </div>

          ) : filtered.length === 0 ? (

            <EmptyState
              search={search}
              platform={platformFilter}
            />

          ) : (

            <>

              {/* ── LIVE STREAMS ───────────────────────────────────────── */}
              {liveStreams.length > 0 && (
                <section className="space-y-5">

                  <SectionLabel
                    icon={<LiveDot />}
                    label="Live Now"
                    count={liveStreams.length}
                    accent
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">

                    {liveStreams.map((s, idx) => {
                      const elementKey =
                        s.id ||
                        s.streamer_id ||
                        `live-${idx}`

                      return (
                        <StreamerCard
                          key={`live-${elementKey}`}
                          streamer={s}
                        />
                      )
                    })}

                  </div>

                </section>
              )}


              {/* ── OFFLINE CHANNELS ──────────────────────────────────── */}
              {offlineStreams.length > 0 && (
                <section className="space-y-5">

                  <SectionLabel
                    icon={<OfflineDot />}
                    label="Offline standbys"
                    count={offlineStreams.length}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">

                    {offlineStreams.map((s, idx) => {
                      const elementKey =
                        s.id ||
                        s.streamer_id ||
                        `offline-${idx}`

                      return (
                        <StreamerCard
                          key={`offline-${elementKey}`}
                          streamer={s}
                        />
                      )
                    })}

                  </div>

                </section>
              )}

            </>
          )}

        </div>


        {/* ── Footer Meta Deck ──────────────────────────────────────────── */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-[10px] text-valo-muted font-mono uppercase tracking-widest pt-12 pb-4 border-t border-neutral-900/60">
            Realtime Matrix Sync active · Frequency sweep loop configured at 60s
          </p>
        )}

      </div>
    </MainLayout>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   TOP AD CAROUSEL
   ═══════════════════════════════════════════════════════════════════════════ */

function TopAdCarousel({ banners }) {
  const [activeIndex, setActiveIndex] = useState(0)

  const total = banners.length

  // Keep active index valid if advertisements change.
  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0)
      return
    }

    if (activeIndex >= total) {
      setActiveIndex(0)
    }
  }, [total, activeIndex])

  // Auto rotate only when there are multiple advertisements.
  useEffect(() => {
    if (total <= 1) return

    const timer = setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % total
      )
    }, 7000)

    return () => clearInterval(timer)
  }, [total])

  if (total === 0) {
    return null
  }

  const currentAd = banners[activeIndex]

  if (!currentAd) {
    return null
  }

  return (
    <section className="w-full">

      <div className="relative w-full">

        <TacticalBanner
          key={currentAd.id}
          ad={currentAd}
          placement="feed_top"
        />

        {total > 1 && (
          <>
            {/* Previous */}
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + total) % total
                )
              }
              aria-label="Previous advertisement"
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                z-30
                w-9
                h-9
                rounded-full
                bg-black/75
                backdrop-blur-md
                border
                border-white/10
                text-white
                text-2xl
                leading-none
                flex
                items-center
                justify-center
                hover:bg-valo-red
                hover:border-valo-red
                transition-all
              "
            >
              ‹
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex + 1) % total
                )
              }
              aria-label="Next advertisement"
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                z-30
                w-9
                h-9
                rounded-full
                bg-black/75
                backdrop-blur-md
                border
                border-white/10
                text-white
                text-2xl
                leading-none
                flex
                items-center
                justify-center
                hover:bg-valo-red
                hover:border-valo-red
                transition-all
              "
            >
              ›
            </button>
          </>
        )}

      </div>


      {/* ── Carousel indicators ───────────────────────────────────────── */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">

          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() =>
                setActiveIndex(index)
              }
              aria-label={`Show advertisement ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                ${
                  index === activeIndex
                    ? 'w-7 bg-valo-red'
                    : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                }
              `}
            />
          ))}

        </div>
      )}

    </section>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════════════════════════════════ */

function SectionLabel({
  icon,
  label,
  count,
  accent = false
}) {
  return (
    <div className="flex items-center gap-2.5 py-1 select-none">

      {icon}

      <h2
        className={`font-display font-black text-xs uppercase tracking-widest ${
          accent
            ? 'text-valo-red'
            : 'text-neutral-400'
        }`}
      >
        {label}
      </h2>

      <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded-full font-bold">
        {count}
      </span>

      <div className="flex-1 h-px bg-neutral-900" />

    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   LIVE DOT
   ═══════════════════════════════════════════════════════════════════════════ */

function LiveDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-valo-red animate-pulse shrink-0" />
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   OFFLINE DOT
   ═══════════════════════════════════════════════════════════════════════════ */

function OfflineDot() {
  return (
    <span className="w-2 h-2 rounded-full bg-neutral-700 shrink-0" />
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════════════ */

function EmptyState({
  search,
  platform
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-neutral-950/20 border border-neutral-900 rounded-2xl max-w-md mx-auto w-full">

      <div className="w-14 h-14 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-4 text-xl">
        📡
      </div>

      <h3 className="font-display font-black text-sm text-neutral-400 uppercase tracking-widest mb-1">
        No Channels Match
      </h3>

      <p className="text-neutral-500 text-xs max-w-xs font-mono uppercase tracking-wider leading-relaxed">

        {search
          ? `No matching profiles register under keys: "${search}"`

          : platform !== 'all'
            ? `No configured ${platform} agents present in repository.`

            : 'Zero live feeds or tracking points detected.'
        }

      </p>

    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   REFRESH ICON
   ═══════════════════════════════════════════════════════════════════════════ */

function RefreshIcon({
  className = ''
}) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
    >
      <path d="M23 4v6h-6" />

      <path d="M1 20v-6h6" />

      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}
