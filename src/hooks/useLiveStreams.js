import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
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

      // Get all active streamers to check status
      const { data: rows, error: dbError } = await supabase
        .from('streamers')
        .select(`
          id, platform, youtube_channel_id, kick_username,
          streamer_data ( channel_name, avatar, is_live, title, thumbnail, viewer_count, stream_url )
        `)
        .eq('enabled', true)

      if (dbError) throw dbError

      const checkTasks = (rows || []).map(async (s) => {
        const info = Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data || {}
        const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username

        // YouTube Live Status: Read straight from DB cache
        if (s.platform === 'youtube' && info.is_live) {
          return {
            dbId: s.id,
            platform: 'youtube',
            channelId: channelId,
            isLive: true,
            title: info.title,
            thumbnail: info.thumbnail,
            viewerCount: info.viewer_count,
            streamUrl: info.stream_url,
            channelName: info.channel_name,
            avatar: info.avatar,
            channelUrl: `https://www.youtube.com/channel/${channelId}`
          }
        }

        // Kick Live Status: Scrape client side over user browser network
        if (s.platform === 'kick' && s.kick_username) {
          try {
            const live = await getKickLiveStream(s.kick_username)
            if (live) {
              return {
                dbId: s.id,
                platform: 'kick',
                channelId: channelId,
                isLive: true,
                ...live
              }
            }
          } catch (e) {
            console.error(`Kick client live-check exception on ${s.kick_username}:`, e)
          }
        }

        return null // Streamer is offline
      })

      const results = await Promise.all(checkTasks)
      const activeStreams = results.filter((stream) => stream !== null)

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
