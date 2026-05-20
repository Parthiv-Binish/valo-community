import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'
import { getKickLiveStream, getKickChannelInfo } from '../services/kickService'

const REFRESH_INTERVAL = 60_000 

export function useAllStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      fetch('https://valo-community-backend.onrender.com/').catch(() => {});
      // Fetch the enabled streamers and join your background table
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
        setIsLoading(false)
        setLastRefreshed(new Date())
        return
      }

      // Enrich streamers (YouTube from DB, Kick directly from frontend API)
      const enriched = await Promise.all(
        rows.map(async (s) => {
          const info = Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data || {}
          const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username

          // Base structure required by StreamCard.jsx
          const base = {
            dbId: s.id,
            platform: s.platform,
            channelId: channelId,
            isLive: false,
            title: null,
            thumbnail: null,
            viewerCount: null,
            streamUrl: s.platform === 'youtube' 
              ? `https://www.youtube.com/channel/${channelId}` 
              : `https://kick.com/${channelId}`,
            channelName: info.channel_name || channelId,
            avatar: info.avatar || null,
            verified: false
          }

          // =================================================
          // YOUTUBE (Read directly from your stable DB cache)
          // =================================================
          if (s.platform === 'youtube') {
            return {
              ...base,
              isLive: info.is_live || false,
              title: info.title || null,
              thumbnail: info.thumbnail || null,
              viewerCount: info.viewer_count || 0,
              streamUrl: info.stream_url || base.streamUrl,
            }
          }

          // =================================================
          // KICK (Fetch directly from frontend client to bypass 403)
          // =================================================
          if (s.platform === 'kick' && s.kick_username) {
            try {
              const live = await getKickLiveStream(s.kick_username)
              if (live) {
                return {
                  ...base,
                  ...live,
                  isLive: true
                }
              }

              // Fallback to offline profile details
              const profileInfo = await getKickChannelInfo(s.kick_username)
              return {
                ...base,
                channelName: profileInfo?.channelName || s.kick_username,
                avatar: profileInfo?.avatar || base.avatar,
                verified: profileInfo?.verified || false
              }
            } catch (err) {
              console.error(`Kick frontend fetch error for ${s.kick_username}:`, err)
              return base
            }
          }

          return base
        })
      )

      // Sort: Live first -> High viewers desc -> Alphabetical
      const sorted = enriched.sort((a, b) => {
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
