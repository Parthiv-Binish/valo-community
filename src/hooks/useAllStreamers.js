import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase.js'
import { getKickLiveStream, getKickChannelInfo } from '../services/kickService'
import { fetchLanguageMap } from '../services/languageService'

const REFRESH_INTERVAL = 60_000
const REALTIME_DEBOUNCE_MS = 2500

export function useAllStreamers() {
  const [streamers, setStreamers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefreshed, setLastRefreshed] = useState(null)

  const mountedRef = useRef(true)
  const inFlightRef = useRef(false)
  const queuedRef = useRef(false)
  const lastFetchAtRef = useRef(0)

  const fetchAll = useCallback(async () => {
    if (inFlightRef.current) {
      queuedRef.current = true
      return
    }
    inFlightRef.current = true
    try {
      setError(null)
      const { data: rows, error: dbError } = await supabase.from('streamers').select(`
        id, platform, youtube_channel_id, kick_username,
        streamer_data (channel_name, avatar, is_live, title, thumbnail, viewer_count, stream_url)
      `).eq('enabled', true)
      if (dbError) throw dbError
      if (!rows || rows.length === 0) {
        if (mountedRef.current) { setStreamers([]); setIsLoading(false); setLastRefreshed(new Date()) }
        return
      }
      const languageMap = await fetchLanguageMap()
      const enriched = await Promise.all(rows.map(async (s) => {
        const info = (Array.isArray(s.streamer_data) ? s.streamer_data[0] : s.streamer_data) || {}
        const channelId = s.platform === 'youtube' ? s.youtube_channel_id : s.kick_username
        const fallbackChannelUrl = s.platform === 'youtube' ? `https://www.youtube.com/channel/${channelId}` : `https://kick.com/${channelId}`
        const base = { dbId:s.id, platform:s.platform, channelId, isLive:false, title:null, thumbnail:null, viewerCount:null, streamUrl:fallbackChannelUrl, channelUrl:fallbackChannelUrl, channelName:info.channel_name||channelId, avatar:info.avatar||null, verified:false, language:languageMap ? languageMap.get(s.id)||null : null }
        if (s.platform === 'youtube') return {...base,isLive:info.is_live||false,title:info.title||null,thumbnail:info.thumbnail||null,viewerCount:info.viewer_count||0,streamUrl:info.stream_url||fallbackChannelUrl}
        if (s.platform === 'kick') return {...base,isLive:info.is_live===true,title:info.is_live?(info.title||null):null,thumbnail:info.is_live?(info.thumbnail||null):null,viewerCount:info.is_live?(info.viewer_count||0):0,streamUrl:info.is_live?(info.stream_url||fallbackChannelUrl):fallbackChannelUrl}
        return base
      }))
      const sorted=enriched.sort((a,b)=>a.isLive&&!b.isLive?-1:!a.isLive&&b.isLive?1:a.isLive&&b.isLive?(b.viewerCount||0)-(a.viewerCount||0):(a.channelName||'').localeCompare(b.channelName||''))
      if(mountedRef.current){setStreamers(sorted);setLastRefreshed(new Date())}
      lastFetchAtRef.current=Date.now()
    }catch(err){console.error(err);if(mountedRef.current)setError(err.message||'Failed to load streamers')}
    finally{
      inFlightRef.current=false
      if(mountedRef.current)setIsLoading(false)
      if(queuedRef.current&&mountedRef.current){queuedRef.current=false;fetchAll()}
    }
  },[])

  useEffect(()=>{mountedRef.current=true;return()=>{mountedRef.current=false}},[])
  useEffect(()=>{fetchAll()},[fetchAll])
  useEffect(()=>{
    const id=setInterval(()=>{if(document.visibilityState==='visible')fetchAll()},REFRESH_INTERVAL)
    const onVisible=()=>{if(document.visibilityState==='visible'&&Date.now()-lastFetchAtRef.current>REFRESH_INTERVAL/2)fetchAll()}
    document.addEventListener('visibilitychange',onVisible)
    return()=>{clearInterval(id);document.removeEventListener('visibilitychange',onVisible)}
  },[fetchAll])
  useEffect(()=>{
    let timer=null
    const scheduleRefetch=()=>{if(timer)return;timer=setTimeout(()=>{timer=null;if(document.visibilityState==='visible')fetchAll()},REALTIME_DEBOUNCE_MS)}
    const channel=supabase.channel(`schema-db-changes-${Math.random().toString(36).slice(2,8)}`).on('postgres_changes',{event:'*',schema:'public',table:'streamers'},scheduleRefetch).on('postgres_changes',{event:'*',schema:'public',table:'streamer_data'},scheduleRefetch).subscribe()
    return()=>{if(timer)clearTimeout(timer);supabase.removeChannel(channel)}
  },[fetchAll])

  return {streamers,isLoading,error,refresh:fetchAll,lastRefreshed}
}
