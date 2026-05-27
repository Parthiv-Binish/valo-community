/**
 * Kick API Service
 * Stable + safer version
 */

const KICK_API_BASE =
  'https://kick.com/api/v2/channels'

const TIMEOUT_MS = 7000

const POLL_DELAY = 30000

// =====================================================
// FETCH WITH REAL TIMEOUT
// =====================================================

async function fetchWithTimeout(
  url,
  options = {},
  timeout = TIMEOUT_MS
) {
  const controller = new AbortController()

  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

// =====================================================
// HELPERS
// =====================================================

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  )
}

async function retry(fn, retries = 2) {
  try {
    return await fn()
  } catch (error) {
    if (retries <= 0) {
      throw error
    }

    await sleep(1500)

    return retry(fn, retries - 1)
  }
}

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
// FETCH CHANNEL RAW DATA
// =====================================================

async function fetchKickChannel(username) {
  return retry(async () => {
    const response =
      await fetchWithTimeout(
        `${KICK_API_BASE}/${encodeURIComponent(
          username
        )}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }

      throw new Error(
        `Kick API ${response.status}`
      )
    }

    return response.json()
  })
}

// =====================================================
// LIVE STREAM
// =====================================================

export async function getKickLiveStream(
  username
) {
  try {
    const data =
      await fetchKickChannel(username)

    if (!data) return null

    const livestream =
      data?.livestream

    // offline
    if (!livestream) {
      return null
    }

    const user =
      data?.user || data

    return {
      id: username,

      platform: 'kick',

      channelId: username,

      username,

      isLive: true,

      title:
        livestream?.session_title ||
        livestream?.slug ||
        'Live Stream',

      thumbnail: getThumbnail(
        livestream?.thumbnail
      ),

      viewerCount:
        livestream?.viewer_count ??
        livestream?.viewers ??
        0,

      streamUrl: `https://kick.com/${username}`,

      channelName:
        user?.username ||
        user?.name ||
        username,

      avatar: getAvatar(user),

      verified:
        user?.verified || false,

      channelUrl:
        `https://kick.com/${username}`,

      startedAt:
        livestream?.created_at || null,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(
        `[Kick Timeout] ${username}`
      )
    } else {
      console.error(
        `[Kick Error] ${username}:`,
        error.message
      )
    }

    return null
  }
}

// =====================================================
// CHANNEL INFO
// =====================================================

export async function getKickChannelInfo(
  username
) {
  try {
    const data =
      await fetchKickChannel(username)

    if (!data) return null

    const user =
      data?.user || data

    return {
      platform: 'kick',

      channelId: username,

      username,

      channelName:
        user?.username ||
        user?.name ||
        username,

      avatar: getAvatar(user),

      verified:
        user?.verified || false,

      followersCount:
        data?.followersCount ||
        data?.followers_count ||
        null,

      channelUrl:
        `https://kick.com/${username}`,
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(
        `[Kick Channel Timeout] ${username}`
      )
    } else {
      console.error(
        `[Kick Channel Error] ${username}:`,
        error.message
      )
    }

    return null
  }
}

// =====================================================
// SAFE POLLING
// =====================================================

export async function pollKickStreams(
  usernames,
  callback
) {
  while (true) {
    try {
      const results = []

      // sequential requests
      for (const username of usernames) {
        const stream =
          await getKickLiveStream(
            username
          )

        results.push(stream)

        // prevent rate limit
        await sleep(1000)
      }

      callback(
        results.filter(Boolean)
      )
    } catch (error) {
      console.error(
        '[Kick Polling Error]',
        error
      )
    }

    // wait before next poll
    await sleep(POLL_DELAY)
  }
}
