const CHANNEL_ID_RE = /UC[a-zA-Z0-9_-]{22}/g

function firstChannelId(text) {
  if (!text) return null
  const matches = text.match(CHANNEL_ID_RE)
  return matches?.[0] || null
}

function normaliseYouTubeUrl(raw) {
  let value = String(raw || '').trim()
  if (!value) throw new Error('Paste a YouTube channel URL or channel ID.')

  if (/^UC[a-zA-Z0-9_-]{22}$/.test(value)) {
    return { channelId: value, sourceUrl: `https://www.youtube.com/channel/${value}` }
  }

  if (!/^https?:\\/\\//i.test(value)) {
    value = `https://${value}`
  }

  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error('That is not a valid YouTube URL.')
  }

  const host = url.hostname.toLowerCase().replace(/^www\\./, '').replace(/^m\\./, '')
  if (host !== 'youtube.com') {
    throw new Error('Only youtube.com channel links are supported.')
  }

  const parts = url.pathname.split('/').filter(Boolean)
  const channelIndex = parts.findIndex((part) => part.toLowerCase() === 'channel')

  if (channelIndex >= 0 && parts[channelIndex + 1]) {
    const channelId = parts[channelIndex + 1]
    if (/^UC[a-zA-Z0-9_-]{22}$/.test(channelId)) {
      return { channelId, sourceUrl: url.toString() }
    }
    throw new Error('The /channel/ URL does not contain a valid YouTube channel ID.')
  }

  if (!parts.length) {
    throw new Error('Include a YouTube channel handle, for example youtube.com/@creator.')
  }

  return { sourceUrl: url.toString() }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const raw = typeof req.query?.url === 'string' ? req.query.url : ''
    const normalised = normaliseYouTubeUrl(raw)

    if (normalised.channelId) {
      return res.status(200).json({
        channel_id: normalised.channelId,
        channel_url: normalised.sourceUrl,
        resolved: true,
      })
    }

    const response = await fetch(normalised.sourceUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VALOCommunity/1.0; +https://letsbuildvalocommunity.vercel.app/)',
        Accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    })

    if (!response.ok) {
      return res.status(502).json({
        error: `YouTube returned HTTP ${response.status} while resolving that channel.`,
      })
    }

    const html = await response.text()
    const channelId =
      firstChannelId(html) ||
      firstChannelId(html.match(/"externalId":"(UC[a-zA-Z0-9_-]{22})"/)?.[1])

    if (!channelId) {
      return res.status(404).json({
        error: 'Could not find a channel ID on that YouTube page. Make sure the link points to a real channel.',
      })
    }

    return res.status(200).json({
      channel_id: channelId,
      channel_url: response.url || normalised.sourceUrl,
      resolved: true,
    })
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Unable to resolve the YouTube channel.',
    })
  }
}
