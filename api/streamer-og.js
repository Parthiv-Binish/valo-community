/**
 * Link-preview (Open Graph) endpoint for streamer profiles.
 *
 * The site is a client-rendered SPA, so WhatsApp / Telegram / Discord / X
 * crawlers (which don't run JavaScript) would otherwise all see the same generic
 * preview for every profile link. vercel.json rewrites ONLY requests from known
 * link-preview crawlers on /streamer/:platform/:handle to this function; normal
 * visitors never touch it and still get the SPA.
 *
 * Reads the public `streamers` + `streamer_data` rows with the Supabase anon
 * key (the same access the browser has). Any failure degrades to a generic
 * preview – it never returns an error page to a crawler.
 */

const SITE = 'https://letsbuildvalocommunity.vercel.app'
const SITE_NAME = "Let's Build VALO Community"
const DEFAULT_IMAGE = 'https://iili.io/Bp6m8Xa.png'
const DEFAULT_DESCRIPTION =
  'VALORANT live streamer community platform – watch live streams from YouTube and Kick'

const HANDLE_RE = /^[A-Za-z0-9_.-]{1,64}$/

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const httpsOnly = (u) => (typeof u === 'string' && /^https:\/\//i.test(u) ? u : null)

export function buildHtml({ title, description, image, url }) {
  const t = escapeHtml(title)
  const d = escapeHtml(description)
  const i = escapeHtml(image)
  const u = escapeHtml(url)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${u}">
<meta property="og:type" content="profile">
<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${i}">
<meta property="og:url" content="${u}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${i}">
</head>
<body><p><a href="${u}">${t}</a></p></body>
</html>`
}

async function lookupStreamer(platform, handle) {
  const base = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  // Throwing (not returning null) means "couldn't look it up" -> generic preview,
  // whereas null below means "looked it up and it doesn't exist" -> 404.
  if (!base || !key) throw new Error('Supabase env vars are not configured')

  const column = platform === 'kick' ? 'kick_username' : 'youtube_channel_id'
  // LIKE treats "_" as a wildcard – escape it so usernames match literally.
  const filter =
    platform === 'kick'
      ? `ilike.${handle.replace(/_/g, '\\_')}`
      : `eq.${handle}`

  const query =
    `select=platform,kick_username,youtube_channel_id,` +
    `streamer_data(channel_name,avatar,is_live,title,thumbnail,viewer_count)` +
    `&enabled=eq.true&platform=eq.${platform}&${column}=${encodeURIComponent(filter)}&limit=1`

  const response = await fetch(`${base.replace(/\/$/, '')}/rest/v1/streamers?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  })
  if (!response.ok) throw new Error(`Supabase responded ${response.status}`)
  const rows = await response.json()
  return Array.isArray(rows) && rows[0] ? rows[0] : null
}

export default async function handler(req, res) {
  const platform = String(req.query?.platform || '')
  const handle = String(req.query?.handle || '')
  const valid = (platform === 'kick' || platform === 'youtube') && HANDLE_RE.test(handle)

  const pageUrl = valid
    ? `${SITE}/streamer/${platform}/${encodeURIComponent(handle)}`
    : SITE

  let meta = {
    title: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    image: DEFAULT_IMAGE,
    url: pageUrl,
  }
  let status = 200

  if (valid) {
    try {
      const row = await lookupStreamer(platform, handle)
      if (row) {
        const info = (Array.isArray(row.streamer_data) ? row.streamer_data[0] : row.streamer_data) || {}
        const name = info.channel_name || handle
        const where = platform === 'kick' ? 'Kick' : 'YouTube'
        const live = Boolean(info.is_live)

        meta = {
          title: `${name} – VALORANT streamer | ${SITE_NAME}`,
          description: live
            ? `${name} is live now on ${where}${info.title ? `: ${info.title}` : ''}. Follow to get notified when they go live.`
            : `Follow ${name} on ${SITE_NAME} and get notified when they go live on ${where}.`,
          image: (live && httpsOnly(info.thumbnail)) || httpsOnly(info.avatar) || DEFAULT_IMAGE,
          url: pageUrl,
        }
      } else {
        status = 404 // unknown streamer; still serve a valid preview page
      }
    } catch {
      /* fall through to the generic preview */
    }
  }

  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Previews don't need to be second-accurate; cache at the edge to protect Supabase.
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  res.end(buildHtml(meta))
}
