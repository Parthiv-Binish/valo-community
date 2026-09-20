import { supabase } from '../lib/supabase'

/**
 * Optional streamer language tagging.
 *
 * This feature is feature-detected: it only activates once you have added a
 * nullable `language` text column to `public.streamers` (see
 * supabase/optional-hardening.sql). Until then every function here is a no-op
 * and the UI hides all language controls, so deploying the frontend first is
 * safe.
 */

export const LANGUAGES = [
  'Malayalam',
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Kannada',
  'Other',
]

const CACHE_TTL_MS = 5 * 60 * 1000
let cache = null // { ts, map }
let unsupported = false

/**
 * Returns Map<streamerId, language|null>, or null when the column doesn't exist
 * (or the query fails). Never throws.
 */
export async function fetchLanguageMap({ force = false } = {}) {
  if (unsupported && !force) return null
  if (!force && cache && Date.now() - cache.ts < CACHE_TTL_MS) return cache.map

  try {
    const { data, error } = await supabase.from('streamers').select('id, language')
    if (error) {
      unsupported = true
      cache = null
      return null
    }
    unsupported = false
    const map = new Map((data || []).map((r) => [r.id, r.language || null]))
    cache = { ts: Date.now(), map }
    return map
  } catch {
    unsupported = true
    return null
  }
}

export function invalidateLanguageCache() {
  cache = null
}
