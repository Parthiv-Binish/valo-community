/**
 * YouTube Service (frontend)
 *
 * All YouTube live checks are done via the Vercel API route:
 *   /api/youtube-live?channelId=CHANNEL_ID
 *
 * This completely avoids browser CORS issues because the API route
 * runs server-side on Vercel and fetches YouTube directly.
 *
 * Channel info for offline cards uses YouTube oEmbed — still zero quota,
 * still no API key, and oEmbed is not blocked by CORS.
 */

const YT_OEMBED_BASE = 'https://www.youtube.com/oembed'
const TIMEOUT_MS = 15_000

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function withTimeout(promise: Promise<Response>, ms: number = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    ),
  ])
}

// ─────────────────────────────────────────────────────────────────────────────
// oEmbed — zero quota, no API key, not CORS-blocked
// Used for offline channel info on the All Streamers page
// ─────────────────────────────────────────────────────────────────────────────

async function fetchOEmbed(youtubeUrl: string) {
  try {
    const url = new URL(YT_OEMBED_BASE)
    url.searchParams.set('url', youtubeUrl)
    url.searchParams.set('format', 'json')

    const res = await withTimeout(fetch(url.toString()))
    if (!res.ok) return null

    return await res.json()
  } catch (err) {
    console.warn(`[YouTubeService] oEmbed failed for ${youtubeUrl}:`, (err as Error).message)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: getYouTubeLiveStream
//
// Calls /api/youtube-live — server-side, no CORS.
// Returns stream object if LIVE, null if offline or error.
// ─────────────────────────────────────────────────────────────────────────────

export async function getYouTubeLiveStream(channelId: string) {
  try {
    const url = new URL('/api/youtube-live', typeof window !== 'undefined' ? window.location.origin : '')
    url.searchParams.set('channelId', channelId)

    console.debug(`[YouTubeService] Calling Vercel API for ${channelId}`)

    const res = await withTimeout(fetch(url.toString()))

    if (!res.ok) {
      console.error(`[YouTubeService] API returned HTTP ${res.status} for ${channelId}`)
      return null
    }

    const data = await res.json()

    console.debug(`[YouTubeService] Response for ${channelId}:`, {
      isLive: data.isLive,
    })

    if (!data.isLive) return null

    return {
      platform: 'youtube',
      channelId,
      title: 'Live Stream',
      channelName: channelId,
      thumbnail: `https://i.ytimg.com/vi/${channelId}/maxresdefault.jpg`,
      streamUrl: `https://www.youtube.com/channel/${channelId}/live`,
      channelUrl: `https://www.youtube.com/channel/${channelId}`,
      viewerCount: null,
    }
  } catch (err) {
    console.error(`[YouTubeService] Failed to call Vercel API for ${channelId}:`, (err as Error).message)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC: getYouTubeChannelInfo
//
// Used by useAllStreamers for OFFLINE cards.
// Uses oEmbed directly from the browser — this IS allowed (no CORS block).
//
// Returns { name, avatar, channelUrl } or null.
// ─────────────────────────────────────────────────────────────────────────────

export async function getYouTubeChannelInfo(channelId: string) {
  const channelUrl = `https://www.youtube.com/channel/${channelId}`
  const oembed = await fetchOEmbed(channelUrl)

  if (!oembed) return null

  return {
    name: oembed.author_name || channelId,
    avatar: oembed.thumbnail_url || null,
    channelUrl,
  }
}
