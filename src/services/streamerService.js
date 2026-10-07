import { supabase } from '../lib/supabase'

// ── Public ─────────────────────────────────────────────────────────────────

export async function getEnabledStreamers() {
  const { data, error } = await supabase
    .from('streamers')
    .select('*')
    .eq('enabled', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

// ── Admin ──────────────────────────────────────────────────────────────────

export async function getAllStreamers() {
  const { data, error } = await supabase
    .from('streamers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function addStreamer({ platform, youtube_channel_id, kick_username }) {
  const payload = { platform, enabled: true }
  if (platform === 'youtube') payload.youtube_channel_id = youtube_channel_id
  if (platform === 'kick') payload.kick_username = kick_username

  const { data, error } = await supabase.from('streamers').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateStreamer(id, updates) {
  const { data, error } = await supabase
    .from('streamers')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteStreamer(id) {
  const { error } = await supabase.from('streamers').delete().eq('id', id)
  if (error) throw error
}

export async function toggleStreamer(id, enabled) {
  return updateStreamer(id, { enabled })
}

// ── Submissions ─────────────────────────────────────────────────────────────

export async function submitStreamerLink({ platform, url }) {
  const { data, error } = await supabase
    .from('submissions')
    .insert({ platform, url, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getAllSubmissions() {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

async function resolveYouTubeChannelId(url) {
  const response = await fetch(`/api/youtube-channel?url=${encodeURIComponent(url)}`)
  const body = await response.json().catch(() => ({}))
  if (!response.ok || !/^UC[a-zA-Z0-9_-]{22}$/.test(body.channel_id || '')) {
    throw new Error(body.error || 'Could not resolve the YouTube channel ID.')
  }
  return body.channel_id
}

export async function updateSubmissionStatus(id, status) {
  const { data: submission, error: fetchError } = await supabase
    .from('submissions')
    .select('*')
    .eq('id', id)
    .single()
  if (fetchError) throw fetchError

  if (status === 'approved') {
    let payload
    if (submission.platform === 'youtube') {
      const channelId = await resolveYouTubeChannelId(submission.url)
      payload = { platform: 'youtube', youtube_channel_id: channelId, enabled: true }
    } else if (submission.platform === 'kick') {
      const url = new URL(submission.url)
      const parts = url.pathname.split('/').filter(Boolean)
      const username = parts[0]
      if (!username) throw new Error('Could not extract the Kick username from this URL.')
      payload = { platform: 'kick', kick_username: username, enabled: true }
    } else {
      throw new Error('Unsupported submission platform.')
    }

    const { error: streamerError } = await supabase.from('streamers').insert(payload)
    if (streamerError) throw streamerError
  }

  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
