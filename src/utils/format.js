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
