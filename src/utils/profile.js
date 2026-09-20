/**
 * Streamer profile URLs.
 *
 * Profiles live at /streamer/:platform/:handle where handle is the same
 * identifier the rest of the app already uses for a channel:
 *   youtube -> youtube_channel_id (UC…)      kick -> kick_username
 * (This is also the key the follow button stores, so profile + card agree.)
 */

export function profilePath(streamer) {
  if (!streamer?.platform || !streamer?.channelId) return '/'
  return `/streamer/${streamer.platform}/${encodeURIComponent(streamer.channelId)}`
}

export function matchesProfile(streamer, platform, handle) {
  if (!streamer || !platform || !handle) return false
  return (
    streamer.platform === platform &&
    String(streamer.channelId || '').toLowerCase() === String(handle).toLowerCase()
  )
}

export function platformLabel(platform) {
  return platform === 'kick' ? 'Kick' : platform === 'youtube' ? 'YouTube' : platform
}
