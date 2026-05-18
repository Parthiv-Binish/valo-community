'use client'

import { useState, useEffect, useCallback } from 'react'
import { getEnabledStreamers } from '../services/streamerService'
import { getYouTubeLiveStream, getYouTubeChannelInfo } from '../services/youtubeService'
import { getKickLiveStream, getKickChannelInfo } from '../services/kickService'

const REFRESH_INTERVAL = 60_000

/**
 * Fetches ALL enabled streamers and enriches each with:
 *   - live status (isLive)
 *   - stream details if live (title, thumbnail, viewerCount, streamUrl)
 *   - channel info if offline (name, avatar, channelUrl)
 *
 * Returns a unified array sorted: live first, then offline alphabetically.
 */
export function useAllStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      setError(null)

      const rows = await getEnabledStreamers()

      if (!rows || rows.length === 0) {
        setStreamers([])
        setIsLoading(false)
        setLastRefreshed(new Date())
        return
      }

      // Enrich each streamer in parallel
      const enriched = await Promise.all(
        rows.map(async (s: any) => {
          const base = {
            dbId: s.id,
            platform: s.platform,
            enabled: s.enabled,
            isLive: false,
          }

          try {
            if (s.platform === 'youtube' && s.youtube_channel_id) {
              const channelId = s.youtube_channel_id

              // Try live check first
              const live = await getYouTubeLiveStream(channelId)

              if (live) {
                return {
                  ...base,
                  ...live,
                  isLive: true,
                }
              }

              // Offline — fetch channel info for the card
              const info = await getYouTubeChannelInfo(channelId)
              return {
                ...base,
                channelId,
                channelName: info?.name || channelId,
                avatar: info?.avatar || null,
                channelUrl: info?.channelUrl || `https://www.youtube.com/channel/${channelId}`,
                thumbnail: null,
                title: null,
                streamUrl: null,
                viewerCount: null,
              }
            }

            if (s.platform === 'kick' && s.kick_username) {
              const username = s.kick_username

              const live = await getKickLiveStream(username)

              if (live) {
                return {
                  ...base,
                  ...live,
                  isLive: true,
                }
              }

              // Offline — fetch channel info
              const info = await getKickChannelInfo(username)
              return {
                ...base,
                username,
                channelName: info?.name || username,
                avatar: info?.avatar || null,
                channelUrl: info?.channelUrl || `https://kick.com/${username}`,
                thumbnail: null,
                title: null,
                streamUrl: null,
                viewerCount: null,
              }
            }
          } catch (err) {
            console.error(`[useAllStreamers] Error enriching ${s.id}:`, (err as Error).message)
          }

          return base
        })
      )

      // Sort: live first (by viewer count desc), then offline alphabetically
      const sorted = [...enriched].sort((a, b) => {
        if (a.isLive && !b.isLive) return -1
        if (!a.isLive && b.isLive) return 1
        if (a.isLive && b.isLive) {
          return (b.viewerCount || 0) - (a.viewerCount || 0)
        }
        return (a.channelName || '').localeCompare(b.channelName || '')
      })

      setStreamers(sorted)
      setLastRefreshed(new Date())
    } catch (err) {
      setError((err as Error).message || 'Failed to load streamers')
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
