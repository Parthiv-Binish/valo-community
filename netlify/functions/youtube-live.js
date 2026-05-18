/**
 * Netlify Function: youtube-live
 * ─────────────────────────────────────────────────────────────────────────────
 * Checks whether a YouTube channel is currently live — server-side,
 * so CORS is never an issue.
 *
 * Endpoint:  GET /.netlify/functions/youtube-live?channelId=CHANNEL_ID
 *
 * ── Live check strategy ───────────────────────────────────────────────────
 *
 *   PRIMARY (0 quota):
 *     Fetch https://www.youtube.com/channel/CHANNEL_ID/live with redirect:follow
 *     • Final URL contains /watch?v=VIDEO_ID  →  LIVE
 *     • Final URL stays on /live              →  OFFLINE
 *
 *   FALLBACK (costs quota — only on primary ERROR):
 *     YouTube Data API v3 search
 *     Used ONLY when the primary fetch throws (network error, timeout, etc.)
 *     Never called just because a channel is offline.
 *
 * ── Metadata (0 quota, no API key) ────────────────────────────────────────
 *   oEmbed: youtube.com/oembed?url=...&format=json
 *   Used to fetch title, channel name, and thumbnail after live detection.
 *
 * ── Environment variables ─────────────────────────────────────────────────
 *   YOUTUBE_API_KEY   — set in Netlify dashboard, never exposed to frontend
 *
 * ── Response shape ────────────────────────────────────────────────────────
 *   {
 *     success:    true | false
 *     isLive:     true | false
 *     method:     "redirect" | "api_fallback" | "offline" | "error"
 *     videoId:    string | null
 *     streamUrl:  string | null
 *     channelUrl: string
 *     title:      string | null
 *     thumbnail:  string | null
 *     channelName: string | null
 *     error:      string | null   (only when success: false)
 *   }
 */

const TIMEOUT_MS     = 10_000
const YT_OEMBED_BASE = 'https://www.youtube.com/oembed'
const YT_API_BASE    = 'https://www.googleapis.com/youtube/v3/search'

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
    ),
  ])
}

function extractVideoId(url) {
  try {
    const u = new URL(url)
    if (u.searchParams.has('v')) return u.searchParams.get('v')
    const parts = u.pathname.split('/').filter(Boolean)
    const shortsIdx = parts.indexOf('shorts')
    if (shortsIdx !== -1) return parts[shortsIdx + 1]
    if (u.hostname === 'youtu.be') return parts[0]
  } catch { /* ignore */ }
  return null
}

function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
    body: JSON.stringify(body),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMARY — zero quota redirect check
// ─────────────────────────────────────────────────────────────────────────────

