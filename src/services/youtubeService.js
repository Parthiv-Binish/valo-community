/**
 * YouTube Service (frontend)
 *
 * All YouTube live checks are done via the Netlify function:
 *   /.netlify/functions/youtube-live?channelId=CHANNEL_ID
 *
 * This completely avoids browser CORS issues because the Netlify function
 * runs server-side and fetches YouTube directly.
 *
 * Channel info for offline cards uses YouTube oEmbed — still zero quota,
 * still no API key, and oEmbed is not blocked by CORS.
 */

const YT_OEMBED_BASE = 'https://www.youtube.com/oembed'
const TIMEOUT_MS = 15_000

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    ),
  ])
}

async function fetchOEmbed(youtubeUrl) {
  try {
    const url = new URL(YT_OEMBED_BASE)
    url.searchParams.set('url', youtubeUrl)
    url.searchParams.set('format', 'json')

    const res = await withTimeout(fetch(url.toString()))
    if (!res.ok) return null

    return await res.json()
  } catch (err) {
    console.warn(`[YouTubeService] oEmbed failed for ${youtubeUrl}:`, err.message)
    return null
  }
}

export async function getYouTubeLiveStream(channelId) {
  try {
    const url = new URL('/.netlify/functions/youtube-live', window.location.origin)
    url.searchParams.set('channelId', channelId)

    console.debug(`[YouTubeService] Calling Netlify function for ${channelId}`)

    const res = await withTimeout(fetch(url.toString()))

    if (!res.ok) {
      console.error(`[YouTubeService] Function returned HTTP ${res.status} for ${channelId}`)
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
    console.error(`[YouTubeService] Failed to call Netlify function for ${channelId}:`, err.message)
    return null
  }
}

export async function getYouTubeChannelInfo(channelId) {
  const channelUrl = `https://www.youtube.com/channel/${channelId}`
  const oembed = await fetchOEmbed(channelUrl)

  if (!oembed) return null

  return {
    name: oembed.author_name || channelId,
    avatar: oembed.thumbnail_url || null,
    channelUrl,
  }
}
