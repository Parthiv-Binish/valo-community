
import { useState, useEffect, useCallback } from 'react'

import { getKickLiveStream }
  from '../services/kickService'

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000'

const REFRESH_INTERVAL = 60_000

export function useLiveStreams() {

  const [streams, setStreams] =
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

      // =====================================================
      // YOUTUBE LIVE STREAMS
      // =====================================================

      const response = await fetch(
        `${API_BASE}/all-live`
      )

      if (!response.ok) {

        throw new Error(
          `HTTP ${response.status}`
        )
      }

      const data =
        await response.json()

      const youtubeStreams =
        data
          .filter(
            (s) =>
              s.platform === 'youtube'
          )
          .map((streamer) => ({

            id: streamer.id,

            platform:
              streamer.platform ||
              'youtube',

            channelId:
              streamer.channelId,

            isLive:
              streamer.isLive || false,

            title:
              streamer.title || null,

            thumbnail:
              streamer.thumbnail || null,

            viewerCount:
              streamer.viewerCount || null,

            streamUrl:
              streamer.streamUrl || null,

            channelName:
              streamer.channelName ||
              'Unknown Streamer',

            avatar:
              streamer.avatar || null,

            verified:
              streamer.verified || false,

            channelUrl:
              streamer.channelUrl || null,
          }))

      // =====================================================
      // GET KICK USERNAMES FROM DB
      // =====================================================

      const dbResponse = await fetch(
        `${API_BASE}/streamers`
      )

      if (!dbResponse.ok) {

        throw new Error(
          `HTTP ${dbResponse.status}`
        )
      }

      const dbStreamers =
        await dbResponse.json()

      const kickStreamers =
        dbStreamers.filter(
          (s) =>
            s.platform === 'kick' &&
            s.kick_username
        )

      // =====================================================
      // FETCH KICK LIVE STREAMS
      // =====================================================

      const kickPromises =
        kickStreamers.map((s) =>
          getKickLiveStream(
            s.kick_username
          )
        )

      const kickResults =
        await Promise.allSettled(
          kickPromises
        )

      const kickStreams =
        kickResults
          .filter(
            (r) =>
              r.status === 'fulfilled' &&
              r.value !== null
          )
          .map((r) => r.value)

      // =====================================================
      // COMBINE STREAMS
      // =====================================================

      setStreams([
        ...youtubeStreams,
        ...kickStreams
      ])

      setLastRefreshed(new Date())

    } catch (err) {

      console.error(err)

      setError(
        err.message ||
        'Failed to load streams'
      )

    } finally {

      setIsLoading(false)
    }

  }, [])

  // =====================================================
  // INITIAL FETCH
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

    streams,

    isLoading,

    error,

    refresh: fetchAll,

    lastRefreshed
  }
}
