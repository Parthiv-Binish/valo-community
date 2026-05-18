import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Fetch channel data from Kick API
    const response = await fetch(`https://kick.com/api/v1/channels/${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Channel not found', isLive: false },
        { status: 404 }
      )
    }

    const data = await response.json()
    const isLive = data.livestream !== null && data.livestream.is_live === true

    return NextResponse.json({ isLive, streamUrl: isLive ? data.livestream.channel.url : null })
  } catch (error) {
    console.error('Error checking Kick live status:', error)
    return NextResponse.json(
      { error: 'Failed to check live status', isLive: false },
      { status: 500 }
    )
  }
}
