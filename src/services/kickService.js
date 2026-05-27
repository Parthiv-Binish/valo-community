
/**
 * Kick API Service
 * Reliable Kick live + profile fetcher
 */

const KICK_API_BASE =
  'https://kick.com/api/v2/channels'

const TIMEOUT_MS = 15000

// =====================================================
// TIMEOUT
// =====================================================

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
              'Kick request timed out'
            )
          ),
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

  // object
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

  // string
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
// LIVE STREAM
// =====================================================

export async function getKickLiveStream(
  username
) {

  try {

    const response = await withTimeout(

      fetch(
        `${KICK_API_BASE}/${encodeURIComponent(username)}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        }
      )
    )

    if (!response.ok) {

      if (response.status === 404) {
        return null
      }

      throw new Error(
        `Kick API ${response.status}`
      )
    }

    const data =
      await response.json()

    const livestream =
      data?.livestream

    // offline
    if (!livestream) {
      return null
    }

    const user =
      data?.user || data

    return {

      id:
        username,

      platform:
        'kick',

      channelId:
        username,

      username:
        username,

      isLive:
        true,

      title:
        livestream?.session_title ||
        livestream?.slug ||
        'Live Stream',

      thumbnail:
        getThumbnail(
          livestream?.thumbnail
        ),

      viewerCount:
        livestream?.viewer_count ??
        livestream?.viewers ??
        0,

      streamUrl:
        `https://kick.com/${username}`,

      channelName:
        user?.username ||
        user?.name ||
        username,

      avatar:
        getAvatar(user),

      verified:
        user?.verified ||
        false,

      channelUrl:
        `https://kick.com/${username}`,

      startedAt:
        livestream?.created_at ||
        null,
    }

  } catch (error) {

    console.error(
      `[Kick] ${username}:`,
      error.message
    )

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

    const response = await withTimeout(

      fetch(
        `${KICK_API_BASE}/${encodeURIComponent(username)}`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        }
      )
    )

    if (!response.ok) {
      return null
    }

    const data =
      await response.json()

    const user =
      data?.user || data

    return {

      platform:
        'kick',

      channelId:
        username,

      username:
        username,

      channelName:
        user?.username ||
        user?.name ||
        username,

      avatar:
        getAvatar(user),

      verified:
        user?.verified ||
        false,

      followersCount:
        data?.followersCount ||
        data?.followers_count ||
        null,

      channelUrl:
        `https://kick.com/${username}`,
    }

  } catch (error) {

    console.error(
      `[Kick Channel] ${username}:`,
      error.message
    )

    return null
  }
}
