import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'

const REFRESH_INTERVAL = 60_000 // 1 minute

export function useAllStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      // Fetch base table and join the new streamer_data table
      const { data: rows, error: dbError } = await supabase
        .from('streamers')
        .select(`
          id,
          platform,
          youtube_channel_id,
          kick_username,
          streamer_data (
            channel_name,
            avatar,
            is_live,
            title,
            thumbnail,
            viewer_count,
            stream_url
          )
        `)
        .eq('enabled', true)

      if (dbError) throw dbError

      if (!rows || rows.length === 0) {
        setStreamers([])
        setLastRefreshed(new Date())
        return
      }

      // Format data for StreamCard.jsx
      const formatted = rows.map((s) => {
        // Handle Supabase 1-to-1 join response (could be array or object)
        const info = Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data || {}
        const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username

        return {
          dbId: s.id,
          platform: s.platform,
          channelId: channelId,
          isLive: info.is_live || false,
          title: info.title || null,
          thumbnail: info.thumbnail || null,
          viewerCount: info.viewer_count || 0,
          streamUrl: info.stream_url || null,
          channelName: info.channel_name || channelId,
          avatar: info.avatar || null,
          verified: false, // add to DB later if needed
          channelUrl: s.platform === 'youtube' 
            ? `https://www.youtube.com/channel/${channelId}` 
            : `https://kick.com/${channelId}`
        }
      })

      // Sort: Live first -> High viewers -> Alphabetical
      const sorted = formatted.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1
        if (!a.isLive && b.isLive) return 1
        if (a.isLive && b.isLive) return (b.viewerCount || 0) - (a.viewerCount || 0)
        return (a.channelName || '').localeCompare(b.channelName || '')
      })

      setStreamers(sorted)
      setLastRefreshed(new Date())

    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to load streamers')
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

  return { streamers, isLoading, error, refresh: fetchAll, lastRefreshed }
}