async function checkLiveViaRedirect(channelId) {
  const liveUrl = `https://www.youtube.com/channel/${channelId}/live`

  console.log(`[youtube-live] PRIMARY: fetching ${liveUrl}`)

  const res = await withTimeout(
    fetch(liveUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        // Mimic a real browser to avoid bot detection
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
  )

  const finalUrl = res.url || liveUrl
  console.log(`[youtube-live] PRIMARY: final URL = ${finalUrl}`)
  console.log(`[youtube-live] PRIMARY: status = ${res.status}`)

  const isWatch = finalUrl.includes('/watch') || finalUrl.includes('youtu.be/')
  const videoId = isWatch ? extractVideoId(finalUrl) : null

  console.log(`[youtube-live] PRIMARY: isWatch=${isWatch} videoId=${videoId}`)

  return { isLive: isWatch && !!videoId, videoId, finalUrl }
}

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK — YouTube Data API v3 (only on primary error)
// ─────────────────────────────────────────────────────────────────────────────

async function checkLiveViaAPI(channelId) {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.error('[youtube-live] FALLBACK: YOUTUBE_API_KEY env var not set')
    throw new Error('YouTube API key not configured on server')
  }

  const url = new URL(YT_API_BASE)
  url.searchParams.set('part', 'snippet')
  url.searchParams.set('channelId', channelId)
  url.searchParams.set('eventType', 'live')
  url.searchParams.set('type', 'video')
  url.searchParams.set('key', apiKey)

  console.log(`[youtube-live] FALLBACK: calling YouTube API for ${channelId}`)

  const res = await withTimeout(fetch(url.toString()))

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error(`[youtube-live] FALLBACK: API returned ${res.status} — ${body}`)
    throw new Error(`YouTube API error: ${res.status}`)
  }

  const data = await res.json()
  console.log(`[youtube-live] FALLBACK: API returned ${data.items?.length ?? 0} item(s)`)

  if (!data.items || data.items.length === 0) {
    return { isLive: false, videoId: null, snippet: null }
  }

  const item = data.items[0]
  console.log(`[youtube-live] FALLBACK: live video found → ${item.id.videoId}`)

  return {
    isLive:  true,
    videoId: item.id.videoId,
    snippet: item.snippet,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// oEmbed metadata fetch — zero quota, no API key
// ─────────────────────────────────────────────────────────────────────────────

async function fetchOEmbed(youtubeUrl) {
  try {
    const url = new URL(YT_OEMBED_BASE)
    url.searchParams.set('url', youtubeUrl)
    url.searchParams.set('format', 'json')

    console.log(`[youtube-live] oEmbed: fetching metadata for ${youtubeUrl}`)

    const res = await withTimeout(fetch(url.toString()))
    if (!res.ok) {
      console.warn(`[youtube-live] oEmbed: returned ${res.status} for ${youtubeUrl}`)
      return null
    }

    const data = await res.json()
    console.log(`[youtube-live] oEmbed: got title="${data.title}" author="${data.author_name}"`)
    return data
  } catch (err) {
    console.warn(`[youtube-live] oEmbed: failed — ${err.message}`)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main handler
// ─────────────────────────────────────────────────────────────────────────────

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return jsonResponse(405, { success: false, error: 'Method not allowed' })
  }

  const channelId = event.queryStringParameters?.channelId?.trim()

  if (!channelId) {
    console.error('[youtube-live] Missing channelId parameter')
    return jsonResponse(400, { success: false, error: 'channelId is required' })
  }

  console.log(`\n[youtube-live] ━━━ Checking channel: ${channelId} ━━━`)

  const channelUrl = `https://www.youtube.com/channel/${channelId}`
  let videoId      = null
  let method       = 'offline'
  let apiSnippet   = null

  // ── Step 1: Primary redirect check (0 quota) ──────────────────────────────
  try {
    const result = await checkLiveViaRedirect(channelId)

    if (!result.isLive) {
      // Definitively offline — do NOT call API
      console.log(`[youtube-live] RESULT: ${channelId} is OFFLINE (redirect stayed on /live)`)
      return jsonResponse(200, {
        success:     true,
        isLive:      false,
        method:      'offline',
        videoId:     null,
        streamUrl:   null,
        channelUrl,
        title:       null,
        thumbnail:   null,
        channelName: null,
        error:       null,
      })
    }

    videoId = result.videoId
    method  = 'redirect'
    console.log(`[youtube-live] PRIMARY SUCCESS: ${channelId} is LIVE → videoId=${videoId}`)

  } catch (primaryErr) {
    // ── Step 2: Primary failed — use API fallback ──────────────────────────
    console.warn(`[youtube-live] PRIMARY FAILED: ${primaryErr.message}`)
    console.log(`[youtube-live] Switching to API fallback for ${channelId}...`)

    try {
      const fallback = await checkLiveViaAPI(channelId)

      if (!fallback.isLive) {
        console.log(`[youtube-live] FALLBACK RESULT: ${channelId} is OFFLINE`)
        return jsonResponse(200, {
          success:     true,
          isLive:      false,
          method:      'offline',
          videoId:     null,
          streamUrl:   null,
          channelUrl,
          title:       null,
          thumbnail:   null,
          channelName: null,
          error:       null,
        })
      }

      videoId    = fallback.videoId
      apiSnippet = fallback.snippet
      method     = 'api_fallback'
      console.log(`[youtube-live] FALLBACK SUCCESS: ${channelId} is LIVE → videoId=${videoId}`)

    } catch (apiErr) {
      console.error(`[youtube-live] FALLBACK ALSO FAILED: ${apiErr.message}`)
      return jsonResponse(200, {
        success:     false,
        isLive:      false,
        method:      'error',
        videoId:     null,
        streamUrl:   null,
        channelUrl,
        title:       null,
        thumbnail:   null,
        channelName: null,
        error:       apiErr.message,
      })
    }
  }

  // ── Step 3: Fetch metadata via oEmbed (0 quota, no API key) ───────────────
  console.log(`[youtube-live] Fetching oEmbed metadata for video ${videoId}`)
  const oembed = await fetchOEmbed(`https://www.youtube.com/watch?v=${videoId}`)

  const title = oembed?.title
    || apiSnippet?.title
    || 'Live Stream'

  const channelName = oembed?.author_name
    || apiSnippet?.channelTitle
    || channelId

  const thumbnail = oembed?.thumbnail_url
    || apiSnippet?.thumbnails?.high?.url
    || apiSnippet?.thumbnails?.medium?.url
    || `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`

  const streamUrl = `https://www.youtube.com/watch?v=${videoId}`

  console.log(`[youtube-live] FINAL RESULT:`)
  console.log(`  channelId:   ${channelId}`)
  console.log(`  isLive:      true`)
  console.log(`  method:      ${method}`)
  console.log(`  videoId:     ${videoId}`)
  console.log(`  title:       ${title}`)
  console.log(`  channelName: ${channelName}`)
  console.log(`  thumbnail:   ${thumbnail}`)
  console.log(`  streamUrl:   ${streamUrl}`)

  return jsonResponse(200, {
    success:     true,
    isLive:      true,
    method,
    videoId,
    streamUrl,
    channelUrl,
    title,
    thumbnail,
    channelName,
    error:       null,
  })
}