/**
 * Kick API Service
 * Kick live + profile fetcher, routed through a Cloudflare Worker proxy.
 *
 * Configuration (Vercel / .env):
 *   VITE_KICK_PROXY_URL    optional – falls back to the existing worker URL
 *   VITE_KICK_PROXY_TOKEN  REQUIRED – shared secret expected by the worker
 *
 * NOTE: anything in a VITE_* variable is bundled into client JavaScript, so this
 * token is NOT truly secret. Keeping it out of source control lets you rotate it
 * without a code change; protect the worker itself with rate limits / an Origin
 * allow-list (see UPGRADE-NOTES.md).
 */

const KICK_PROXY_URL =
  import.meta.env.VITE_KICK_PROXY_URL ||
  'https://kick-proxy.parthivbinish2004.workers.dev'
const KICK_PROXY_TOKEN = import.meta.env.VITE_KICK_PROXY_TOKEN || ''
const TIMEOUT_MS = 15000

// One request per channel is shared for a short window. Previously the live
// check and the profile lookup hit the same endpoint twice for every offline
// streamer on every refresh.
const CACHE_TTL_MS = 15000
const responseCache = new Map()

let warnedMissingToken = false

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

// Best-effort: the shape of Kick's (unofficial) payload is not guaranteed, so
// every path is optional and the UI simply hides the tag when this is null.
function getCategory(livestream) {
  return (
    livestream?.categories?.[0]?.name ||
    livestream?.category?.name ||
    null
  )
}

// =====================================================
// FETCH VIA PROXY
// =====================================================

async function kickFetch(username) {
  return withTimeout(
    fetch(
      `${KICK_PROXY_URL}/${encodeURIComponent(username)}?token=${encodeURIComponent(KICK_PROXY_TOKEN)}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )
  )
}

/**
 * Fetch + parse the channel JSON, de-duplicated per username.
 * Rejects with an Error carrying `.status` when the HTTP status is not ok.
 */
function kickJson(username) {
  if (!KICK_PROXY_TOKEN && !warnedMissingToken) {
    warnedMissingToken = true
    console.warn(
      '[Kick] VITE_KICK_PROXY_TOKEN is not set – Kick live status will be unavailable.'
    )
  }

  const key = String(username).toLowerCase()
  const hit = responseCache.get(key)
  if (hit && Date.now() - hit.ts < CACHE_TTL_MS) return hit.promise

  const promise = (async () => {
    const response = await kickFetch(username)
    if (!response.ok) {
      const err = new Error(`Kick API ${response.status}`)
      err.status = response.status
      throw err
    }
    return response.json()
  })()

  responseCache.set(key, { ts: Date.now(), promise })
  // Never cache failures.
  promise.catch(() => {
    if (responseCache.get(key)?.promise === promise) responseCache.delete(key)
  })

  return promise
}

// =====================================================
// LIVE STREAM
// =====================================================

export async function getKickLiveStream(username) {
  try {
    const data = await kickJson(username)
    const livestream = data?.livestream

    // offline
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
      category: getCategory(livestream),
    }

  } catch (error) {
    if (error?.status !== 404) {
      console.error(`[Kick] ${username}:`, error.message)
    }
    return null
  }
}

// =====================================================
// CHANNEL INFO
// =====================================================

export async function getKickChannelInfo(username) {
  try {
    const data = await kickJson(username)
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
    if (error?.status !== 404) {
      console.error(`[Kick Channel] ${username}:`, error.message)
    }
    return null
  }
}
