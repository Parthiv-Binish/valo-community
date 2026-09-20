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


  return (
    <MainLayout>

      <div
        className="
          w-full
          max-w-[1680px]
          mx-auto
          px-4
          sm:px-5
          lg:px-6
          space-y-8
          animate-fade-in
          overflow-x-hidden
        "
      >


        {/* ═══════════════════════════════════════════════════════════════
            HEADER
            ═══════════════════════════════════════════════════════════ */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-start
            sm:justify-between
            gap-4
            border-b
            border-neutral-900
            pb-5
          "
        >

          <div>

            <h1
              className="
                font-display
                font-black
                text-2xl
                tracking-wider
                text-white
                uppercase
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  w-2
                  h-6
                  bg-valo-red
                  rounded-full
                  inline-block
                  shrink-0
                "
              />

              COMMUNITY

              <span className="text-valo-red">
                AGENTS
              </span>

            </h1>


            {!isLoading && (
              <p
                className="
                  text-valo-muted
                  text-xs
                  font-mono
                  uppercase
                  tracking-widest
                  mt-1.5
                  pl-5
                  whitespace-nowrap
                "
              >

                <span
                  className="
                    text-green-400
                    font-bold
                  "
                >
                  {liveStreams.length} live
                </span>


                <span
                  className="
                    mx-2
                    text-neutral-800
                  "
                >
                  •
                </span>


                <span>
                  {offlineStreams.length} offline
                </span>


                <span
                  className="
                    mx-2
                    text-neutral-800
                  "
                >
                  •
                </span>


                <span>
                  {filtered.length} total
                </span>

              </p>
            )}

          </div>


          {/* Desktop refresh / sync */}

          <div
            className="
              flex
              items-center
              gap-3
              w-full
              sm:w-auto
            "
          >

            {lastRefreshed && (
              <span
                className="
                  hidden
                  sm:block
                  text-xs
                  text-valo-muted
                  font-mono
                  uppercase
                  tracking-wider
                "
              >
                Sync //{' '}

                {typeof lastRefreshed ===
                'string'
                  ? lastRefreshed
                  : lastRefreshed.toLocaleTimeString()}
              </span>
            )}


            <button
              onClick={refresh}
              disabled={isLoading}
              className="
                valo-btn-ghost
                text-xs
                py-1.5
                px-3.5
                flex
                items-center
                gap-2
                font-mono
                uppercase
                tracking-wider
                border
                border-neutral-800
                bg-neutral-950
                text-white
                w-fit
                sm:ml-auto
              "
            >

              <RefreshIcon
                className={
                  isLoading
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh

            </button>

          </div>

        </div>



        {/* ═══════════════════════════════════════════════════════════════
            FILTER AREA
            ═══════════════════════════════════════════════════════════ */}

        <section className="w-full">

          {/* ─────────────────────────────────────────────────────────────
              SEARCH

              Desktop:
              compact search box

              Mobile:
              full-width search field
              ───────────────────────────────────────────────────────── */}

          <div className="w-full">

            <label
              htmlFor="streamer-search"
              className="sr-only"
            >
              Search streamers
            </label>


            <div
              className="
                relative
                w-full
                h-12
                sm:h-11
              "
            >

              <svg
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-neutral-600
                  pointer-events-none
                "
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >

                <circle
                  cx="11"
                  cy="11"
                  r="8"
                />

                <path d="m21 21-4.35-4.35" />

              </svg>


              <input
                id="streamer-search"
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search agents or stream titles..."
                autoComplete="off"
                className="
                  w-full
                  h-full
                  rounded-xl
                  border
                  border-neutral-800
                  bg-neutral-950/70
                  backdrop-blur-md
                  text-white
                  placeholder-neutral-600
                  outline-none
                  pl-11
                  pr-11
                  font-mono
                  text-xs
                  tracking-wide
                  transition-all
                  duration-200
                  focus:border-valo-red/50
                  focus:shadow-[0_0_24px_rgba(255,68,68,0.07)]
                "
              />


              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch('')
                  }
                  aria-label="Clear search"
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-7
                    h-7
                    flex
                    items-center
                    justify-center
                    rounded-md
                    text-neutral-600
                    hover:text-white
                    hover:bg-white/[0.05]
                    transition-colors
                  "
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

          </div>



          {/* ─────────────────────────────────────────────────────────────
              PLATFORM FILTER
              ───────────────────────────────────────────────────────── */}

          <div className="mt-3 sm:mt-4">

            <FilterBar
              active={platformFilter}
              onChange={setPlatformFilter}
              counts={counts}
            />

          </div>



          {/* ─────────────────────────────────────────────────────────────
              LANGUAGE

              Mobile:
              dropdown

              Desktop:
              chips
              ───────────────────────────────────────────────────────── */}

          {languages.length > 0 && (

            <div className="mt-4">

              {/* Mobile dropdown */}

              <div className="sm:hidden">

                <label
                  htmlFor="language-filter"
                  className="
                    block
                    mb-2
                    text-[9px]
                    font-mono
                    uppercase
                    tracking-[0.18em]
                    text-neutral-600
                  "
                >
                  Language
                </label>


                <div className="relative">

                  <select
                    id="language-filter"
                    value={activeLanguage}
                    onChange={(event) =>
                      setLanguageFilter(
                        event.target.value
                      )
                    }
                    className="
                      appearance-none
                      w-full
                      h-11
                      rounded-xl
                      border
                      border-neutral-800
                      bg-neutral-950/70
                      text-neutral-300
                      outline-none
                      px-3.5
                      pr-10
                      font-display
                      text-xs
                      font-semibold
                      focus:border-valo-red/50
                      transition-colors
                    "
                  >

                    <option value="all">
                      All languages
                    </option>

                    {languages.map(
                      (language) => (
                        <option
                          key={language}
                          value={language}
                        >
                          {language}
                        </option>
                      )
                    )}

                  </select>


                  <svg
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      pointer-events-none
                      text-neutral-500
                    "
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



              {/* Desktop language chips */}

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-2
                  overflow-x-auto
                  scrollbar-none
                  pb-1
                "
                role="group"
                aria-label="Filter by language"
              >

                {[
                  'all',
                  ...languages,
                ].map((language) => (

                  <button
                    key={language}
                    type="button"
                    onClick={() =>
                      setLanguageFilter(
                        language
                      )
                    }
                    aria-pressed={
                      activeLanguage ===
                      language
                    }
                    className={`
                      shrink-0
                      px-4
                      py-1.5
                      rounded-full
                      text-xs
                      font-display
                      font-semibold
                      border
                      transition-all
                      duration-150

                      ${
                        activeLanguage ===
                        language
                          ? `
                            bg-white
                            text-black
                            border-white
                          `
                          : `
                            border-valo-border
                            text-valo-muted
                            hover:border-valo-muted
                            hover:text-valo-text
                          `
                      }
                    `}
                  >

                    {language === 'all'
                      ? 'All languages'
                      : language}

                  </button>

                ))}

              </div>

            </div>

          )}

        </section>



        {/* ═══════════════════════════════════════════════════════════════
            TOP ADVERTISEMENT
            ═══════════════════════════════════════════════════════════ */}

        {!isLoading &&
          banners.length > 0 && (
            <TopAdCarousel
              banners={banners}
            />
          )}



        {/* ═══════════════════════════════════════════════════════════════
            ERROR
            ═══════════════════════════════════════════════════════════ */}

        {error && (

          <div
            className="
              bg-red-950/20
              border
              border-red-900/40
              rounded-xl
              p-4
              text-xs
              text-red-400
              font-mono
              uppercase
              tracking-wider
            "
          >
            ⚠️ SYSTEM REJECTION // {error}
          </div>

        )}



        {/* ═══════════════════════════════════════════════════════════════
            STREAM CONTENT
            ═══════════════════════════════════════════════════════════ */}

        <div className="space-y-12">

          {/* Loading */}

          {isLoading ? (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-x-4
                gap-y-8
              "
            >

              {Array.from({
                length: 8,
              }).map((_, index) => (

                <StreamCardSkeleton
                  key={index}
                />

              ))}

            </div>

          ) : filtered.length === 0 ? (

            <EmptyState
              search={search}
              platform={platformFilter}
            />

          ) : (

            <>

              {/* LIVE */}

              {liveStreams.length > 0 && (

                <section className="space-y-5">

                  <SectionLabel
                    icon={<LiveDot />}
                    label="Live Now"
                    count={
                      liveStreams.length
                    }
                    accent
                  />


                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                      gap-x-4
                      gap-y-8
                    "
                  >

                    {liveStreams.map(
                      (streamer, index) => {

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
                      }
                    )}

                  </div>

                </section>

              )}



              {/* OFFLINE */}

              {offlineStreams.length > 0 && (

                <section className="space-y-5">

                  <SectionLabel
                    icon={<OfflineDot />}
                    label="Offline"
                    count={
                      offlineStreams.length
                    }
                  />


                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      lg:grid-cols-3
                      xl:grid-cols-4
                      gap-x-4
                      gap-y-8
                    "
                  >

                    {offlineStreams.map(
                      (streamer, index) => {

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
                      }
                    )}

                  </div>

                </section>

              )}

            </>

          )}

        </div>



        {/* ═══════════════════════════════════════════════════════════════
            FOOTER
            ═══════════════════════════════════════════════════════════ */}

        {!isLoading &&
          filtered.length > 0 && (

            <p
              className="
                text-center
                text-[10px]
                text-valo-muted
                font-mono
                uppercase
                tracking-widest
                pt-12
                pb-4
                border-t
                border-neutral-900/60
              "
            >
              Realtime Matrix Sync active · Frequency sweep loop configured at 60s
            </p>

          )}

      </div>

    </MainLayout>
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
