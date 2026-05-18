/**
 * Kick API Service
 * Fetches live stream data for a given Kick username.
 *
 * Kick API endpoint: https://kick.com/api/v2/channels/{username}
 *
 * NOTE: Kick does not officially provide a public API, so this is a
 * best-effort integration. The endpoint may require a proxy in production
 * due to CORS restrictions. Configure your Vite dev proxy or backend proxy.
 */

const KICK_API_BASE = 'https://kick.com/api/v2/channels'

/**
 * Check if a Kick channel is currently live.
 * Returns stream details or null if offline / on error.
 */
export async function getKickLiveStream(username) {
  try {
    const res = await fetch(`${KICK_API_BASE}/${encodeURIComponent(username)}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    })

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Kick API error: ${res.status}`)
    }

    const data = await res.json()

    // If no active livestream, return null
    if (!data.livestream) return null

    const ls = data.livestream
    const channel = data

    return {
      platform: 'kick',
      username,
      title: ls.session_title || 'Live Stream',
      channelName: channel.user?.username || username,
      thumbnail: ls.thumbnail?.url || ls.thumbnail || null,
      streamUrl: `https://kick.com/${username}`,
      viewerCount: ls.viewer_count ?? null,
      startedAt: ls.created_at,
    }
  } catch (err) {
    console.error(`[Kick] Error fetching channel ${username}:`, err.message)
    return null
  }
}

/**
 * Fetch basic channel info (not live status).
 */
export async function getKickChannelInfo(username) {
  try {
    const res = await fetch(`${KICK_API_BASE}/${encodeURIComponent(username)}`, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) return null

    const data = await res.json()
    return {
      name: data.user?.username || username,
      avatar: data.user?.profile_pic,
      channelUrl: `https://kick.com/${username}`,
      followersCount: data.followersCount,
    }
  } catch {
    return null
  }
}
