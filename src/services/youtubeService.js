// src/services/youtubeService.js

const INSTANCES = [
  import.meta.env.VITE_BACKEND_URL_PRIMARY,
  import.meta.env.VITE_BACKEND_URL_BACKUP
].filter(Boolean)

// Local development fallback if primary/backup variables aren't defined
if (INSTANCES.length === 0) {
  INSTANCES.push(import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000')
}

let activeServerIndex = 0
const TIMEOUT_MS = 45000

// ─────────────────────────────────────────────────────────────
// Failover Control Engine
// ─────────────────────────────────────────────────────────────

function getApiBase() {
  return INSTANCES[activeServerIndex]
}

function switchInstance() {
  if (INSTANCES.length < 2) return
  const oldIndex = activeServerIndex
  activeServerIndex = activeServerIndex === 0 ? 1 : 0
  console.warn(`[Failover] Swapped routing target from Node ${oldIndex + 1} to Node ${activeServerIndex + 1} (${INSTANCES[activeServerIndex]})`)
}

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timed out after ${ms}ms`)),
        ms
      )
    ),
  ])
}

async function fetchWithFailover(endpoint, init = {}) {
  try {
    const response = await withTimeout(fetch(`${getApiBase()}${endpoint}`, init))
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response
  } catch (error) {
    console.warn(`[Failover] Request to ${getApiBase()}${endpoint} failed:`, error.message)
    
    // Attempt cluster swap
    switchInstance()
    
    try {
      console.log(`[Failover] Retrying request on backup instance: ${getApiBase()}${endpoint}`)
      const backupResponse = await withTimeout(fetch(`${getApiBase()}${endpoint}`, init))
      if (!backupResponse.ok) throw new Error(`HTTP ${backupResponse.status}`)
      return backupResponse
    } catch (criticalError) {
      console.error('[Failover] Critical operational failure: Both backend clusters are unreachable.')
      throw criticalError
    }
  }
}

// ─────────────────────────────────────────────────────────────
// PUBLIC FUNCTIONS
// ─────────────────────────────────────────────────────────────

export async function getAllStreamers() {
  try {
    const response = await fetchWithFailover('/streamers')
    const data = await response.json()

    return data.map((streamer) => ({
      id: streamer.id,
      platform: streamer.platform || 'youtube',
      channelId: streamer.channelId,
      isLive: streamer.isLive || false,
      title: streamer.title || null,
      thumbnail: streamer.thumbnail || null,
      viewerCount: streamer.viewerCount || null,
      streamUrl: streamer.streamUrl || null,
      channelName: streamer.channelName || 'Unknown Streamer',
      avatar: streamer.avatar || null,
      verified: streamer.verified || false,
      channelUrl: streamer.channelUrl || null,
    }))
  } catch (error) {
    console.error('[YouTubeService] getAllStreamers failed completely:', error)
    return []
  }
}

export async function getAllLiveStreamers() {
  try {
    const response = await fetchWithFailover('/all-live')
    const data = await response.json()

    return data.map((streamer) => ({
      id: streamer.id,
      platform: streamer.platform || 'youtube',
      channelId: streamer.channelId,
      isLive: streamer.isLive || false,
      title: streamer.title || null,
      thumbnail: streamer.thumbnail || null,
      viewerCount: streamer.viewerCount || null,
      streamUrl: streamer.streamUrl || null,
      channelName: streamer.channelName || 'Unknown Streamer',
      avatar: streamer.avatar || null,
      verified: streamer.verified || false,
      channelUrl: streamer.channelUrl || null,
    }))
  } catch (error) {
    console.error('[YouTubeService] getAllLiveStreamers failed completely:', error)
    return []
  }
}

export async function getYouTubeLiveStream(channelId) {
  try {
    const response = await fetchWithFailover(`/yt-live/${channelId}`)
    const data = await response.json()

    if (!data.live) return null

    return {
      platform: 'youtube',
      channelId,
      isLive: data.live,
      title: data.title || 'Live Stream',
      thumbnail: data.thumbnail || null,
      viewerCount: data.viewer_count || 0,
      streamUrl: data.stream_url,
      channelName: data.channel_name || channelId,
      avatar: data.profile_image || null,
      verified: data.verified || false,
      channelUrl: data.channel_url || `https://youtube.com/channel/${channelId}`,
    }
  } catch (error) {
    console.error('[YouTubeService] getYouTubeLiveStream failed completely:', error)
    return null
  }
}

export async function getYouTubeChannelInfo(channelId) {
  try {
    const response = await fetchWithFailover(`/yt-profile/${channelId}`)
    const data = await response.json()

    return {
      name: data.channel_name || channelId,
      avatar: data.profile_image || null,
      subscribers: data.subscriber_count || null,
      verified: data.verified || false,
      channelUrl: data.channel_url,
    }
  } catch (error) {
    console.error('[YouTubeService] getYouTubeChannelInfo failed completely:', error)
    return null
  }
}

export async function refreshLiveCache() {
  try {
    const response = await fetchWithFailover('/refresh-live')
    return await response.json()
  } catch (error) {
    console.error('[YouTubeService] refreshLiveCache failed completely:', error)
    return null
  }
}
