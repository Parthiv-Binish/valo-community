import { formatViewerCount } from '../../utils/format'
import NotifyButton from '../common/NotifyButton'

const PLATFORM_CONFIG = {
  youtube: {
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/YouTube_2024_%28white_text%29.svg/1920px-YouTube_2024_%28white_text%29.svg.png?_=20241114183930',
    label: 'YouTube',
    accentColor: '#ff4655',
    bgClass: 'bg-[#ff4655]/10 text-[#ff4655] border-[#ff4655]/20',
    logoHeight: 'h-2.5',
  },
  kick: {
    logo: 'https://kick.com/img/kick-logo.svg',
    label: 'Kick',
    accentColor: '#53fc18',
    bgClass: 'bg-[#53fc18]/10 text-[#53fc18] border-[#53fc18]/20',
    logoHeight: 'h-3',
  },
}

function getKickEmbedUrl(streamer) {
  const channel = streamer.channelName || streamer.channelId || streamer.kick_username
  if (!channel) return null
  return `https://player.kick.com/${channel}?autoplay=true&muted=true`
}

export default function StreamerCard({ streamer }) {
  if (!streamer) return null

  const isLive = !!(streamer.isLive || streamer.is_live)
  const platform = streamer.platform || 'youtube'
  const cfg = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube
  const channelName = streamer.channelName || streamer.channel_name || 'Agent Context'

  // 🕵️ Catch un-scraped channels before they render a broken layout
  const isUnscrapedYoutube = platform === 'youtube' && (!channelName || channelName.startsWith('UC'))
  const isUnscrapedKick = platform === 'kick' && !channelName

  if (isUnscrapedYoutube || isUnscrapedKick) {
    return (
      <div className="bg-[#0c0d10] border border-neutral-900 p-6 flex flex-col items-center justify-center text-center h-[260px] relative overflow-hidden select-none">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neutral-800" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neutral-800" />
        
        <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-600 animate-spin">
          {loadingIcon()}
        </div>
        <h3 className="font-mono font-black text-xs text-white uppercase tracking-wider mb-1">
          Syncing Profile
        </h3>
        <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest max-w-[180px] leading-relaxed">
          Acquiring telemetry logs...
        </p>
      </div>
    )
  }

  const href = isLive
    ? streamer.streamUrl || streamer.stream_url || streamer.channelUrl || streamer.channel_url || `https://${platform}.com/${streamer.channelId}`
    : streamer.channelUrl || streamer.channel_url || (platform === 'youtube'
        ? `https://www.youtube.com/channel/${streamer.channelId}`
        : `https://kick.com/${streamer.channelId}`)

  const avatarLetter = channelName.charAt(0).toUpperCase()

  return (
    <div className="group bg-[#0c0d10] border border-neutral-900 hover:border-neutral-800 transition-all duration-150 flex flex-col justify-between relative overflow-hidden select-none rounded-sm">
      
      {/* Tactical Gaming Outer Corner Borders */}
      <div className="absolute top-0 left-0 w-[1px] h-3 bg-neutral-800 group-hover:bg-[#ff4655] transition-colors" />
      <div className="absolute top-0 left-0 w-3 h-[1px] bg-neutral-800 group-hover:bg-[#ff4655] transition-colors" />
      <div className="absolute bottom-0 right-0 w-[1px] h-3 bg-neutral-800" />
      <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-neutral-800" />

      {/* ── CORE PROFILE HUD DISPLAY CANVAS (No Thumbnails for YT/Kick Layouts) ── */}
      <a href={href} target="_blank" rel="noopener noreferrer" className="block relative p-5 bg-gradient-to-b from-neutral-950/40 to-transparent group-hover:bg-neutral-950/20 transition-colors">
        
        {/* Ambient Grid Backdrop Line Layer */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [bg-size:12px_12px] pointer-events-none" />

        <div className="flex flex-col items-center justify-center text-center space-y-4 relative z-10">
          
          {/* Circular Cyber-Avatar Frame Node */}
          <div className="relative">
            {streamer.avatar ? (
              <img
                src={streamer.avatar}
                alt={channelName}
                className={`w-20 h-20 rounded-full object-cover border-2 transition-all duration-300 bg-neutral-900
                  ${isLive 
                    ? 'border-[#ff4655] shadow-[0_0_25px_rgba(255,70,85,0.25)] scale-105' 
                    : 'border-neutral-800 group-hover:border-neutral-700'
                  }`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-mono font-black border-2 border-neutral-800"
                style={{ background: `${cfg.accentColor}15`, color: cfg.accentColor }}
              >
                {avatarLetter}
              </div>
            )}

            {/* Dynamic Floating Pulse Dot Status Beacon */}
            {isLive && (
              <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#ff4655] border-2 border-[#0c0d10] rounded-full animate-pulse shadow-[0_0_8px_#ff4655]" />
            )}
          </div>

          {/* Identity Grid Data Cluster */}
          <div className="space-y-2 w-full">
            <div className="flex flex-col items-center gap-1.5">
              
              {/* Channel Name + Verification Shield Badge */}
              <div className="flex items-center justify-center gap-1 max-w-full px-2">
                <h3 className="font-display font-black text-xs text-white uppercase tracking-wider truncate group-hover:text-[#ff4655] transition-colors font-sans">
                  {channelName}
                </h3>
                {streamer.verified && (
                  <svg className="w-3.5 h-3.5 shrink-0 text-[#3ea6ff]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.25 12c0-.86-.69-1.55-1.55-1.55h-.59a1.55 1.55 0 0 1-1.46-1.04l-.2-.57a1.55 1.55 0 0 0-1.96-.96l-.56.2a1.55 1.55 0 0 1-1.82-.64l-.33-.5a1.55 1.55 0 0 0-2.58 0l-.33.5a1.55 1.55 0 0 1-1.82.64l-.56-.2a1.55 1.55 0 0 0-1.96.96l-.2.57a1.55 1.55 0 0 1-1.46 1.04h-.59A1.55 1.55 0 0 0 1.75 12c0 .86.69 1.55 1.55 1.55h.59c.66 0 1.25.42 1.46 1.04l.2.57c.28.81 1.16 1.24 1.96.96l.56-.2c.65-.23 1.37.02 1.82.64l.33.5a1.55 1.55 0 0 0 2.58 0l.33-.5c.45-.62 1.17-.87 1.82-.64l.56.2c.81.28 1.68-.15 1.96-.96l.2-.57c.21-.62.8-1.04 1.46-1.04h.59c.86 0 1.55-.69 1.55-1.55z" />
                  </svg>
                )}
              </div>

              {/* 🎯 CORE UPGRADE: Inline Combined Platform Status Badge */}
              <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 border ${cfg.bgClass}`}>
                <img src={cfg.logo} alt="" className={`${cfg.logoHeight} w-auto object-contain shrink-0`} />
                <span>// {isLive ? 'LIVE' : 'OFFLINE'}</span>
              </span>

            </div>

            {/* Live Streaming Metadata Subtitle Track */}
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-tighter line-clamp-1 h-3.5 px-4">
              {isLive ? (streamer.title || 'Broadcast Active') : 'Standby Matrix Core'}
            </p>
          </div>

        </div>
      </a>

      {/* ── FOOTER ACTIONS CONTROLS CONSOLE ── */}
      <div className="p-4 pt-0 space-y-2.5">
        
        {/* Real-time viewer node counter display inside card bounds */}
        {isLive && streamer.viewerCount != null && (
          <div className="w-full bg-neutral-950 border border-neutral-900/60 text-center py-1 font-mono text-[10px] text-neutral-400 font-bold tracking-tight">
            TRACKING: <span className="text-[#ff4655] font-black">{formatViewerCount(streamer.viewerCount)}</span> AGENTS
          </div>
        )}

        <div className="flex gap-2 items-center w-full">
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`flex-1 text-center font-mono text-[10px] font-black uppercase tracking-widest py-2 border transition-all duration-100 active:scale-[0.97]
              ${isLive
                ? 'bg-[#ff4655] border-[#ff4655] text-white hover:bg-[#e03e4b] shadow-[0_0_15px_rgba(255,70,85,0.15)]'
                : 'border-neutral-800 bg-neutral-950 text-neutral-500 hover:text-white hover:border-neutral-700'
              }`}
          >
            {isLive ? 'Connect Feed' : 'Inspect Base'}
          </a>

          <NotifyButton streamerId={streamer.id || streamer.streamer_id || streamer.channelId} />
        </div>
      </div>

    </div>
  )
}

function loadingIcon() {
  return (
    <svg className="w-5 h-5 text-neutral-500 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M2 12a10 10 0 0 1 10-10" stroke="currentColor" strokeWidth="3" className="opacity-75" />
    </svg>
  )
}
