import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import { toLocalSlot, formatSlotLabel } from '../utils/timezone'

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function SubscribedForecastPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [subscribedStreamers, setSubscribedStreamers] = useState([])
  const [dbInsights, setDbInsights] = useState([])

  // Dynamic default: automatically sets the active tab to the current day of the week.
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

  // Timeline rows for the selected local weekday, aligned to the viewer's timezone.
  // Insight rows are stored as UTC (day_of_week, hour_of_day). Conversion is done
  // in minutes so half-hour zones such as IST (UTC+5:30) land on the right slot.
  const dayTimeline = useMemo(() => {
    const offsetMinutes = -new Date().getTimezoneOffset()
    const slots = new Map()

    for (const insight of dbInsights) {
      const probability = parseFloat(insight.live_probability)
      if (!(probability > 0)) continue

      const streamer = subscribedStreamers.find(
        (s) => String(s.streamer_id).toLowerCase() === String(insight.streamer_id).toLowerCase()
      )
      if (!streamer) continue

      const { day, minuteOfDay } = toLocalSlot(insight.day_of_week, insight.hour_of_day, offsetMinutes)
      if (day !== Number(selectedDay)) continue

      const event = {
        streamer,
        probability,
        confidence: probability > 75 ? 'VERY LIKELY' : probability > 45 ? 'LIKELY' : 'POSSIBLE'
      }

      if (!slots.has(minuteOfDay)) slots.set(minuteOfDay, [])
      slots.get(minuteOfDay).push(event)
    }

    return [...slots.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([minuteOfDay, events]) => ({
        key: minuteOfDay,
        label: formatSlotLabel(minuteOfDay),
        events
      }))
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

  const selectedDayEvents = dayTimeline.reduce((total, slot) => total + slot.events.length, 0)

  return (
    <MainLayout>
      <div className="mx-auto max-w-[1680px] space-y-5 px-4 pb-8 text-neutral-300 animate-fade-in">

        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_0%,rgba(255,70,85,0.11),transparent_34%),radial-gradient(circle_at_92%_100%,rgba(255,70,85,0.045),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/65 to-transparent" />

          <div className="relative flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.28em] text-[#ff4655]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,0.8)]" />
                Forecast // Personal Radar
              </div>

              <h1 className="font-display text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl">
                Radar <span className="text-[#ff4655]">Matrix</span>
              </h1>

              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.14em] text-neutral-600 sm:text-[10px]">
                Synchronized Habitation Index Models // Tracked Subscribers:{' '}
                <span className="text-neutral-400">{String(subscribedStreamers.length).padStart(2, '0')}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isLoading && (
                <div className="rounded-xl border border-white/[0.07] bg-black/25 px-3 py-2 text-center">
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-700">Day Events</div>
                  <div className="mt-0.5 font-display text-sm font-black text-white">{selectedDayEvents}</div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-xl border border-[#ff4655]/10 bg-[#ff4655]/[0.03] px-3 py-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff4655]" />
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#ff4655]/70">
                  Local TZ Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Weekday selector */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#09090a] p-1.5 sm:p-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {DAYS_OF_WEEK.map((dayLabel, index) => {
              const isSelected = selectedDay === index
              return (
                <button
                  key={dayLabel}
                  onClick={() => setSelectedDay(index)}
                  className={`relative min-h-10 min-w-[76px] flex-1 overflow-hidden rounded-xl border px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-all active:scale-95 sm:min-w-[95px] ${
                    isSelected
                      ? 'border-[#ff4655]/30 bg-[#ff4655] text-white shadow-[0_0_24px_rgba(255,70,85,0.12)]'
                      : 'border-transparent text-neutral-600 hover:bg-white/[0.03] hover:text-neutral-300'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-0 top-0 h-0 w-0 border-l-[5px] border-t-[5px] border-l-transparent border-t-black/50" />
                  )}
                  <span>{dayLabel.substring(0, 3)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Core display */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3 lg:gap-6">

          {/* Timeline */}
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                <span className="h-1.5 w-1.5 rotate-45 bg-[#ff4655]" />
                Schedule Forecast // {DAYS_OF_WEEK[selectedDay]}
              </h2>
              {!isLoading && dayTimeline.length > 0 && (
                <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-neutral-700">
                  {dayTimeline.length} slots
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(n => (
                  <div key={n} className="h-24 w-full animate-pulse rounded-2xl border border-white/[0.05] bg-[#0c0d10]" />
                ))}
              </div>
            ) : dayTimeline.length === 0 ? (
              <div className="relative flex min-h-[330px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/[0.07] bg-[#09090a] px-5 text-center">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,70,85,0.05),transparent_48%)]" />
                <div className="relative">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#111112] text-neutral-700">
                    <RadarIcon />
                  </div>
                  <div className="font-mono text-[9px] font-bold uppercase tracking-[0.24em] text-[#ff4655]/70">
                    Radar Idle
                  </div>
                  <p className="mx-auto mt-2 max-w-sm font-mono text-[10px] uppercase leading-5 tracking-wider text-neutral-600">
                    Zero probability metrics registered for subscriptions on this day matrix.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative ml-2 space-y-3 border-l border-white/[0.06] py-1 pl-4 sm:ml-3 sm:pl-5">
                {dayTimeline.map(({ key, label, events }) => (
                  <div key={key} className="group relative">
                    <div className="absolute -left-[21px] top-5 h-2 w-2 rotate-45 border border-neutral-700 bg-[#09090a] transition-all group-hover:border-[#ff4655] group-hover:bg-[#ff4655] group-hover:shadow-[0_0_10px_rgba(255,70,85,0.45)] sm:-left-[22px]" />

                    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0c0d10]/80 p-3.5 transition-all hover:border-white/[0.11] sm:p-4">
                      <div className="absolute left-0 top-0 h-8 w-px bg-neutral-800 transition-colors group-hover:bg-[#ff4655]" />

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                        <div className="shrink-0 pt-0.5 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-neutral-400 sm:min-w-[76px]">
                          {label}
                        </div>

                        <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                          {events.map(({ streamer, probability, confidence }) => (
                            <div
                              key={streamer.streamer_id}
                              className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.05] bg-black/30 p-2.5 transition-colors hover:border-white/[0.10]"
                            >
                              <img
                                src={streamer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                                alt=""
                                className="h-9 w-9 shrink-0 rounded-full border border-white/[0.08] object-cover"
                                referrerPolicy="no-referrer"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" }}
                              />

                              <div className="min-w-0 flex-1">
                                <div className="truncate font-display text-xs font-bold uppercase tracking-wide text-white">
                                  {streamer.channel_name}
                                </div>
                                <div className="mt-1 flex items-center gap-2 font-mono text-[8px]">
                                  <span className={
                                    probability > 75
                                      ? 'font-bold text-emerald-400'
                                      : probability > 45
                                        ? 'text-amber-400'
                                        : 'text-neutral-600'
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
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Radar panel */}
          <div className="lg:sticky lg:top-20 lg:col-span-1">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#09090a] p-4 shadow-2xl shadow-black/20 sm:p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/45 to-transparent" />

              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#ff4655]/70">
                    <span className="h-1.5 w-1.5 rotate-45 bg-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.6)]" />
                    Probability System
                  </div>
                  <h2 className="mt-1 font-display text-sm font-black uppercase tracking-wide text-white">
                    Live Probability Radar
                  </h2>
                </div>

                <span className="rounded-lg border border-[#ff4655]/15 bg-[#ff4655]/[0.04] px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-[#ff4655]">
                  TOP 5
                </span>
              </div>

              {isLoading ? (
                <div className="mt-4 h-48 w-full animate-pulse rounded-2xl border border-white/[0.05] bg-black/30" />
              ) : radarPerformers.length === 0 ? (
                <div className="py-14 text-center font-mono text-[9px] uppercase leading-5 tracking-[0.16em] text-neutral-600">
                  // RADAR IDLE
                  <br />
                  Waiting for data ingests
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {radarPerformers.map(({ streamer, avgWeight }) => (
                    <div
                      key={`radar-item-${streamer.streamer_id}`}
                      className="group rounded-2xl border border-white/[0.05] bg-black/25 p-3 transition-colors hover:border-white/[0.10]"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="truncate font-display text-[11px] font-bold uppercase tracking-wide text-neutral-300 transition-colors group-hover:text-white">
                          {streamer.channel_name}
                        </span>
                        <span className="shrink-0 font-mono text-xs font-black text-[#ff4655]">
                          {avgWeight}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full border border-white/[0.05] bg-black p-px">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#ff4655]/30 to-[#ff4655] shadow-[0_0_8px_rgba(255,70,85,0.35)] transition-all duration-500"
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
      </div>
    </MainLayout>
  )
}

function RadarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4V2M20 12h2M12 20v2M4 12H2" />
      <path d="M12 12l5-5" />
    </svg>
  )
}
