import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { getKickLiveStream, getKickChannelInfo } from '../services/kickService'
import { fetchLanguageMap } from '../services/languageService'

const REFRESH_INTERVAL = 60_000
const REALTIME_DEBOUNCE_MS = 2500
const BACKEND_PING_INTERVAL = 5 * 60_000

// Keeps the Render web service from sleeping. Throttled at module level so that
// polling, Realtime events and page navigation don't each fire their own ping.
const BACKEND_PING_URL =
  import.meta.env.VITE_BACKEND_URL_PRIMARY ||
  'https://valo-community-backend.onrender.com/'
let lastBackendPing = 0
function pingBackend() {
  const now = Date.now()
  if (now - lastBackendPing < BACKEND_PING_INTERVAL) return
  lastBackendPing = now
  fetch(BACKEND_PING_URL).catch(() => {})
}

export function useAllStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const mountedRef = useRef(true)
  const inFlightRef = useRef(false)
  const queuedRef = useRef(false)
  const lastFetchAtRef = useRef(0)

  const fetchAll = useCallback(async () => {
    // Never run two sweeps at once; remember that another was requested.
    if (inFlightRef.current) {
      queuedRef.current = true
      return
    }
    inFlightRef.current = true

    try {
      setError(null)

      pingBackend()

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
        if (mountedRef.current) {
          setStreamers([])
          setIsLoading(false)
          setLastRefreshed(new Date())
        }
        return
      }

      // Optional language tags (null when the column doesn't exist yet).
      const languageMap = await fetchLanguageMap()

      const enriched = await Promise.all(
        rows.map(async (s) => {
          // A freshly added streamer has no scraped row yet: [] or null. Both must be safe.
          const info = (Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data) || {}
          const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username

          const fallbackChannelUrl = s.platform === 'youtube'
            ? `https://www.youtube.com/channel/${channelId}`
            : `https://kick.com/${channelId}`

          const base = {
            dbId: s.id,
            platform: s.platform,
            channelId: channelId,
            isLive: false,
            title: null,
            thumbnail: null,
            viewerCount: null,
            streamUrl: fallbackChannelUrl,
            channelUrl: fallbackChannelUrl,
            channelName: info.channel_name || channelId,
            avatar: info.avatar || null,
            verified: false,
            language: languageMap ? languageMap.get(s.id) || null : null
          }

          // =================================================
          // YOUTUBE
          // =================================================
          if (s.platform === 'youtube') {
            return {
              ...base,
              isLive: info.is_live || false,
              title: info.title || null,
              thumbnail: info.thumbnail || null,
              viewerCount: info.viewer_count || 0,
              streamUrl: info.stream_url || fallbackChannelUrl,
              channelUrl: fallbackChannelUrl
            }
          }

          // =================================================
          // KICK
          // =================================================
          if (s.platform === 'kick' && s.kick_username) {
            try {
              const live = await getKickLiveStream(s.kick_username)
              if (live) {
                return {
                  ...base,
                  ...live,
                  isLive: true,
                  streamUrl: `https://kick.com/${s.kick_username}`,
                  channelUrl: `https://kick.com/${s.kick_username}`
                }
              }

              const profileInfo = await getKickChannelInfo(s.kick_username)
              return {
                ...base,
                channelName: profileInfo?.channelName || s.kick_username,
                avatar: profileInfo?.avatar || base.avatar,
                verified: profileInfo?.verified || false,
                channelUrl: `https://kick.com/${s.kick_username}`
              }
            } catch (err) {
              console.error(`Kick frontend client connection catch: ${s.kick_username}:`, err)
              return base
            }
          }

          return base
        })
      )

      const sorted = enriched.sort((a, b) => {
        if (a.isLive && !b.isLive) return -1
        if (!a.isLive && b.isLive) return 1
        if (a.isLive && b.isLive) return (b.viewerCount || 0) - (a.viewerCount || 0)
        return (a.channelName || '').localeCompare(b.channelName || '')
      })

      if (mountedRef.current) {
        setStreamers(sorted)
        setLastRefreshed(new Date())
      }
      lastFetchAtRef.current = Date.now()
    } catch (err) {
      console.error(err)
      if (mountedRef.current) setError(err.message || 'Failed to load streamers')
    } finally {
      inFlightRef.current = false
      if (mountedRef.current) setIsLoading(false)

      // A refresh was requested while we were busy: run exactly one more.
      if (queuedRef.current && mountedRef.current) {
        queuedRef.current = false
        fetchAll()
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Initial Fetch
  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // Periodic Backup Polling – skipped while the tab is hidden.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') fetchAll()
    }, REFRESH_INTERVAL)

    // Catch up when the user comes back to a tab that was in the background.
    const onVisible = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastFetchAtRef.current > REFRESH_INTERVAL / 2
      ) {
        fetchAll()
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchAll])

  // =================================================
  // REALTIME SUBSCRIPTION LAYER
  // =================================================
  // Every streamer_data write used to trigger an immediate full refetch in every
  // open tab. Events are now coalesced: a burst of writes causes one refetch.
  useEffect(() => {
    let timer = null
    const scheduleRefetch = () => {
      if (timer) return
      timer = setTimeout(() => {
        timer = null
        if (document.visibilityState === 'visible') fetchAll()
      }, REALTIME_DEBOUNCE_MS)
    }

    const channel = supabase
      .channel(`schema-db-changes-${Math.random().toString(36).slice(2, 8)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'streamers' },
        scheduleRefetch
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'streamer_data' },
        scheduleRefetch
      )
      .subscribe()

    return () => {
      if (timer) clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [fetchAll])

  return { streamers, isLoading, error, refresh: fetchAll, lastRefreshed }
}
