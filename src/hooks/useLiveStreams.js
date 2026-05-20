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
      const { data: rows, error: dbError } = await supabase
        .from('streamers')
        .select(`
          id, platform, youtube_channel_id, kick_username,
          streamer_data!inner ( channel_name, avatar, is_live, title, thumbnail, viewer_count, stream_url )
        `)
        .eq('enabled', true)
        .eq('streamer_data.is_live', true) // Only fetch live streamers!

      if (dbError) throw dbError

      const formatted = (rows || []).map((s) => {
        const info = Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data
        const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username
        
        return {
          dbId: s.id,
          platform: s.platform,
          channelId: channelId,
          isLive: true,
          title: info.title,
          thumbnail: info.thumbnail,
          viewerCount: info.viewer_count,
          streamUrl: info.stream_url,
          channelName: info.channel_name,
          avatar: info.avatar,
          channelUrl: s.platform === 'youtube' ? `https://www.youtube.com/channel/${channelId}` : `https://kick.com/${channelId}`
        }
      })

      // Sort by viewers
      formatted.sort((a, b) => (b.viewerCount || 0) - (a.viewerCount || 0))
      
      setStreams(formatted)
      setLastRefreshed(new Date())

    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load streams')
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
