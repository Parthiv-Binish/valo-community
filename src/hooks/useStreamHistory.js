import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

const PAGE_SIZE = 12

/**
 * Past stream history for one streamer.
 *
 * Reads stream_history_logs created by the Supabase stream-history trigger.
 * Works for both YouTube and Kick because history is keyed by streamer_id
 * and the stored stream_url identifies the original platform URL.
 */
export function useStreamHistory(streamerDbId, { pageSize = PAGE_SIZE } = {}) {
  const [streams, setStreams] = useState([])
  const [isLoading, setIsLoading] = useState(Boolean(streamerDbId))
  const [hasMore, setHasMore] = useState(false)

  const mountedRef = useRef(true)
  const offsetRef = useRef(0)
  const loadingRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetchPage = useCallback(async ({ reset = false } = {}) => {
    if (!streamerDbId || loadingRef.current) return

    loadingRef.current = true

    if (reset && mountedRef.current) {
      setIsLoading(true)
    }

    const offset = reset ? 0 : offsetRef.current

    try {
      const { data, error } = await supabase
        .from('stream_history_logs')
        .select(`
          id,
          streamer_id,
          title,
          thumbnail_url,
          stream_url,
          went_live_at,
          went_offline_at,
          duration_seconds,
          platform
        `)
        .eq('streamer_id', streamerDbId)
        .order('went_live_at', { ascending: false })
        .range(offset, offset + pageSize - 1)

      if (error) throw error

      const rows = Array.isArray(data) ? data : []
      const nextOffset = offset + rows.length

      if (mountedRef.current) {
        setStreams((current) => reset ? rows : [...current, ...rows])
        setHasMore(rows.length === pageSize)
        offsetRef.current = nextOffset
      }
    } catch (error) {
      console.error('Failed to load stream history:', error)

      if (mountedRef.current && reset) {
        setStreams([])
        setHasMore(false)
        offsetRef.current = 0
      }
    } finally {
      loadingRef.current = false

      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [streamerDbId, pageSize])

  // Load the first page whenever the streamer changes.
  useEffect(() => {
    offsetRef.current = 0
    setStreams([])
    setHasMore(false)

    if (!streamerDbId) {
      setIsLoading(false)
      return undefined
    }

    fetchPage({ reset: true })
  }, [streamerDbId, fetchPage])

  const loadMore = useCallback(() => {
    if (!hasMore || loadingRef.current) return
    fetchPage()
  }, [fetchPage, hasMore])

  return {
    streams,
    isLoading,
    hasMore,
    loadMore,
  }
}