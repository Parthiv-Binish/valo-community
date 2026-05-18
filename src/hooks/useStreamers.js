import { useState, useEffect, useCallback } from 'react'
import {
  getAllStreamers,
  addStreamer,
  updateStreamer,
  deleteStreamer,
  toggleStreamer,
} from '../services/streamerService'

export function useStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllStreamers()
      setStreamers(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const add = async (payload) => {
    const added = await addStreamer(payload)
    setStreamers((prev) => [added, ...prev])
    return added
  }

  const edit = async (id, updates) => {
    const updated = await updateStreamer(id, updates)
    setStreamers((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }

  const remove = async (id) => {
    await deleteStreamer(id)
    setStreamers((prev) => prev.filter((s) => s.id !== id))
  }

  const toggle = async (id, enabled) => {
    const updated = await toggleStreamer(id, enabled)
    setStreamers((prev) => prev.map((s) => (s.id === id ? updated : s)))
    return updated
  }

  return { streamers, isLoading, error, reload: load, add, edit, remove, toggle }
}
