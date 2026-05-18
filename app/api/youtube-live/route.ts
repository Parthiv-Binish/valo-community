import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get('channelId')
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!channelId) {
      return NextResponse.json(
        { error: 'Channel ID is required' },
        { status: 400 }
      )
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      )
    }

    // First, try to check if the channel is live via redirect method (0 quota cost)
    // This works by checking if a redirect to the live stream page is successful
    const liveCheckUrl = `https://www.youtube.com/@${channelId}/live`
    
    try {
      const response = await fetch(liveCheckUrl, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      // If we can reach the /live page, the channel is live
      if (response.ok && response.url.includes('/live')) {
        return NextResponse.json({ isLive: true })
      }
    } catch (headError) {
      // If HEAD request fails, try GET with the actual API
    }

    // Fallback to YouTube API (uses quota)
    const apiUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    apiUrl.searchParams.append('part', 'snippet')
    apiUrl.searchParams.append('channelId', channelId)
    apiUrl.searchParams.append('type', 'video')
    apiUrl.searchParams.append('eventType', 'live')
    apiUrl.searchParams.append('key', apiKey)

    const apiResponse = await fetch(apiUrl.toString())
    const data = await apiResponse.json()

    const isLive = data.items && data.items.length > 0

    return NextResponse.json({ isLive })
  } catch (error) {
    console.error('Error checking YouTube live status:', error)
    return NextResponse.json(
      { error: 'Failed to check live status', isLive: false },
      { status: 500 }
    )
  }
}
