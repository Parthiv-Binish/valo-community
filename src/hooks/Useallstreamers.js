
import { useState, useEffect, useCallback } from 'react'

import { getEnabledStreamers }
  from '../services/streamerService'

import {
  getYouTubeLiveStream,
  getYouTubeChannelInfo
} from '../services/youtubeService'

import {
  getKickLiveStream,
  getKickChannelInfo
} from '../services/kickService'

const REFRESH_INTERVAL = 60_000

/**
 * ALL streamers
 * - live + offline
 * - youtube + kick
 */

export function useAllStreamers() {

  const [streamers, setStreamers] =
    useState([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState(null)

  const [lastRefreshed, setLastRefreshed] =
    useState(null)

  const fetchAll = useCallback(async () => {

    try {

      setError(null)

      const rows =
        await getEnabledStreamers()

      if (!rows || rows.length === 0) {

        setStreamers([])

        setIsLoading(false)

        setLastRefreshed(new Date())

        return
      }

      // =====================================================
      // ENRICH STREAMERS
      // =====================================================

      const enriched = await Promise.all(

        rows.map(async (s) => {

          const base = {

            dbId:
              s.id,

            platform:
              s.platform,

            enabled:
              s.enabled,

            isLive:
              false,

            verified:
              false,

            viewerCount:
              null,

            thumbnail:
              null,

            title:
              null,

            streamUrl:
              null,
          }

          try {

            // =================================================
            // YOUTUBE
            // =================================================

            if (
              s.platform === 'youtube' &&
              s.youtube_channel_id
            ) {

              const channelId =
                s.youtube_channel_id

              // live first
              const live =
                await getYouTubeLiveStream(
                  channelId
                )

              if (live) {

                return {

                  ...base,

                  ...live,

                  platform:
                    'youtube',

                  channelId,

                  isLive:
                    true,
                }
              }

              // offline profile
              const info =
                await getYouTubeChannelInfo(
                  channelId
                )

              return {

                ...base,

                platform:
                  'youtube',

                channelId,

                channelName:
                  info?.name ||
                  channelId,

                avatar:
                  info?.avatar ||
                  null,

                verified:
                  info?.verified ||
                  false,

                channelUrl:
                  info?.channelUrl ||
                  `https://www.youtube.com/channel/${channelId}`,
              }
            }

            // =================================================
            // KICK
            // =================================================

            if (
              s.platform === 'kick' &&
              s.kick_username
            ) {

              const username =
                s.kick_username

              // live first
              const live =
                await getKickLiveStream(
                  username
                )

              if (live) {

                return {

                  ...base,

                  ...live,

                  platform:
                    'kick',

                  channelId:
                    username,

                  isLive:
                    true,
                }
              }

              // offline profile
              const info =
                await getKickChannelInfo(
                  username
                )

              return {

                ...base,

                platform:
                  'kick',

                channelId:
                  username,

                channelName:
                  info?.channelName ||
                  username,

                avatar:
                  info?.avatar ||
                  null,

                verified:
                  info?.verified ||
                  false,

                channelUrl:
                  info?.channelUrl ||
                  `https://kick.com/${username}`,
              }
            }

          } catch (err) {

            console.error(
              `[useAllStreamers] ${s.id}:`,
              err.message
            )
          }

          return base
        })
      )

      // =====================================================
      // SORT
      // =====================================================

      const sorted =
        [...enriched].sort((a, b) => {

          // live first
          if (a.isLive && !b.isLive)
            return -1

          if (!a.isLive && b.isLive)
            return 1

          // viewers desc
          if (a.isLive && b.isLive) {

            return (
              (b.viewerCount || 0) -
              (a.viewerCount || 0)
            )
          }

          // alphabetical
          return (
            (a.channelName || '')
              .localeCompare(
                b.channelName || ''
              )
          )
        })

      setStreamers(sorted)

      setLastRefreshed(new Date())

    } catch (err) {

      console.error(err)

      setError(
        err.message ||
        'Failed to load streamers'
      )

    } finally {

      setIsLoading(false)
    }

  }, [])

  // =====================================================
  // INITIAL
  // =====================================================

  useEffect(() => {

    fetchAll()

  }, [fetchAll])

  // =====================================================
  // AUTO REFRESH
  // =====================================================

  useEffect(() => {

    const id = setInterval(
      fetchAll,
      REFRESH_INTERVAL
    )

    return () => clearInterval(id)

  }, [fetchAll])

  return {

    streamers,

    isLoading,

    error,

    refresh: fetchAll,

    lastRefreshed
  }
}
