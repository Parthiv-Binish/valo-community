'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEnabledStreamers } from '../services/streamerService'
import { getYouTubeLiveStream } from '../services/youtubeService'
import { getKickLiveStream } from '../services/kickService'

const REFRESH_INTERVAL = 60_000 // 60 seconds

export function useLiveStreams() {
  const [streams, setStreams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      // 1. Load streamers from Supabase (only ids/usernames — no live data stored)
      const streamers = await getEnabledStreamers()
      if (!streamers || streamers.length === 0) {
        setStreams([])
        setIsLoading(false)
        setLastRefreshed(new Date())
        return
      }

      // 2. Fetch live status from APIs in parallel
      const promises = streamers.map(async (s: any) => {
        try {
          if (s.platform === 'youtube' && s.youtube_channel_id) {
            const live = await getYouTubeLiveStream(s.youtube_channel_id)
            if (!live) return null
            return { ...live, dbId: s.id }
          }

          if (s.platform === 'kick' && s.kick_username) {
            const live = await getKickLiveStream(s.kick_username)
            if (!live) return null
            return { ...live, dbId: s.id }
          }
        } catch {
          return null
        }
        return null
      })

      const results = await Promise.allSettled(promises)
      const live = results
        .filter((r) => r.status === 'fulfilled' && r.value !== null)
        .map((r: any) => r.value)

      setStreams(live)
      setLastRefreshed(new Date())
    } catch (err) {
      setError((err as Error).message || 'Failed to load streams')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Auto-refresh every 60s
  useEffect(() => {
    const id = setInterval(fetchAll, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchAll])

  return { streams, isLoading, error, refresh: fetchAll, lastRefreshed }
}
