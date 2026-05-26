import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SubscribedForecastPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [subscribedStreamers, setSubscribedStreamers] = useState([])
  const [dbInsights, setDbInsights] = useState([])
  
  // 🎯 DYNAMIC DEFAULT: Automatically sets the active tab to the current day of the week
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())

  useEffect(() => {
    async function loadRadarMatrix() {
      if (!user) {
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)

        // 1. Fetch user subscriptions from stream_subscriptions table
        const { data: subs, error: subsError } = await supabase
          .from('stream_subscriptions')
          .select('streamer_id')
          .eq('user_id', user.id)

        if (subsError) throw subsError
        
        const subIds = (subs || []).map(s => String(s.streamer_id).trim().toLowerCase())

        if (subIds.length === 0) {
          setSubscribedStreamers([])
          setIsLoading(false)
          return
        }

        // 2. Resolve platform handles/YouTube IDs to real streamer registry entries
        const { data: streamersRegistry, error: registryError } = await supabase
          .from('streamers')
          .select('id, youtube_channel_id, kick_username')

        if (registryError) throw registryError

        const cleanUUIDs = (streamersRegistry || [])
          .filter(s => {
            const currentId = s.id ? String(s.id).toLowerCase() : ''
            const currentYt = s.youtube_channel_id ? String(s.youtube_channel_id).toLowerCase() : ''
            const currentKick = s.kick_username ? String(s.kick_username).toLowerCase() : ''

            return (
              (currentId && subIds.includes(currentId)) ||
              (currentYt && subIds.includes(currentYt)) ||
              (currentKick && subIds.includes(currentKick))
            )
          })
          .map(s => s.id)
          .filter(id => id && typeof id === 'string' && id.includes('-'))

        if (cleanUUIDs.length === 0) {
          setSubscribedStreamers([])
          setDbInsights([])
          setIsLoading(false)
          return
        }

        // 3. Query real-time scraper metrics using resolved UUID parameters
        const { data: streamerRows, error: dataError } = await supabase
          .from('streamer_data')
          .select('streamer_id, channel_name, avatar, is_live')
          .in('streamer_id', cleanUUIDs)

        if (dataError) throw dataError
        setSubscribedStreamers(streamerRows || [])

        // 4. Download historical statistics compiled from database views
        const { data: insights, error: insightsError } = await supabase
          .from('stream_prediction_insights')
          .select('*')
          .in('streamer_id', cleanUUIDs)

        if (!insightsError) {
          setDbInsights(insights || [])
        }
      } catch (err) {
        console.error('Error calibrating forecast matrix:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadRadarMatrix()
  }, [user])

  // Process timeline data rows with automatic client-side timezone alignment
  const dayTimeline = useMemo(() => {
    const hoursArray = Array.from({ length: 24 }, (_, i) => i)
    
    // 🎯 DYNAMIC TIMEZONE CALIBRATOR: Maps structural server integer values accurately back to local system clock index
    const timezoneOffsetHours = -(new Date().getTimezoneOffset() / 60)
    const floorOffset = Math.floor(timezoneOffsetHours) 

    return hoursArray.map(localHour => {
      const activeMatches = subscribedStreamers.map(streamer => {
        
        const savedLog = dbInsights.find(p => {
          if (String(p.streamer_id).toLowerCase() !== String(streamer.streamer_id).toLowerCase()) return false

          // 🔄 SHIFT LAYER: Convert raw DB hour integer back to local device hours via standard modulo parameters
          let convertedLocalHour = (Number(p.hour_of_day) + floorOffset) % 24
          if (convertedLocalHour < 0) convertedLocalHour += 24

          // 🔄 WEEKDAY BOUNDARY ROLLOVERS: Handle cases where timezone calculation steps over a day dividing line
          let targetDay = Number(p.day_of_week)
          if (Number(p.hour_of_day) + timezoneOffsetHours >= 24) {
            targetDay = (targetDay + 1) % 7
          } else if (Number(p.hour_of_day) + timezoneOffsetHours < 0) {
            targetDay = (targetDay - 1 + 7) % 7
          }

          return convertedLocalHour === localHour && targetDay === Number(selectedDay)
        })

        const probability = savedLog ? parseFloat(savedLog.live_probability) : 0

        if (probability > 0) {
          return {
            streamer,
            probability,
            confidence: probability > 75 ? 'HIGH CLEARANCE' : probability > 45 ? 'MID CONTEXT' : 'LOW MARGIN'
          }
        }
        return null
      }).filter(Boolean)

      return { hour: localHour, events: activeMatches }
    }).filter(h => h.events.length > 0)
  }, [subscribedStreamers, dbInsights, selectedDay])

  // Extract top performers with metrics recorded for the radar bar gauges
  const radarPerformers = useMemo(() => {
    return subscribedStreamers.map(streamer => {
      const streamerLogs = dbInsights.filter(p => String(p.streamer_id).toLowerCase() === String(streamer.streamer_id).toLowerCase())
      if (streamerLogs.length === 0) return null
      
      const totalProbability = streamerLogs.reduce((acc, curr) => acc + parseFloat(curr.live_probability), 0)
      const avgWeight = Math.round(totalProbability / streamerLogs.length)
      
      return { streamer, avgWeight }
    }).filter(Boolean).sort((a, b) => b.avgWeight - a.avgWeight).slice(0, 5)
  }, [subscribedStreamers, dbInsights])

  return (
    <MainLayout>
      <div className="space-y-8 max-w-[1680px] mx-auto px-4 animate-fade-in text-neutral-300">
        
        {/* ── HEADER HUD TITLE MATRIX ─────────────────────────────────── */}
        <div className="border-b border-neutral-900 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
          <div>
            <h1 className="font-display font-black text-2xl tracking-wider text-white uppercase flex items-center gap-3">
              <span className="w-2 h-6 bg-valo-red rounded-full inline-block" />
              FORECAST // <span className="text-valo-red">RADAR MATRIX</span>
            </h1>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1.5 pl-5">
              Synchronized Habitation Index Models // Tracked Subscribers: {String(subscribedStreamers.length).padStart(2, '0')}
            </p>
          </div>
          <span className="text-[8px] font-mono bg-neutral-950 border border-neutral-900 px-2 py-1 text-neutral-600 font-bold uppercase tracking-widest rounded-sm self-start md:self-auto">
            SYS_LOCAL_TZ // ACTIVE
          </span>
        </div>

        {/* ── WEEKDAY HUD TAB SELECTOR ────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-1.5 bg-neutral-950/40 p-2 border border-neutral-900/60 rounded-xl select-none">
          {DAYS_OF_WEEK.map((dayLabel, index) => {
            const isSelected = selectedDay === index
            return (
              <button
                key={dayLabel}
                onClick={() => setSelectedDay(index)}
                className={`relative flex-1 min-w-[95px] text-center py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border rounded-sm overflow-hidden
                  ${isSelected
                    ? 'bg-[#ff4655] border-[#ff4655] text-white font-black shadow-[0_0_20px_rgba(255,70,85,0.15)]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/30'
                  }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[4px] border-t-black border-l-[4px] border-l-transparent" />
                )}
                <span>{dayLabel.substring(0, 3)}</span>
              </button>
            )
          })}
        </div>

        {/* ── TWO-COLUMN CORE DISPLAY CANVAS ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT CANVASES: TIMELINE HOURLY MATRIX */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-neutral-400 font-display font-black text-xs uppercase tracking-widest px-1 flex items-center gap-2 select-none font-mono">
              <span className="w-1.5 h-1.5 bg-[#ff4655] rounded-none transform rotate-45" />
              Schedules Forecast Terminal // {DAYS_OF_WEEK[selectedDay]}
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-24 w-full bg-[#0c0d10] border border-neutral-900/50 animate-pulse rounded-none" />
                ))}
              </div>
            ) : dayTimeline.length === 0 ? (
              <div className="text-center border border-dashed border-neutral-900 bg-neutral-950/10 py-24 font-mono text-neutral-600 text-xs uppercase tracking-widest leading-relaxed max-w-xl mx-auto w-full">
                // ZERO PROBABILITY METRICS REGISTERED FOR SUBS ON THIS DAY MATRIX
              </div>
            ) : (
              <div className="relative border-l border-neutral-900/80 pl-4 ml-2 space-y-4 py-1">
                {dayTimeline.map(({ hour, events }) => (
                  <div key={hour} className="relative group">
                    {/* Node Pointer Bullet */}
                    <div className="absolute -left-[20.5px] top-4 w-2 h-2 bg-neutral-900 border border-neutral-700 group-hover:bg-[#ff4655] group-hover:border-[#ff4655] group-hover:shadow-[0_0_8px_rgba(255,70,85,0.4)] transition-all duration-150 transform rotate-45" />
                    
                    {/* Hourly block line container layout */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4 bg-[#0c0d10]/60 border border-neutral-900 p-4 rounded-sm transition-colors group-hover:border-neutral-800 relative">
                      <div className="absolute top-0 left-0 w-[1px] h-3 bg-neutral-800 group-hover:bg-[#ff4655] transition-colors" />

                      {/* Clean localized formatted output string */}
                      <div className="shrink-0 font-mono text-xs font-black text-neutral-400 uppercase tracking-widest min-w-[75px] pt-0.5 select-none">
                        {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                      </div>

                      {/* Satellite Node Links List Grid */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {events.map(({ streamer, probability, confidence }) => (
                          <div key={streamer.streamer_id} className="flex items-center gap-3 bg-neutral-950/80 border border-neutral-900/60 p-2 rounded-sm hover:border-neutral-800 transition-colors">
                            <img 
                              src={streamer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"} 
                              alt="" 
                              className="w-8 h-8 border border-neutral-800 object-cover shrink-0"
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" }}
                            />
                            <div className="min-w-0 flex-1 space-y-0.5">
                              <div className="text-xs font-bold text-white truncate uppercase tracking-wide font-sans">
                                {streamer.channel_name}
                              </div>
                              <div className="text-[9px] font-mono flex items-center gap-2 select-none">
                                <span className={
                                  probability > 75 ? 'text-emerald-400 font-bold' : probability > 45 ? 'text-amber-400' : 'text-neutral-500'
                                }>
                                  {probability}% [{confidence}]
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT CANVAS PANEL: LIVE TOTAL AVERAGED WEIGHT RADAR CAPTURE */}
          <div className="lg:col-span-1 bg-[#0c0d10] border border-neutral-900 p-5 space-y-5 sticky top-20 rounded-sm shadow-2xl">
            <div>
              <h2 className="text-white font-display font-black text-xs uppercase tracking-widest flex items-center gap-2.5 select-none font-mono">
                <span className="w-1.5 h-1.5 bg-[#ff4655] rounded-none transform rotate-45 animate-pulse" />
                Live Probability Radar
              </h2>
              <div className="h-[1px] bg-neutral-900 w-full mt-2.5 opacity-60" />
            </div>

            {isLoading ? (
              <div className="h-48 w-full bg-neutral-950 border border-neutral-900 animate-pulse rounded-sm" />
            ) : radarPerformers.length === 0 ? (
              <div className="text-center py-12 font-mono text-[9px] uppercase text-neutral-600 tracking-widest">
                // RADAR IDLE // WAITING FOR DATA INGESTS
              </div>
            ) : (
              <div className="space-y-3.5 font-mono text-xs">
                {radarPerformers.map(({ streamer, avgWeight }) => (
                  <div key={`radar-item-${streamer.streamer_id}`} className="space-y-2 bg-neutral-950/60 border border-neutral-900 p-3 rounded-sm hover:border-neutral-800 transition-colors group">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-300 font-sans font-bold uppercase truncate pr-2 group-hover:text-[#ff4655] transition-colors">
                        {streamer.channel_name}
                      </span>
                      <span className="text-[#ff4655] font-black shrink-0">{avgWeight}%</span>
                    </div>
                    
                    {/* Custom Gauge Meter Trace */}
                    <div className="w-full h-1.5 bg-neutral-950 p-[1px] border border-neutral-900 rounded-none overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#ff4655]/40 to-[#ff4655] transition-all duration-500 shadow-[0_0_8px_rgba(255,70,85,0.4)]"
                        style={{ width: `${avgWeight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </MainLayout>
  )
}