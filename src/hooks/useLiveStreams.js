import { useState, useEffect, useCallback } from 'react'
import { getEnabledStreamers } from '../services/streamerService'
import { getYouTubeLiveStream } from '../services/youtubeService'
import { getKickLiveStream } from '../services/kickService'

const REFRESH_INTERVAL = 60_000

export function useLiveStreams() {
  const [streams, setStreams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      const streamers = await getEnabledStreamers()
      if (!streamers || streamers.length === 0) {
        setStreams([])
        setIsLoading(false)
        setLastRefreshed(new Date())
        return
      }

      const promises = streamers.map(async (s) => {
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
        .map((r) => r.value)

      setStreams(live)
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err.message || 'Failed to load streams')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    const id = setInterval(fetchAll, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchAll])

  return { streams, isLoading, error, refresh: fetchAll, lastRefreshed }
}
