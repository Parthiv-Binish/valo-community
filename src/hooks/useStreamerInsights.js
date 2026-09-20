import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { toLocalSlot, formatSlotLabel } from '../utils/timezone'

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * "Usually live" slots for one streamer, converted to the viewer's local time.
 * Reads the same stream_prediction_insights view as the Radar Forecast page
 * (rows are UTC day_of_week / hour_of_day). Never throws: on any error (view
 * missing, RLS, offline) it resolves to an empty list and the UI hides the section.
 */
export function useStreamerInsights(streamerDbId, { limit = 6 } = {}) {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(Boolean(streamerDbId))

  useEffect(() => {
    if (!streamerDbId) {
      setSlots([])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)

    ;(async () => {
      try {
        const { data, error } = await supabase
          .from('stream_prediction_insights')
          .select('day_of_week, hour_of_day, live_probability')
          .eq('streamer_id', streamerDbId)

        if (error || !Array.isArray(data)) throw error || new Error('no data')

        const offsetMinutes = -new Date().getTimezoneOffset()
        const parsed = data
          .map((row) => {
            const probability = parseFloat(row.live_probability)
            if (!(probability > 0)) return null
            const { day, minuteOfDay } = toLocalSlot(row.day_of_week, row.hour_of_day, offsetMinutes)
            return {
              day,
              minuteOfDay,
              probability: Math.round(probability),
              label: `${DAY_NAMES[day]} · ${formatSlotLabel(minuteOfDay)}`,
            }
          })
          .filter(Boolean)
          .sort((a, b) => b.probability - a.probability)
          .slice(0, limit)

        if (!cancelled) setSlots(parsed)
      } catch {
        if (!cancelled) setSlots([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [streamerDbId, limit])

  return { slots, loading }
}
