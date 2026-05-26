import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function TacticalBanner({ placement = 'feed_sidebar', ad: propAd }) {
  const [ad, setAd] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    // Check if the user has dismissed this specific ad profile during their current session
    if (propAd && sessionStorage.getItem(`hide-ad-${propAd.id}`)) {
      setIsHidden(true)
      setIsLoading(false)
      return
    }

    if (propAd) {
      setAd(propAd)
      setIsLoading(false)
      
      // Track impression view metrics asynchronously
      supabase.rpc('increment_banner_impressions', { banner_id: propAd.id })
        .then(() => {})
      return
    }

    async function fetchActiveAd() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from('platform_banners')
          .select('*')
          .eq('is_active', true)
          .eq('placement', placement)

        if (error) throw error

        if (data && data.length > 0) {
          const randomSelectedAd = data[Math.floor(Math.random() * data.length)]
          
          if (sessionStorage.getItem(`hide-ad-${randomSelectedAd.id}`)) {
            setIsHidden(true)
            return
          }

          setAd(randomSelectedAd)
          supabase.rpc('increment_banner_impressions', { banner_id: randomSelectedAd.id })
            .then(() => {})
        }
      } catch (err) {
        console.error('Failed bringing down promotional banner layer:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActiveAd()
  }, [placement, propAd])

  const handleBannerClick = async (e) => {
    // Prevent event bubbling if interactive action buttons are targeted
    if (e.target.closest('.cancel-ad-trigger')) return

    if (!ad) return
    try {
      await supabase.rpc('increment_banner_clicks', { banner_id: ad.id })
    } catch (err) {
      console.error('Analytics tracking registration error:', err)
    }
  }

  const handleCancelClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!ad) return
    
    // Store localized dismissal flag in browser session memory cache
    sessionStorage.setItem(`hide-ad-${ad.id}`, 'true')
    setIsHidden(true)
  }

  if (isLoading || !ad || isHidden) return null

  return (
    <div className="group relative flex flex-col w-full bg-transparent overflow-hidden rounded-xl border border-neutral-800 transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-black/40 animate-fade-in">
      
      {/* 🎬 1. ASPECT VIDEO THUMBNAIL CANVAS FRAME */}
      <a
        href={ad.redirect_url || ad.redirectUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleBannerClick}
        className="relative w-full aspect-video overflow-hidden bg-neutral-950 block z-10"
      >
        {ad.media_type === 'video' ? (
          <video
            src={ad.media_url || ad.mediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
          />
        ) : (
          <img
            src={ad.media_url || ad.mediaUrl}
            alt=""
            className="w-full h-full object-cover opacity-85 transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
          />
        )}

        {/* Heavy Bottom Gradient Bar Cover Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10 pointer-events-none" />

        {/* Floating Header Clearance Badge */}
        <div className="absolute top-2.5 right-2.5 z-20 bg-neutral-950/80 backdrop-blur-md border border-neutral-800/80 text-neutral-400 font-mono text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase shadow-md select-none group-hover:text-white group-hover:border-neutral-700 transition-colors">
          AD
        </div>
      </a>

      {/* 📡 2. INTERACTIVE ACTIONS PANEL (YouTube Layout Standard) */}
      <div className="bg-neutral-950 border-t border-neutral-900 p-3.5 flex flex-col gap-3 w-full z-20">
        
        {/* Ad Title Block */}
        <div className="flex flex-col min-w-0">
          <h4 className="text-neutral-100 font-display font-bold text-sm tracking-wide uppercase line-clamp-1">
            {ad.label}
          </h4>
          <span className="text-[10px] font-mono text-neutral-500 truncate mt-0.5">
            {(ad.redirect_url || ad.redirectUrl || '').replace(/^(https?:\/\/)?(www\.)?/, '')}
          </span>
        </div>

        {/* Action Button Row Layout Grid */}
        <div className="flex items-center justify-between gap-3 w-full mt-1">
          {/* Tactical Redirect Button Link */}
          <a
            href={ad.redirect_url || ad.redirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleBannerClick}
            className="flex-1 text-center bg-white text-black hover:bg-neutral-200 text-[11px] font-mono font-bold py-2 px-4 rounded-lg tracking-widest uppercase transition-all shadow-md active:scale-[0.98] decoration-transparent"
          >
            Click Here
          </a>

          {/* Minimal Cancel Button Anchor link node */}
          <button
            onClick={handleCancelClick}
            className="cancel-ad-trigger shrink-0 text-neutral-500 hover:text-[#ff4655] text-[10px] font-mono font-bold tracking-widest uppercase py-2 px-3 transition-colors rounded hover:bg-neutral-900/40"
            title="Dismiss Promotional Content Profile"
          >
            Cancel
          </button>
        </div>

      </div>

    </div>
  )
}