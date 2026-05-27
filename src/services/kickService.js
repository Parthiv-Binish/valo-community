/**
 * Kick API Service
 * Reliable Kick live + profile fetcher (via proxy)
 */

const KICK_PROXY_URL = 'https://kick-proxy.parthivbinish2004.workers.dev'
const KICK_PROXY_TOKEN = 'Kingstera2004'
const TIMEOUT_MS = 15000

// =====================================================
// TIMEOUT
// =====================================================

function withTimeout(promise, ms = TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Kick request timed out')),
        ms
      )
    ),
  ])
}

// =====================================================
// HELPERS
// =====================================================

function getThumbnail(thumbnail) {
  if (!thumbnail) return null

  if (typeof thumbnail === 'object') {
    return (
      thumbnail.src ||
      thumbnail.url ||
      thumbnail.large ||
      thumbnail.medium ||
      thumbnail.small ||
      null
    )
  }

  if (typeof thumbnail === 'string') {
    return thumbnail
  }

  return null
}

function getAvatar(user) {
  if (!user) return null

  return (
    user.profile_pic ||
    user.profilePic ||
    user.avatar ||
    null
  )
}

// =====================================================
// FETCH VIA PROXY
// =====================================================

async function kickFetch(username) {
  const response = await withTimeout(
    fetch(
      `${KICK_PROXY_URL}/api/v2/channels/${encodeURIComponent(username)}`,
      {
        headers: {
          Accept: 'application/json',
          'x-proxy-token': KICK_PROXY_TOKEN,
        },
      }
    )
  )

  return response
}

// =====================================================
// LIVE STREAM
// =====================================================

export async function getKickLiveStream(username) {
  try {
    const response = await kickFetch(username)

    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error(`Kick API ${response.status}`)
    }

    const data = await response.json()
    const livestream = data?.livestream

    if (!livestream) return null

    const user = data?.user || data

    return {
      id: username,
      platform: 'kick',
      channelId: username,
      username: username,
      isLive: true,
      title:
        livestream?.session_title ||
        livestream?.slug ||
        'Live Stream',
      thumbnail: getThumbnail(livestream?.thumbnail),
      viewerCount:
        livestream?.viewer_count ??
        livestream?.viewers ??
        0,
      streamUrl: `https://kick.com/${username}`,
      channelName: user?.username || user?.name || username,
      avatar: getAvatar(user),
      verified: user?.verified || false,
      channelUrl: `https://kick.com/${username}`,
      startedAt: livestream?.created_at || null,
    }
  } catch (error) {
    console.error(`[Kick] ${username}:`, error.message)
    return null
  }
}

// =====================================================
// CHANNEL INFO
// =====================================================

export async function getKickChannelInfo(username) {
  try {
    const response = await kickFetch(username)

    if (!response.ok) return null

    const data = await response.json()
    const user = data?.user || data

    return {
      platform: 'kick',
      channelId: username,
      username: username,
      channelName: user?.username || user?.name || username,
      avatar: getAvatar(user),
      verified: user?.verified || false,
      followersCount:
        data?.followersCount ||
        data?.followers_count ||
        null,
      channelUrl: `https://kick.com/${username}`,
    }
  } catch (error) {
    console.error(`[Kick Channel] ${username}:`, error.message)
    return null
  }
}
