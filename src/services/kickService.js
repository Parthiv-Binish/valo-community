/**
 * Kick API Proxy Service
 * Routes telemetry collection safely through the FastAPI background worker
 */

// 🔌 POINT THIS TO YOUR FASTAPI PRODUCTION WORKER DOMAIN
const FASTAPI_WORKER_BASE = 'https://valo-community-backend.onrender.com' 

const TIMEOUT_MS = 15000

// =====================================================
// TIMEOUT MANAGEMENT FALLBACK
// =====================================================
function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Proxy connection timed out')), ms)
    ),
  ])
}

// =====================================================
// LIVE STREAM NODE RESOLUTION
// =====================================================
export async function getKickLiveStream(username) {
  try {
    const cleanUser = String(username).trim().toLowerCase()
    
    // 📡 REDIRECT: Hit your FastAPI route which already pre-scrapes or proxy-calls Kick safely
    const response = await withTimeout(
      fetch(`${FASTAPI_WORKER_BASE}/proxy/kick/${encodeURIComponent(cleanUser)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
    )

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Proxy Node Error: Status ${response.status}`)
    }

    const data = await response.json()
    if (!data || !data.is_live) {
      return null // Graceful return if streamer is standby or offline
    }

    // Map your normalized FastAPI backend payload schema perfectly back to your frontend states
    return {
      id: cleanUser,
      platform: 'kick',
      channelId: cleanUser,
      username: cleanUser,
      isLive: true,
      title: data.title || 'Live Stream',
      thumbnail: data.thumbnail,
      viewerCount: data.viewer_count ?? 0,
      streamUrl: data.stream_url || `https://kick.com/${cleanUser}`,
      channelName: data.channel_name || username,
      avatar: data.avatar,
      verified: data.verified || false,
      channelUrl: f`https://kick.com/${cleanUser}`,
      startedAt: data.last_updated || null,
    }

  } catch (error) {
    console.error(`[Kick Frontend Proxy Bridge] Failed fallback for ${username}:`, error.message)
    return null
  }
}

// =====================================================
// CHANNEL INFO EXT FILE RESOLUTION
// =====================================================
export async function getKickChannelInfo(username) {
  try {
    const cleanUser = String(username).trim().toLowerCase()

    const response = await withTimeout(
      fetch(`${FASTAPI_WORKER_BASE}/proxy/kick/${encodeURIComponent(cleanUser)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
    )

    if (!response.ok) return null

    const data = await response.json()

    return {
      platform: 'kick',
      channelId: cleanUser,
      username: cleanUser,
      channelName: data.channel_name || username,
      avatar: data.avatar,
      verified: data.verified || false,
      followersCount: data.followers_count || null,
      channelUrl: `https://kick.com/${cleanUser}`,
    }

  } catch (error) {
    console.error(`[Kick Channel Frontend Bridge] Failed for ${username}:`, error.message)
    return null
  }
}
