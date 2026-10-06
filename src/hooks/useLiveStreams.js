import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
const REFRESH_INTERVAL = 60_000

export function useLiveStreams() {
  const [streams, setStreams] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      // Get all active streamers to check status
      const { data: rows, error: dbError } = await supabase
        .from('streamers')
        .select(`
          id, platform, youtube_channel_id, kick_username,
          streamer_data ( channel_name, avatar, is_live, title, thumbnail, viewer_count, stream_url, last_updated )
        `)
        .eq('enabled', true)

      if (dbError) throw dbError

      // streamer_data is maintained by the backend worker. Do not perform
      // platform scraping from the browser: that causes inconsistent state,
      // duplicate traffic, and lets clients disagree about what is live.
      const activeStreams = (rows || [])
        .map((s) => {
          const info = Array.isArray(s.streamer_data)
            ? s.streamer_data[0]
            : s.streamer_data || {}
          if (info.is_live !== true) return null
          const channelId = s.platform === 'youtube'
            ? s.youtube_channel_id
            : s.kick_username
          const channelUrl = s.platform === 'youtube'
            ? `https://www.youtube.com/channel/${channelId}`
            : `https://kick.com/${channelId}`
          return {
            dbId: s.id,
            platform: s.platform,
            channelId,
            isLive: true,
            title: info.title || null,
            thumbnail: info.thumbnail || null,
            viewerCount: info.viewer_count || 0,
            streamUrl: info.stream_url || channelUrl,
            channelName: info.channel_name || channelId,
            avatar: info.avatar || null,
            channelUrl,
            lastUpdated: info.last_updated || null
          }
        })
        .filter(Boolean)
      // Sort streams by highest viewer counts down
      activeStreams.sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))

      setStreams(activeStreams)
      setLastRefreshed(new Date())
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load live streams')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])
  useEffect(() => {
    const id = setInterval(fetchAll, REFRESH_INTERVAL)
    return () => clearInterval(id)
  }, [fetchAll])

  return { streams, isLoading, error, refresh: fetchAll, lastRefreshed }
}
