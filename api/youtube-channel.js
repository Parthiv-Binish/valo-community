const CHANNEL_ID_RE = /UC[a-zA-Z0-9_-]{22}/g

function findChannelId(html) {
  if (!html) return null
  const patterns = [
    /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
    /"externalId":"(UC[a-zA-Z0-9_-]{22})"/,
    /"browseId":"(UC[a-zA-Z0-9_-]{22})"/,
    /itemprop="channelId"[^>]+content="(UC[a-zA-Z0-9_-]{22})"/,
    /\/channel\/(UC[a-zA-Z0-9_-]{22})/,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1]
  }
  return html.match(CHANNEL_ID_RE)?.[0] || null
}

function normaliseInput(raw) {
  let value = String(raw || '').trim()
  if (!value) throw new Error('YouTube channel URL is required.')

  if (/^UC[a-zA-Z0-9_-]{22}$/.test(value)) {
    return { channelId: value, url: `https://www.youtube.com/channel/${value}` }
  }

  if (!/^https?:\\/\\//i.test(value)) value = `https://${value}`

  let url
  try { url = new URL(value) } catch { throw new Error('Invalid YouTube channel URL.') }

  const host = url.hostname.toLowerCase().replace(/^www\\./, '').replace(/^m\\./, '')
  if (host !== 'youtube.com') throw new Error('Only youtube.com channel URLs are supported.')

  const parts = url.pathname.split('/').filter(Boolean)
  const channelIndex = parts.findIndex((part) => part.toLowerCase() === 'channel')
  if (channelIndex >= 0 && parts[channelIndex + 1]) {
    const id = parts[channelIndex + 1]
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(id)) return { channelId: id, url: url.toString() }
  }

  if (!parts[0]) throw new Error('Use a URL such as youtube.com/@kingster.')
  return { url: url.toString() }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const input = normaliseInput(req.query?.url)
    if (input.channelId) return res.status(200).json({ channel_id: input.channelId, resolved: true })

    const response = await fetch(input.url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VALOCommunity/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    })
    if (!response.ok) throw new Error(`YouTube returned HTTP ${response.status}.`)

    const html = await response.text()
    const channelId = findChannelId(html)
    if (!channelId) throw new Error('Could not resolve this YouTube handle to a channel ID.')

    return res.status(200).json({ channel_id: channelId, channel_url: response.url || input.url, resolved: true })
  } catch (error) {
    return res.status(400).json({ error: error instanceof Error ? error.message : 'Unable to resolve YouTube channel.' })
  }
}
