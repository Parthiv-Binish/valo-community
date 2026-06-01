import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import MainLayout from '../layouts/MainLayout'
import StreamerCard from '../components/stream/StreamCard'
import StreamerCardSkeleton from '../components/stream/StreamCardSkeleton'
import FilterBar from '../components/stream/FilterBar'
import { useAllStreamers } from '../hooks/useAllStreamers'
import TacticalBanner from '../components/common/TacticalBanner'

export default function AllStreamersPage() {
  const { streamers, isLoading, error, refresh, lastRefreshed } = useAllStreamers()
  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [banners, setBanners] = useState([])

  // 1. Fetch all active promotions regardless of their placement settings
  useEffect(() => {
    async function fetchAllActiveBanners() {
      try {
        const { data, error: bannerError } = await supabase
          .from('platform_banners')
          .select('*')
          .eq('is_active', true)
        
        if (!bannerError) {
          setBanners(data || [])
        }
      } catch (err) {
        console.error('Failed fetching ad inventory:', err)
      }
    }
    fetchAllActiveBanners()
  }, [streamers])

  const safeStreamers = useMemo(() => streamers || [], [streamers])

  const filtered = useMemo(() => {
    let s = safeStreamers
    if (platformFilter !== 'all') s = s.filter((st) => st.platform === platformFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      s = s.filter((st) =>
        (st.channelName || '').toLowerCase().includes(q) ||
        (st.title       || '').toLowerCase().includes(q)
      )
    }
    return s
  }, [safeStreamers, platformFilter, search])

  const counts = useMemo(() => ({
    all:     safeStreamers.length,
    youtube: safeStreamers.filter((s) => s.platform === 'youtube').length,
    kick:    safeStreamers.filter((s) => s.platform === 'kick').length,
  }), [safeStreamers])

  const liveStreams    = useMemo(() => filtered.filter((s) => s.isLive || s.is_live), [filtered])
  const offlineStreams = useMemo(() => filtered.filter((s) => !s.isLive && !s.is_live), [filtered])

  return (
    <MainLayout>
      <div className="space-y-8 max-w-[1680px] mx-auto px-4 animate-fade-in">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between flex-wrap gap-4 border-b border-neutral-900 pb-5">
          <div>
            <h1 className="font-display font-black text-2xl tracking-wider text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-valo-red rounded-full inline-block" />
              COMMUNITY <span className="text-valo-red">AGENTS</span>
            </h1>
            {!isLoading && (
              <p className="text-valo-muted text-xs font-mono uppercase tracking-widest mt-1.5 pl-5">
                <span className="text-green-400 font-bold">{liveStreams.length} live</span>
                <span className="mx-2 text-neutral-800">•</span>
                <span>{offlineStreams.length} standby</span>
                <span className="mx-2 text-neutral-800">•</span>
                <span>{filtered.length} total</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="text-xs text-valo-muted font-mono hidden sm:block uppercase tracking-wider">
                Sync // {typeof lastRefreshed === 'string' ? lastRefreshed : lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={refresh}
              disabled={isLoading}
              className="valo-btn-ghost text-xs py-1.5 px-3.5 flex items-center gap-2 font-mono uppercase tracking-wider border border-neutral-800 bg-neutral-950 text-white"
            >
              <RefreshIcon className={isLoading ? 'animate-spin' : ''} />
              Recalibrate
            </button>
          </div>
        </div>

        {/* ── Search + Filter Panel ──────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between bg-neutral-950/40 p-2.5 border border-neutral-900 rounded-xl">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"
              width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agent broadcast lines..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-valo-red text-white placeholder-neutral-600 outline-none pl-9 pr-8 h-9 rounded-lg text-xs font-mono tracking-tight transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>

          <FilterBar active={platformFilter} onChange={setPlatformFilter} counts={counts} />
        </div>

        {/* ── Error Messages ────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4 text-xs text-red-400 font-mono uppercase tracking-wider">
            ⚠️ SYSTEM REJECTION // {error}
          </div>
        )}

        {/* ── UNIFIED FULL-WIDTH GRID CANVAS ──────────────────────────── */}
        <div className="space-y-12">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <StreamerCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState search={search} platform={platformFilter} />
          ) : (
            <>
              {/* 🔴 CATEGORY ONE: LIVE STREAM AGENTS */}
              {liveStreams.length > 0 && (
                <section className="space-y-5">
                  <SectionLabel icon={<LiveDot />} label="Live Now" count={liveStreams.length} accent />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {liveStreams.map((s, idx) => {
                      const elementKey = s.id || s.streamer_id || `live-${idx}`;
                      return (
                        <div key={`live-wrapper-${elementKey}`} className="contents">
                          
                          {/* 🌟 POSITION 3 INJECTION: Displays your 1st active ad banner */}
                          {idx === 2 && banners.length > 0 && (
                            <TacticalBanner ad={banners[0]} />
                          )}
                          
                          {/* 🌟 POSITION 6 INJECTION: Displays your 2nd active ad banner if row is long enough */}
                          {idx === 5 && banners.length > 1 && (
                            <TacticalBanner ad={banners[1]} />
                          )}
                          
                          <StreamerCard streamer={s} />
                        </div>
                      )
                    })}

                    {/* 🌟 LIVE ROSTER FAILSAFE: If fewer than 3 creators are live, append all available banners here */}
                    {liveStreams.length < 3 && banners.map((banner, bIdx) => (
                      <TacticalBanner key={`live-append-ad-${bIdx}`} ad={banner} />
                    ))}
                  </div>
                </section>
              )}

              {/* ⚪ CATEGORY TWO: OFFLINE CHANNELS */}
              {offlineStreams.length > 0 && (
                <section className="space-y-5">
                  <SectionLabel icon={<OfflineDot />} label="Offline standbys" count={offlineStreams.length} />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    
                    {/* 🌟 OFFLINE ROSTER FALLBACK: If completely empty of live content, render all active ads here at position #1 */}
                    {liveStreams.length === 0 && banners.map((banner, bIdx) => (
                      <TacticalBanner key={`offline-fallback-ad-${bIdx}`} ad={banner} />
                    ))}

                    {offlineStreams.map((s, idx) => {
                      const elementKey = s.id || s.streamer_id || `offline-${idx}`;
                      return (
                        <div key={`offline-wrapper-${elementKey}`} className="contents">
                          
                          {/* If nobody is live, we scatter the ads at regular intervals inside the offline list */}
                          {liveStreams.length === 0 && idx === 3 && banners.length > 0 && (
                            <TacticalBanner ad={banners[0]} />
                          )}
                          
                          <StreamerCard streamer={s} />
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        {/* Footer Meta Deck */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-center text-[10px] text-valo-muted font-mono uppercase tracking-widest pt-12 pb-4 border-t border-neutral-900/60">
            Realtime Matrix Sync active · Frequency sweep loop configured at 60s
          </p>
        )}
      </div>
    </MainLayout>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label, count, accent = false }) {
  return (
    <div className="flex items-center gap-2.5 py-1 select-none">
      {icon}
      <h2 className={`font-display font-black text-xs uppercase tracking-widest ${accent ? 'text-valo-red' : 'text-neutral-400'}`}>
        {label}
      </h2>
      <span className="text-[10px] font-mono text-neutral-500 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded-full font-bold">
        {count}
      </span>
      <div className="flex-1 h-px bg-neutral-900" />
    </div>
  )
}

function LiveDot() {
  return <span className="w-2 h-2 rounded-full bg-valo-red animate-pulse shrink-0" />
}

function OfflineDot() {
  return <span className="w-2 h-2 rounded-full bg-neutral-700 shrink-0" />
}

function EmptyState({ search, platform }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center bg-neutral-950/20 border border-neutral-900 rounded-2xl max-w-md mx-auto w-full">
      <div className="w-14 h-14 rounded-xl bg-neutral-900/50 border border-neutral-800 flex items-center justify-center mb-4 text-xl">
        📡
      </div>
      <h3 className="font-display font-black text-sm text-neutral-400 uppercase tracking-widest mb-1">No Channels Match</h3>
      <p className="text-neutral-500 text-xs max-w-xs font-mono uppercase tracking-wider leading-relaxed">
        {search
          ? `No matching profiles register under keys: "${search}"`
          : platform !== 'all'
          ? `No configured ${platform} agents present in repository.`
          : 'Zero live feeds or tracking points detected.'}
      </p>
    </div>
  )
}

function RefreshIcon({ className = '' }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={className}>
      <path d="M23 4v6h-6" /><path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}
