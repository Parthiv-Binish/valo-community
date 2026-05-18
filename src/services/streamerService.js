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

export async function updateSubmissionStatus(id, status) {
  const { data, error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
