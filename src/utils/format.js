/**
 * Format viewer count: 1234 → "1.2K", 1200000 → "1.2M"
 */
export function formatViewerCount(count) {
  if (count == null) return '—'
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`
  return count.toString()
}

/**
 * Truncate text to a max length.
 */
export function truncate(str, max = 60) {
  if (!str) return ''
  return str.length > max ? str.slice(0, max) + '…' : str
}

/**
 * Format a relative time string: "3 minutes ago", "2 hours ago", etc.
 */
export function timeAgo(dateString) {
  if (!dateString) return ''
  const diff = (Date.now() - new Date(dateString).getTime()) / 1000
  if (diff < 60) return 'Just started'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

/**
 * Extract username from a URL.
 * e.g. https://kick.com/shroud → "shroud"
 *      https://youtube.com/@mkbhd → "@mkbhd"
 */
export function extractUsername(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] || url
  } catch {
    return url
  }
}

/**
 * Detect platform from URL.
 */
export function detectPlatform(url) {
  if (!url) return null
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('kick.com')) return 'kick'
  return null
}

/**
 * "1h 05m" style duration since an ISO timestamp. Returns null for missing or
 * invalid input, so callers can simply hide the label.
 */
export function formatLiveDuration(startedAt, now = Date.now()) {
  if (!startedAt) return null
  const start = new Date(startedAt).getTime()
  if (Number.isNaN(start)) return null
  const mins = Math.floor((now - start) / 60000)
  if (mins < 1 || mins > 60 * 48) return null // ignore clock skew / stale data
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`
}
