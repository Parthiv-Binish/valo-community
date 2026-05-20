

const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  'http://127.0.0.1:8000'

const TIMEOUT_MS = 15000

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function withTimeout(
  promise,
  ms = TIMEOUT_MS
) {
  return Promise.race([
    promise,

    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Request timed out after ${ms}ms`
            )
          ),
        ms
      )
    ),
  ])
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// Get all streamers with live/profile data
// ─────────────────────────────────────────────────────────────

export async function getAllStreamers() {

  try {

    const response = await withTimeout(
      fetch(`${API_BASE}/streamers`)
    )

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data = await response.json()

    return data.map((streamer) => ({

      id: streamer.id,

      platform:
        streamer.platform || 'youtube',

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

  } catch (error) {

    console.error(
      '[YouTubeService] getAllStreamers:',
      error
    )

    return []
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// Get all LIVE streamers
// ─────────────────────────────────────────────────────────────

export async function getAllLiveStreamers() {

  try {

    const response = await withTimeout(
      fetch(`${API_BASE}/all-live`)
    )

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data = await response.json()

    return data.map((streamer) => ({

      id: streamer.id,

      platform:
        streamer.platform || 'youtube',

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

  } catch (error) {

    console.error(
      '[YouTubeService] getAllLiveStreamers:',
      error
    )

    return []
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// Get single streamer live data
// ─────────────────────────────────────────────────────────────
export async function getYouTubeLiveStream(
  channelId
) {

  try {

    const response = await withTimeout(
      fetch(
        `${API_BASE}/yt-live/${channelId}`
      )
    )

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data =
      await response.json()

    if (!data.live) {
      return null
    }

    return {

      platform:
        'youtube',

      channelId,

      isLive:
        data.live,

      title:
        data.title ||
        'Live Stream',

      thumbnail:
        data.thumbnail ||
        null,

      viewerCount:
        data.viewer_count ||
        0,

      streamUrl:
        data.stream_url,

      // PROFILE INFO
      channelName:
        data.channel_name ||
        channelId,

      avatar:
        data.profile_image ||
        null,

      verified:
        data.verified ||
        false,

      channelUrl:
        data.channel_url ||
        `https://youtube.com/channel/${channelId}`,
    }

  } catch (error) {

    console.error(
      '[YouTubeService] getYouTubeLiveStream:',
      error
    )

    return null
  }
}


// ─────────────────────────────────────────────────────────────
// PUBLIC
// Get streamer profile
// ─────────────────────────────────────────────────────────────

export async function getYouTubeChannelInfo(
  channelId
) {

  try {

    const response = await withTimeout(
      fetch(
        `${API_BASE}/yt-profile/${channelId}`
      )
    )

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const data = await response.json()

    return {
      name:
        data.channel_name || channelId,

      avatar:
        data.profile_image || null,

      subscribers:
        data.subscriber_count || null,

      verified:
        data.verified || false,

      channelUrl:
        data.channel_url,
    }

  } catch (error) {

    console.error(
      '[YouTubeService] getYouTubeChannelInfo:',
      error
    )

    return null
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC
// Refresh backend cache
// ─────────────────────────────────────────────────────────────

export async function refreshLiveCache() {

  try {

    const response = await withTimeout(
      fetch(`${API_BASE}/refresh-live`)
    )

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    return await response.json()

  } catch (error) {

    console.error(
      '[YouTubeService] refreshLiveCache:',
      error
    )

    return null
  }
}
