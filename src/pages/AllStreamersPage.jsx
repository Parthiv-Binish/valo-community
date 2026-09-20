import {
  useState,
  useEffect,
  useMemo,
} from 'react'

import { supabase } from '../lib/supabase'

import MainLayout from '../layouts/MainLayout'

import StreamerCard from '../components/stream/StreamCard'

import StreamCardSkeleton from '../components/stream/StreamCardSkeleton'

import FilterBar from '../components/stream/FilterBar'

import { useAllStreamers } from '../hooks/useAllStreamers'

import TacticalBanner from '../components/common/TacticalBanner'


export default function AllStreamersPage() {
  const {
    streamers,
    isLoading,
    error,
    refresh,
    lastRefreshed,
  } = useAllStreamers()


  const [platformFilter, setPlatformFilter] =
    useState('all')

  const [languageFilter, setLanguageFilter] =
    useState('all')

  const [search, setSearch] =
    useState('')

  const [banners, setBanners] =
    useState([])

  const [recentHistory, setRecentHistory] =
    useState([])


  /* ═════════════════════════════════════════════════════════════════════
     FETCH TOP ADVERTISEMENTS
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    async function fetchTopBanners() {
      try {
        const {
          data,
          error: bannerError,
        } = await supabase
          .from('platform_banners')
          .select('*')
          .eq('is_active', true)
          .eq('placement', 'feed_top')
          .order('created_at', {
            ascending: false,
          })


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


  /* ═════════════════════════════════════════════════════════════════════
     FETCH RECENT STREAM HISTORY
     Uses existing history data only; no mock/derived records are created.
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    async function fetchRecentHistory() {
      try {
        const { data, error: historyError } = await supabase
          .from('stream_history_logs')
          .select('streamer_id, title, went_live_at, went_offline_at')
          .not('went_offline_at', 'is', null)
          .order('went_offline_at', { ascending: false })
          .limit(24)

        if (historyError) {
          console.error('Failed fetching recent stream history:', historyError)
          return
        }

        setRecentHistory(data || [])
      } catch (err) {
        console.error('Failed fetching recent stream history:', err)
      }
    }

    fetchRecentHistory()
  }, [])


  /* ═════════════════════════════════════════════════════════════════════
     STREAMER DATA
     ═══════════════════════════════════════════════════════════════════ */

  const safeStreamers = useMemo(
    () => streamers || [],
    [streamers]
  )


  /* ═════════════════════════════════════════════════════════════════════
     LANGUAGES
     ═══════════════════════════════════════════════════════════════════ */

  const languages = useMemo(
    () =>
      [
        ...new Set(
          safeStreamers
            .map(
              (streamer) =>
                streamer.language
            )
            .filter(Boolean)
        ),
      ].sort(),
    [safeStreamers]
  )


  const activeLanguage =
    languages.includes(languageFilter)
      ? languageFilter
      : 'all'


  /* ═════════════════════════════════════════════════════════════════════
     FILTERING
     ═══════════════════════════════════════════════════════════════════ */

  const filtered = useMemo(() => {
    let result = safeStreamers


    if (activeLanguage !== 'all') {
      result = result.filter(
        (streamer) =>
          streamer.language ===
          activeLanguage
      )
    }


    if (platformFilter !== 'all') {
      result = result.filter(
        (streamer) =>
          streamer.platform ===
          platformFilter
      )
    }


    if (search.trim()) {
      const query =
        search
          .toLowerCase()
          .trim()


      result = result.filter(
        (streamer) =>
          (
            streamer.channelName ||
            ''
          )
            .toLowerCase()
            .includes(query) ||

          (
            streamer.title ||
            ''
          )
            .toLowerCase()
            .includes(query)
      )
    }


    return result
  }, [
    safeStreamers,
    platformFilter,
    activeLanguage,
    search,
  ])


  /* ═════════════════════════════════════════════════════════════════════
     PLATFORM COUNTS
     ═══════════════════════════════════════════════════════════════════ */

  const counts = useMemo(
    () => ({
      all: safeStreamers.length,

      youtube:
        safeStreamers.filter(
          (streamer) =>
            streamer.platform ===
            'youtube'
        ).length,

      kick:
        safeStreamers.filter(
          (streamer) =>
            streamer.platform ===
            'kick'
        ).length,
    }),
    [safeStreamers]
  )


  /* ═════════════════════════════════════════════════════════════════════
     LIVE / OFFLINE
     ═══════════════════════════════════════════════════════════════════ */

  const liveStreams = useMemo(
    () =>
      filtered.filter(
        (streamer) =>
          streamer.isLive ||
          streamer.is_live
      ),
    [filtered]
  )


  const offlineStreams = useMemo(
    () =>
      filtered.filter(
        (streamer) =>
          !streamer.isLive &&
          !streamer.is_live
      ),
    [filtered]
  )

  /* ═════════════════════════════════════════════════════════════════════
     HERO STATS
     Values are calculated from the complete DB-backed streamer collection.
     "In view" remains filter/search aware.
     ═══════════════════════════════════════════════════════════════════ */

  const heroStats = useMemo(() => {
    const totalStreamers = safeStreamers.length

    const totalLive = safeStreamers.filter(
      (streamer) =>
        streamer.isLive ||
        streamer.is_live
    ).length

    return {
      live: totalLive,
      inView: filtered.length,
      total: totalStreamers,
    }
  }, [safeStreamers, filtered])


  /* ═════════════════════════════════════════════════════════════════════
     DISCOVERY GROUPS
     ═══════════════════════════════════════════════════════════════════ */

  const trendingStreams = useMemo(() => {
    const candidates = [...liveStreams]
      .filter((streamer) => streamer.viewerCount != null)
      .sort(
        (a, b) =>
          Number(b.viewerCount || 0) -
          Number(a.viewerCount || 0)
      )

    if (!candidates.length) return []

    const totalViewers = candidates.reduce(
      (sum, streamer) =>
        sum + Number(streamer.viewerCount || 0),
      0
    )

    if (totalViewers <= 0) return []

    // Trending is a meaningful subset of Live Now:
    // include streamers holding at least 10% of the current live audience,
    // capped at four cards so the section stays focused.
    const significant = candidates.filter(
      (streamer) =>
        Number(streamer.viewerCount || 0) / totalViewers >= 0.10
    )

    // Always surface the largest live channel when viewer data exists.
    // This prevents a tiny community from having an empty Trending section.
    const result =
      significant.length > 0
        ? significant
        : candidates.slice(0, 1)

    return result.slice(0, 4)
  }, [liveStreams])

  const recentlyLiveStreams = useMemo(() => {
    if (!recentHistory.length) return []

    const streamerMap = new Map(
      filtered.map((streamer) => [
        String(streamer.id || streamer.streamer_id),
        streamer,
      ])
    )

    const seen = new Set()
    const result = []

    for (const history of recentHistory) {
      const streamer = streamerMap.get(String(history.streamer_id))
      if (!streamer) continue

      const key = String(streamer.id || streamer.streamer_id)
      if (seen.has(key)) continue

      seen.add(key)
      result.push(streamer)

      if (result.length >= 8) break
    }

    return result
  }, [recentHistory, filtered])


  return (
    <MainLayout>
      <div className="relative min-h-full w-full overflow-x-hidden bg-[#0f0f0f]">
        {/* Ambient background — decorative only, no data/logic changes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[620px] overflow-hidden"
        >
          <div className="absolute -left-32 top-[-180px] h-[520px] w-[520px] rounded-full bg-valo-red/[0.08] blur-[140px]" />
          <div className="absolute right-[-180px] top-[80px] h-[420px] w-[420px] rounded-full bg-red-500/[0.05] blur-[130px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        </div>

        <div
          className="relative z-10 mx-auto w-full max-w-[1680px] space-y-10 px-4 pb-8 sm:px-5 sm:pb-10 lg:px-6 lg:space-y-12"
        >
          {/* ===============================================================
              HERO
             =============================================================== */}
          <section className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#070708] shadow-[0_30px_110px_rgba(0,0,0,0.45)] sm:min-h-[500px]">
            {/* Full-bleed cinematic background */}
            <img
              src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/7b60e8bb6c1828831931dad87633604c2264fa26-3440x1020.jpg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-center opacity-55 saturate-75"
            />

            {/* Readability + VALORANT red atmosphere */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,6,0.98)_0%,rgba(5,5,6,0.90)_30%,rgba(5,5,6,0.55)_58%,rgba(5,5,6,0.28)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,5,6,0.96)_0%,transparent_42%,rgba(5,5,6,0.28)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(255,68,68,0.22),transparent_30%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,68,68,0.08),transparent_38%,rgba(255,68,68,0.05)_100%)]" />

            {/* Tactical HUD grid */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
            />

            {/* Radar focal point */}
            <div className="absolute right-[8%] top-1/2 hidden -translate-y-1/2 md:block">
              <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-valo-red/20 bg-black/10 shadow-[0_0_100px_rgba(255,68,68,0.12)] backdrop-blur-[1px] lg:h-72 lg:w-72">
                <div className="absolute h-[78%] w-[78%] rounded-full border border-valo-red/15" />
                <div className="absolute h-[55%] w-[55%] rounded-full border border-valo-red/20" />
                <div className="absolute h-[32%] w-[32%] rounded-full border border-valo-red/25" />
                <div className="h-3 w-3 rounded-full bg-valo-red shadow-[0_0_30px_rgba(255,68,68,0.9)]" />
                <div className="absolute h-px w-[125%] rotate-45 bg-gradient-to-r from-transparent via-valo-red/45 to-transparent" />
                <div className="absolute h-px w-[125%] -rotate-45 bg-gradient-to-r from-transparent via-valo-red/20 to-transparent" />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex min-h-[430px] items-end px-6 py-9 sm:min-h-[500px] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
              <div className="w-full max-w-4xl">
                <div className="mb-4 flex items-center gap-3 sm:mb-5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-valo-red shadow-[0_0_18px_rgba(255,68,68,0.8)]" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-valo-red sm:text-[10px]">
                    Valorant Community Network
                  </span>
                </div>

                <h1 className="max-w-4xl font-display text-4xl font-black uppercase leading-[0.92] tracking-[-0.045em] text-white sm:text-6xl lg:text-8xl">
                  The Valorant
                  <br />
                  Community{' '}
                  <span className="text-valo-red [text-shadow:0_0_35px_rgba(255,68,68,0.3)]">
                    Is Live.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-300/80 sm:text-base sm:leading-7">
                  Discover Valorant streamers across the community, find live
                  feeds, and jump straight into the action.
                </p>

                <div className="mt-7 grid max-w-3xl grid-cols-3 gap-2 sm:mt-8 sm:gap-3">
                  <HeroStat value={heroStats.live} label="Live now" accent />
                  <HeroStat value={heroStats.inView} label="In view" />
                  <HeroStat value={heroStats.total} label="Streamers" />
                </div>
              </div>
            </div>

            {/* Bottom HUD line */}
            <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-between border-t border-white/[0.07] bg-black/25 px-5 py-2.5 backdrop-blur-md sm:px-8">
              <span className="font-mono text-[7px] font-bold uppercase tracking-[0.24em] text-neutral-500 sm:text-[8px]">
                LIVE FEED // COMMUNITY MATRIX
              </span>
              <span className="font-mono text-[7px] font-bold uppercase tracking-[0.2em] text-valo-red sm:text-[8px]">
                REALTIME
              </span>
            </div>
          </section>

          {/* ===============================================================
              DISCOVERY / FILTERS
             =============================================================== */}
          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                    Discover
                  </span>
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  Find your next stream.
                </h2>
              </div>

              {lastRefreshed && (
                <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-neutral-600">
                  <span className="hidden sm:inline">Sync // </span>
                  <span>
                    {typeof lastRefreshed === 'string'
                      ? lastRefreshed
                      : lastRefreshed.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-neutral-950/65 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <label htmlFor="streamer-search" className="sr-only">
                    Search streamers
                  </label>

                  <svg
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>

                  <input
                    id="streamer-search"
                    type="text"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search streamers, titles, channels..."
                    autoComplete="off"
                    className="h-12 w-full rounded-xl border border-white/[0.08] bg-black/40 pl-11 pr-11 font-mono text-xs tracking-wide text-white outline-none transition-all placeholder:text-neutral-600 focus:border-valo-red/45 focus:bg-black/60 focus:shadow-[0_0_30px_rgba(255,68,68,0.07)]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="hidden h-8 w-px bg-white/[0.07] lg:block" />

                <button
                  onClick={refresh}
                  disabled={isLoading}
                  className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-300 transition-all hover:border-valo-red/30 hover:bg-valo-red/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              <div className="mt-3">
                <FilterBar
                  active={platformFilter}
                  onChange={setPlatformFilter}
                  counts={counts}
                />
              </div>

              {languages.length > 0 && (
                <div className="mt-3 border-t border-white/[0.05] pt-3">
                  <div className="sm:hidden">
                    <label
                      htmlFor="language-filter"
                      className="mb-2 block font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600"
                    >
                      Language
                    </label>
                    <div className="relative">
                      <select
                        id="language-filter"
                        value={activeLanguage}
                        onChange={(event) =>
                          setLanguageFilter(event.target.value)
                        }
                        className="h-11 w-full appearance-none rounded-xl border border-white/[0.07] bg-black/30 px-3.5 pr-10 font-display text-xs font-semibold text-neutral-300 outline-none transition-colors focus:border-valo-red/50"
                      >
                        <option value="all">All languages</option>
                        {languages.map((language) => (
                          <option key={language} value={language}>
                            {language}
                          </option>
                        ))}
                      </select>
                      <svg
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </div>
                  </div>

                  <div
                    className="hidden items-center gap-2 overflow-x-auto pb-1 scrollbar-none sm:flex"
                    role="group"
                    aria-label="Filter by language"
                  >
                    <span className="mr-1 shrink-0 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-neutral-600">
                      Language
                    </span>
                    {['all', ...languages].map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => setLanguageFilter(language)}
                        aria-pressed={activeLanguage === language}
                        className={`shrink-0 rounded-full border px-4 py-1.5 font-display text-xs font-semibold transition-all duration-150 ${
                          activeLanguage === language
                            ? 'border-white bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                            : 'border-white/[0.07] bg-white/[0.015] text-neutral-500 hover:border-white/[0.15] hover:text-white'
                        }`}
                      >
                        {language === 'all' ? 'All languages' : language}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ===============================================================
              TOP ADVERTISEMENT
             =============================================================== */}
          {!isLoading && banners.length > 0 && (
            <TopAdCarousel banners={banners} />
          )}

          {/* ===============================================================
              ERROR
             =============================================================== */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/15 bg-red-950/20 p-4 text-xs text-red-400 shadow-[0_0_40px_rgba(255,0,0,0.04)] font-mono uppercase tracking-wider">
              <span className="mt-0.5">⚠</span>
              <span>System rejection // {error}</span>
            </div>
          )}

          {/* ===============================================================
              STREAM CONTENT / DISCOVERY
             =============================================================== */}
          <div className="space-y-14">
            {isLoading ? (
              <section className="space-y-5">
                <SectionLabel
                  icon={<LiveDot />}
                  label="Loading Community"
                  count={8}
                  accent
                />
                <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-y-8">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <StreamCardSkeleton key={index} />
                  ))}
                </div>
              </section>
            ) : filtered.length === 0 ? (
              <EmptyState search={search} platform={platformFilter} />
            ) : (
              <>
                {trendingStreams.length > 0 && (
                  <DiscoverySection
                    eyebrow="Highest live audience share"
                    title="Trending Now"
                    accent
                  >
                    {trendingStreams.map((streamer, index) => {
                      const elementKey =
                        streamer.id ||
                        streamer.streamer_id ||
                        `trending-${index}`

                      return (
                        <StreamerCard
                          key={`trending-${elementKey}`}
                          streamer={streamer}
                        />
                      )
                    })}
                  </DiscoverySection>
                )}

                {recentlyLiveStreams.length > 0 && (
                  <DiscoverySection
                    eyebrow="Recent activity"
                    title="Recently Live"
                    count={recentlyLiveStreams.length}
                  >
                    {recentlyLiveStreams.map((streamer, index) => {
                      const elementKey =
                        streamer.id ||
                        streamer.streamer_id ||
                        `recent-${index}`

                      return (
                        <StreamerCard
                          key={`recent-${elementKey}`}
                          streamer={streamer}
                        />
                      )
                    })}
                  </DiscoverySection>
                )}

                {liveStreams.length > 0 && (
                  <section id="live-streams" className="space-y-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <LiveDot />
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-valo-red">
                            Live right now
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                          Live Now
                        </h2>
                      </div>
                      <span className="hidden rounded-full border border-valo-red/15 bg-valo-red/[0.05] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-valo-red sm:inline-flex">
                        {liveStreams.length} active
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-y-9">
                      {liveStreams.map((streamer, index) => {
                        const elementKey =
                          streamer.id ||
                          streamer.streamer_id ||
                          `live-${index}`

                        return (
                          <StreamerCard
                            key={`live-${elementKey}`}
                            streamer={streamer}
                          />
                        )
                      })}
                    </div>
                  </section>
                )}

                {offlineStreams.length > 0 && (
                  <section className="space-y-6 border-t border-white/[0.05] pt-10">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <OfflineDot />
                          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.25em] text-neutral-600">
                            Community directory
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-neutral-300 sm:text-3xl">
                          Offline
                        </h2>
                      </div>
                      <span className="hidden rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-600 sm:inline-flex">
                        {offlineStreams.length} profiles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-y-9">
                      {offlineStreams.map((streamer, index) => {
                        const elementKey =
                          streamer.id ||
                          streamer.streamer_id ||
                          `offline-${index}`

                        return (
                          <StreamerCard
                            key={`offline-${elementKey}`}
                            streamer={streamer}
                          />
                        )
                      })}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>

          {/* ===============================================================
              FOOTER STATUS
             =============================================================== */}
          {!isLoading && filtered.length > 0 && (
            <div className="border-t border-white/[0.05] pt-8 pb-2 text-center">
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-700 sm:text-[9px]">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500/70 shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                <span>Realtime matrix sync active</span>
                <span className="text-neutral-800">•</span>
                <span>Frequency sweep loop configured at 60s</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}



/* ═══════════════════════════════════════════════════════════════════════════
   HERO STAT
   ═══════════════════════════════════════════════════════════════════════════ */

function HeroStat({
  value,
  label,
  accent = false,
}) {
  return (
    <div
      className={`rounded-2xl border px-3 py-3 backdrop-blur-md sm:px-4 sm:py-3.5 ${
        accent
          ? 'border-valo-red/25 bg-valo-red/[0.08]'
          : 'border-white/[0.08] bg-black/30'
      }`}
    >
      <div
        className={`font-display text-xl font-black sm:text-2xl ${
          accent ? 'text-valo-red' : 'text-white'
        }`}
      >
        {value}
      </div>
      <div className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[9px]">
        {label}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   DISCOVERY SECTION
   ═══════════════════════════════════════════════════════════════════════════ */

function DiscoverySection({
  eyebrow,
  title,
  count,
  accent = false,
  children,
}) {
  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className={`mb-2 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.25em] ${accent ? 'text-valo-red' : 'text-neutral-600'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${accent ? 'bg-valo-red shadow-[0_0_12px_rgba(255,68,68,0.7)]' : 'bg-neutral-600'}`} />
            {eyebrow}
          </div>
          <h2 className={`font-display text-2xl font-black uppercase tracking-tight sm:text-3xl ${accent ? 'text-white' : 'text-neutral-300'}`}>
            {title}
          </h2>
        </div>

        {count > 0 && (
          <span className={`hidden shrink-0 rounded-full border px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.15em] sm:inline-flex ${accent ? 'border-valo-red/15 bg-valo-red/[0.05] text-valo-red' : 'border-white/[0.07] bg-white/[0.02] text-neutral-600'}`}>
            {count} {count === 1 ? 'stream' : 'streams'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-y-9">
        {children}
      </div>
    </section>
  )
}


/* ═══════════════════════════════════════════════════════════════════════════
   TOP AD CAROUSEL
   ═══════════════════════════════════════════════════════════════════════ */

function TopAdCarousel({
  banners,
}) {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0)


  const total = banners.length


  useEffect(() => {
    if (total === 0) {
      setActiveIndex(0)
      return
    }


    if (activeIndex >= total) {
      setActiveIndex(0)
    }
  }, [
    total,
    activeIndex,
  ])


  useEffect(() => {
    if (total <= 1) return


    const timer = setInterval(() => {
      setActiveIndex(
        (current) =>
          (current + 1) % total
      )
    }, 7000)


    return () =>
      clearInterval(timer)
  }, [total])


  if (total === 0) {
    return null
  }


  const currentAd =
    banners[activeIndex]


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

            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex -
                    1 +
                    total) %
                    total
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


            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (activeIndex + 1) %
                    total
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


      {total > 1 && (
        <div
          className="
            flex
            items-center
            justify-center
            gap-2
            mt-3
          "
        >

          {banners.map(
            (banner, index) => (

              <button
                key={banner.id}
                type="button"
                onClick={() =>
                  setActiveIndex(index)
                }
                aria-label={`Show advertisement ${
                  index + 1
                }`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all

                  ${
                    index ===
                    activeIndex
                      ? 'w-7 bg-valo-red'
                      : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                  }
                `}
              />

            )
          )}

        </div>
      )}

    </section>
  )
}



/* ═══════════════════════════════════════════════════════════════════════════
   SECTION LABEL
   ═══════════════════════════════════════════════════════════════════════ */

function SectionLabel({
  icon,
  label,
  count,
  accent = false,
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-2.5
        py-1
        select-none
      "
    >

      {icon}


      <h2
        className={`
          font-display
          font-black
          text-xs
          uppercase
          tracking-widest

          ${
            accent
              ? 'text-valo-red'
              : 'text-neutral-400'
          }
        `}
      >
        {label}
      </h2>


      <span
        className="
          text-[10px]
          font-mono
          text-neutral-500
          bg-neutral-950
          border
          border-neutral-900
          px-2
          py-0.5
          rounded-full
          font-bold
        "
      >
        {count}
      </span>


      <div
        className="
          flex-1
          h-px
          bg-neutral-900
        "
      />

    </div>
  )
}



/* ═══════════════════════════════════════════════════════════════════════════
   LIVE DOT
   ═══════════════════════════════════════════════════════════════════════ */

function LiveDot() {
  return (
    <span
      className="
        w-2
        h-2
        rounded-full
        bg-valo-red
        animate-pulse
        shrink-0
      "
    />
  )
}



/* ═══════════════════════════════════════════════════════════════════════════
   OFFLINE DOT
   ═══════════════════════════════════════════════════════════════════════ */

function OfflineDot() {
  return (
    <span
      className="
        w-2
        h-2
        rounded-full
        bg-neutral-700
        shrink-0
      "
    />
  )
}



/* ═══════════════════════════════════════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════════════════════════════════ */

function EmptyState({
  search,
  platform,
}) {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-24
        text-center
        bg-neutral-950/20
        border
        border-neutral-900
        rounded-2xl
        max-w-md
        mx-auto
        w-full
      "
    >

      <div
        className="
          w-14
          h-14
          rounded-xl
          bg-neutral-900/50
          border
          border-neutral-800
          flex
          items-center
          justify-center
          mb-4
          text-xl
        "
      >
        📡
      </div>


      <h3
        className="
          font-display
          font-black
          text-sm
          text-neutral-400
          uppercase
          tracking-widest
          mb-1
        "
      >
        No Channels Match
      </h3>


      <p
        className="
          text-neutral-500
          text-xs
          max-w-xs
          font-mono
          uppercase
          tracking-wider
          leading-relaxed
        "
      >

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
   ═══════════════════════════════════════════════════════════════════════ */

function RefreshIcon({
  className = '',
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
