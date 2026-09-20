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
        // When an ad is supplied by the carousel, use that exact advertisement.
        if (propAd) {
          if (sessionStorage.getItem(`hide-ad-${propAd.id}`)) {
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

        if (sessionStorage.getItem(`hide-ad-${selectedAd.id}`)) {
          setIsHidden(true)
          setIsLoading(false)
          return
        }

        setAd(selectedAd)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed loading promotional banner:', err)

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
    if (!ad || isHidden || impressionTracked.current) {
      return
    }

    const impressionKey = `impression-ad-${ad.id}`

    if (sessionStorage.getItem(impressionKey)) {
      impressionTracked.current = true
      return
    }

    impressionTracked.current = true

    sessionStorage.setItem(impressionKey, 'true')

    supabase
      .rpc('increment_banner_impressions', {
        banner_id: ad.id
      })
      .then(({ error }) => {
        if (error) {
          console.error('Ad impression tracking error:', error)
        }
      })
  }, [ad, isHidden])

  // ── Track click ─────────────────────────────────────────────────────────
  const handleBannerClick = () => {
    if (!ad) return

    supabase
      .rpc('increment_banner_clicks', {
        banner_id: ad.id
      })
      .then(({ error }) => {
        if (error) {
          console.error('Ad click tracking error:', error)
        }
      })
  }

  // ── Dismiss advertisement ───────────────────────────────────────────────
  const handleCancelClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!ad) return

    sessionStorage.setItem(`hide-ad-${ad.id}`, 'true')
    setIsHidden(true)
  }

  if (isLoading || !ad || isHidden) {
    return null
  }

  const mediaUrl = ad.media_url || ad.mediaUrl
  const redirectUrl = ad.redirect_url || ad.redirectUrl
  const mediaType = (ad.media_type || ad.mediaType || 'image').toLowerCase()

  return (
    <div className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080808] shadow-[0_18px_60px_rgba(0,0,0,0.35)] animate-fade-in">
      {/* Top esports HUD line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-[#ff4655]/70 to-transparent" />

      {/* Main Advertisement */}
      <a
        href={redirectUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBannerClick}
        className="relative block w-full aspect-[5/1] min-h-[120px] max-h-[300px] overflow-hidden bg-[#050505]"
      >
        {mediaType === 'video' ? (
          <video
            src={mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <img
            src={mediaUrl}
            alt={ad.label || 'Advertisement'}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        )}

        {/* Cinematic readability overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/25" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* AD status tag */}
        <div className="absolute left-3 top-3 z-20 rounded-md border border-white/[0.1] bg-black/70 px-2 py-1 font-mono text-[7px] font-black uppercase tracking-[0.22em] text-neutral-300 backdrop-blur-md sm:left-4 sm:top-4">
          SPONSORED
        </div>

        {/* Dismiss */}
        <button
          type="button"
          onClick={handleCancelClick}
          className="absolute right-3 top-3 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.1] bg-black/70 text-neutral-400 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:border-white/20 hover:bg-black hover:text-white focus:opacity-100 sm:right-4 sm:top-4"
          aria-label="Dismiss advertisement"
          title="Dismiss advertisement"
        >
          ×
        </button>

        {/* Bottom media cue */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between sm:inset-x-4 sm:bottom-4">
          <div className="max-w-[65%]">
            <span className="block truncate font-display text-[10px] font-black uppercase tracking-[0.14em] text-white drop-shadow-lg sm:text-xs">
              {ad.label}
            </span>
          </div>

          {redirectUrl && (
            <span className="rounded-lg border border-white/15 bg-black/60 px-2.5 py-1.5 font-mono text-[7px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md sm:px-3">
              Open
            </span>
          )}
        </div>
      </a>

      {/* Sponsor footer */}
      <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="truncate font-display text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-200 sm:text-[11px]">
            {ad.label}
          </p>
          <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.16em] text-neutral-600">
            Promoted placement
          </p>
        </div>

        {redirectUrl && (
          <a
            href={redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBannerClick}
            className="shrink-0 rounded-lg border border-white/[0.1] bg-white/[0.035] px-3.5 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-neutral-300 transition-all hover:border-[#ff4655]/50 hover:bg-[#ff4655] hover:text-white active:scale-[0.98]"
          >
            Visit
          </a>
        )}
      </div>
    </div>
  )
}
