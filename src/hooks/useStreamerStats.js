import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useStreamerStats(streamerDbId) {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(Boolean(streamerDbId))

  const fetchStats = useCallback(async () => {
    if (!streamerDbId) {
      setStats(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from('streamer_history_stats')
        .select('*')
        .eq('streamer_id', streamerDbId)
        .maybeSingle()

      if (error) throw error

      setStats(data || null)
    } catch (error) {
      console.error('Failed to load streamer stats:', error)
      setStats(null)
    } finally {
      setIsLoading(false)
    }
  }, [streamerDbId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    isLoading,
    refresh: fetchStats,
  }
}