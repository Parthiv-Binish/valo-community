/**
 * Kick API Service
 * Fetches live stream data for a given Kick username via Vercel API.
 *
 * The /api/kick-live endpoint handles CORS issues by running server-side
 * on Vercel and calling the Kick API directly.
 */

/**
 * Check if a Kick channel is currently live.
 * Returns stream details or null if offline / on error.
 */
export async function getKickLiveStream(username: string) {
  try {
    const url = new URL('/api/kick-live', typeof window !== 'undefined' ? window.location.origin : '')
    url.searchParams.set('username', username)

    const res = await fetch(url.toString())

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error(`Kick API error: ${res.status}`)
    }

    const data = await res.json()

    if (!data.isLive) return null

    return {
      platform: 'kick',
      username,
      title: 'Live Stream',
      channelName: username,
      thumbnail: null,
      streamUrl: `https://kick.com/${username}`,
      viewerCount: null,
    }
  } catch (err) {
    console.error(`[Kick] Error fetching channel ${username}:`, (err as Error).message)
    return null
  }
}

/**
 * Fetch basic channel info (not live status).
 */
export async function getKickChannelInfo(username: string) {
  try {
    const res = await fetch(`https://kick.com/api/v1/channels/${encodeURIComponent(username)}`, {
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
