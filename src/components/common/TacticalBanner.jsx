import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TacticalBanner({
  placement = 'feed_sidebar',
  ad: propAd
}) {
  const [ad, setAd] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHidden, setIsHidden] = useState(false)

  const impressionTracked = useRef(false)

  // ── Load advertisement ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function loadAd() {
      setIsLoading(true)
      setIsHidden(false)
      setAd(null)
      impressionTracked.current = false

      try {

        // When an ad is supplied by the carousel,
        // use that exact advertisement.
        if (propAd) {

          if (
            sessionStorage.getItem(
              `hide-ad-${propAd.id}`
            )
          ) {
            if (!cancelled) {
              setIsHidden(true)
              setIsLoading(false)
            }

            return
          }

          if (!cancelled) {
            setAd(propAd)
            setIsLoading(false)
          }

          return
        }


        // ── Standalone banner mode ─────────────────────────────────────
        const { data, error } = await supabase
          .from('platform_banners')
          .select('*')
          .eq('is_active', true)
          .eq('placement', placement)
          .order('created_at', {
            ascending: false
          })

        if (error) {
          throw error
        }

        if (cancelled) {
          return
        }

        if (!data || data.length === 0) {
          setAd(null)
          setIsLoading(false)
          return
        }

        const selectedAd = data[0]

        if (
          sessionStorage.getItem(
            `hide-ad-${selectedAd.id}`
          )
        ) {
          setIsHidden(true)
          setIsLoading(false)
          return
        }

        setAd(selectedAd)
        setIsLoading(false)

      } catch (err) {

        console.error(
          'Failed loading promotional banner:',
          err
        )

        if (!cancelled) {
          setAd(null)
          setIsLoading(false)
        }

      }
    }

    loadAd()

    return () => {
      cancelled = true
    }

  }, [placement, propAd])


  // ── Track impression once per session ───────────────────────────────────
  useEffect(() => {
    if (
      !ad ||
      isHidden ||
      impressionTracked.current
    ) {
      return
    }

    const impressionKey =
      `impression-ad-${ad.id}`

    if (
      sessionStorage.getItem(impressionKey)
    ) {
      impressionTracked.current = true
      return
    }

    impressionTracked.current = true

    sessionStorage.setItem(
      impressionKey,
      'true'
    )

    supabase
      .rpc(
        'increment_banner_impressions',
        {
          banner_id: ad.id
        }
      )
      .then(({ error }) => {
        if (error) {
          console.error(
            'Ad impression tracking error:',
            error
          )
        }
      })

  }, [ad, isHidden])


  // ── Track click ─────────────────────────────────────────────────────────
  const handleBannerClick = () => {
    if (!ad) return

    supabase
      .rpc(
        'increment_banner_clicks',
        {
          banner_id: ad.id
        }
      )
      .then(({ error }) => {
        if (error) {
          console.error(
            'Ad click tracking error:',
            error
          )
        }
      })
  }


  // ── Dismiss advertisement ───────────────────────────────────────────────
  const handleCancelClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!ad) return

    sessionStorage.setItem(
      `hide-ad-${ad.id}`,
      'true'
    )

    setIsHidden(true)
  }


  if (
    isLoading ||
    !ad ||
    isHidden
  ) {
    return null
  }


  const mediaUrl =
    ad.media_url || ad.mediaUrl

  const redirectUrl =
    ad.redirect_url || ad.redirectUrl

  const mediaType =
    (
      ad.media_type ||
      ad.mediaType ||
      'image'
    ).toLowerCase()


  return (
    <div
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-xl
        border
        border-neutral-800
        bg-neutral-950
        shadow-xl
        shadow-black/30
        animate-fade-in
      "
    >

      {/* ── Main Advertisement ─────────────────────────────────────────── */}
      <a
        href={redirectUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBannerClick}
        className="
          relative
          block
          w-full
          aspect-[5/1]
          min-h-[120px]
          max-h-[300px]
          overflow-hidden
          bg-neutral-950
        "
      >

        {mediaType === 'video' ? (

          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-[1.015]
            "
          />

        ) : (

          <img
            src={mediaUrl}
            alt={ad.label || 'Advertisement'}
            loading="lazy"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-[1.015]
            "
          />

        )}


        {/* ── Subtle overlay ──────────────────────────────────────────── */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-black/40
            via-transparent
            to-black/20
            pointer-events-none
          "
        />


        {/* ── AD label ────────────────────────────────────────────────── */}
        <div
          className="
            absolute
            top-3
            left-3
            z-20
            rounded
            bg-black/70
            backdrop-blur-md
            border
            border-white/10
            px-2
            py-1
            text-[8px]
            font-mono
            font-black
            tracking-[0.2em]
            text-neutral-300
            uppercase
          "
        >
          AD
        </div>


        {/* ── Dismiss button ──────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleCancelClick}
          className="
            absolute
            top-3
            right-3
            z-30
            flex
            h-7
            w-7
            items-center
            justify-center
            rounded-full
            bg-black/70
            backdrop-blur-md
            border
            border-white/10
            text-neutral-400
            text-sm
            opacity-0
            transition-all
            group-hover:opacity-100
            hover:bg-black
            hover:text-white
          "
          aria-label="Dismiss advertisement"
          title="Dismiss advertisement"
        >
          ×
        </button>

      </a>


      {/* ── Minimal Sponsor Footer ────────────────────────────────────── */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-t
          border-neutral-900
          bg-neutral-950
          px-4
          py-2.5
        "
      >

        <div className="min-w-0">

          <p
            className="
              truncate
              text-[11px]
              font-display
              font-bold
              uppercase
              tracking-wider
              text-neutral-200
            "
          >
            {ad.label}
          </p>

          <p
            className="
              truncate
              text-[9px]
              font-mono
              uppercase
              tracking-wider
              text-neutral-600
            "
          >
            Sponsored
          </p>

        </div>


        {redirectUrl && (
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBannerClick}
            className="
              shrink-0
              rounded-md
              border
              border-neutral-700
              bg-neutral-900
              px-4
              py-1.5
              text-[9px]
              font-mono
              font-bold
              uppercase
              tracking-widest
              text-neutral-200
              transition-all
              hover:border-valo-red
              hover:bg-valo-red
              hover:text-white
            "
          >
            Visit
          </a>
        )}

      </div>

    </div>
  )
}
