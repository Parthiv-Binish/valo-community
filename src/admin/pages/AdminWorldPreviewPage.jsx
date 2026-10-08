import { useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'

const characters = [
  { id: 1, name: 'LIVE CREATOR', x: 20, y: 26, live: true, accent: 'red', setup: 'DUELIST' },
  { id: 2, name: 'RISING CREATOR', x: 51, y: 23, live: true, accent: 'cyan', setup: 'SENTINEL' },
  { id: 3, name: 'COMMUNITY', x: 78, y: 30, live: false, accent: 'purple', setup: 'CONTROLLER' },
  { id: 4, name: 'NIGHT GRIND', x: 29, y: 68, live: false, accent: 'amber', setup: 'INITIATOR' },
  { id: 5, name: 'STREAM LAB', x: 62, y: 70, live: true, accent: 'green', setup: 'DUELIST' },
]
const accentMap = { red:'#ff4655', cyan:'#4de8ff', purple:'#a78bfa', amber:'#fbbf24', green:'#34d399' }

function MiniCharacter({ accent = '#ff4655', live = false }) {
  return <svg viewBox="0 0 120 120" className="w-28 h-28 drop-shadow-[0_10px_14px_rgba(0,0,0,.45)]" aria-hidden="true">
    <ellipse cx="60" cy="105" rx="38" ry="8" fill="#000" opacity=".38"/>
    <path d="M30 101c2-23 14-34 30-34s28 11 30 34" fill="#252b38" stroke="#111827" strokeWidth="3"/>
    <path d="M42 73c4 10 12 15 18 15s14-5 18-15" fill="#30394a"/>
    <circle cx="60" cy="49" r="20" fill="#d6a37a" stroke="#111827" strokeWidth="3"/>
    <path d="M40 48c1-20 12-27 25-25 11 2 17 10 15 25-6-7-13-10-22-9-6 1-12 4-18 9Z" fill="#151923"/>
    <path d="M47 52h5M68 52h5" stroke="#111827" strokeWidth="3" strokeLinecap="round"/>
    <path d="M54 61c4 3 8 3 12 0" fill="none" stroke="#9b5e52" strokeWidth="2" strokeLinecap="round"/>
    <path d="M43 83h34l-5 20H48Z" fill={accent} opacity=".9"/>
    <path d="M52 83v18M68 83v18" stroke="#111827" strokeWidth="3" opacity=".55"/>
    {live && <circle cx="92" cy="24" r="7" fill="#ff4655" stroke="#fff" strokeWidth="2"/>}
  </svg>
}

function GamingDesk({ accent }) {
  return <div className="relative w-52 h-36">
    <div className="absolute left-7 top-8 w-36 h-16 rounded-md border-2 border-slate-700 bg-slate-900 shadow-[0_10px_22px_rgba(0,0,0,.45)]">
      <div className="absolute inset-2 rounded-sm bg-slate-950 overflow-hidden">
        <div className="absolute left-2 top-2 h-1.5 w-12 rounded-full opacity-80" style={{background:accent}}/>
        <div className="absolute left-2 top-7 h-1 w-20 rounded-full bg-slate-700"/>
        <div className="absolute left-2 top-11 h-1 w-14 rounded-full bg-slate-800"/>
        <div className="absolute right-2 bottom-2 h-3 w-3 rounded-full" style={{background:accent}}/>
      </div>
    </div>
    <div className="absolute left-[78px] top-[73px] h-9 w-4 bg-slate-700"/>
    <div className="absolute left-14 top-[100px] h-2 w-14 rounded-full bg-slate-600"/>
    <div className="absolute left-1 top-[112px] w-48 h-4 rounded-md bg-slate-700 border border-slate-600"/>
    <div className="absolute right-2 top-[84px] h-5 w-9 rounded bg-slate-800 border border-slate-600"/>
    <div className="absolute left-14 top-[104px] h-3 w-7 rounded-sm bg-slate-950 border border-slate-600"/>
  </div>
}

export default function AdminWorldPreviewPage() {
  const [selected, setSelected] = useState(null)
  return <AdminLayout><div className="space-y-5 animate-fade-in">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div><p className="text-[10px] uppercase tracking-[0.28em] text-valo-red font-display font-bold">Prototype / Visual Lab</p>
      <h1 className="text-2xl md:text-3xl font-display font-black text-white mt-1">2D Gaming World</h1>
      <p className="text-sm text-valo-muted mt-1 max-w-2xl">Top-down community scene prototype. These are original vector game characters, not emoji.</p></div>
      <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Admin preview only</div>
    </div>
    <div className="relative overflow-hidden rounded-2xl border border-valo-border bg-[#0b0f16] min-h-[650px]">
      <div className="absolute inset-0 opacity-40" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',backgroundSize:'40px 40px'}}/>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,70,85,.10),transparent_40%)]"/>
      <div className="absolute left-1/2 top-5 -translate-x-1/2 text-center z-10"><div className="text-[9px] tracking-[0.35em] uppercase text-neutral-500 font-mono">VALO COMMUNITY</div><div className="text-white font-display font-black text-sm tracking-widest">CREATOR LOUNGE</div></div>
      <div className="absolute left-6 top-6 w-44 h-20 rounded-xl border border-slate-700/80 bg-slate-900/80 backdrop-blur-sm p-3"><div className="text-[9px] text-neutral-500 uppercase tracking-widest">Live now</div><div className="text-2xl font-display font-black text-white mt-1">3 <span className="text-xs text-neutral-500">creators</span></div></div>
      <div className="absolute right-6 top-6 w-44 h-20 rounded-xl border border-slate-700/80 bg-slate-900/80 backdrop-blur-sm p-3 text-right"><div className="text-[9px] text-neutral-500 uppercase tracking-widest">World status</div><div className="text-sm font-display font-bold text-emerald-400 mt-2">ONLINE</div></div>
      <div className="absolute left-[8%] right-[8%] top-[28%] h-1 border-t border-dashed border-slate-700/70"/>
      <div className="absolute left-[8%] right-[8%] top-[72%] h-1 border-t border-dashed border-slate-700/70"/>
      {characters.map(character => { const accent=accentMap[character.accent]; const isSelected=selected?.id===character.id; return <button key={character.id} type="button" onClick={()=>setSelected(character)} className="absolute -translate-x-1/2 -translate-y-1/2 group text-left" style={{left:character.x+'%',top:character.y+'%'}} aria-label={'Select '+character.name}>
        <div className={`relative transition-transform duration-200 group-hover:-translate-y-1 ${isSelected?'-translate-y-1':''}`}>
          <GamingDesk accent={accent}/><div className="absolute left-[58px] top-[4px]"><MiniCharacter accent={accent} live={character.live}/></div>
          <div className="absolute left-1/2 -translate-x-1/2 top-[2px] whitespace-nowrap rounded-full border px-2.5 py-1 text-[8px] font-display font-bold tracking-widest" style={{borderColor:accent+'66',background:'#080b11e8',color:accent}}>{character.live?'LIVE':'OFFLINE'}</div>
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 whitespace-nowrap text-[9px] text-slate-300 font-mono bg-black/65 px-2 py-1 rounded">{character.name}</div>
          {isSelected&&<div className="absolute -inset-3 rounded-2xl border border-white/25 pointer-events-none"/>}
        </div>
      </button> })}
      <div className="absolute left-1/2 bottom-7 -translate-x-1/2"><div className="rounded-xl border border-slate-700 bg-slate-950/90 px-5 py-3 text-center"><div className="text-[8px] uppercase tracking-[0.3em] text-neutral-500">Community Hub</div><div className="text-xs font-display font-bold text-white mt-1">LEADERBOARD · EVENTS · PREDICTIONS</div></div></div>
      {selected&&<div className="absolute left-1/2 bottom-24 -translate-x-1/2 w-[min(360px,calc(100%-32px))] rounded-xl border border-slate-700 bg-[#0a0e15f5] backdrop-blur-md p-4 z-20"><div className="flex items-center justify-between gap-3"><div><div className="text-[9px] uppercase tracking-widest text-neutral-500">Selected creator</div><div className="font-display font-bold text-white mt-1">{selected.name}</div></div><button type="button" onClick={()=>setSelected(null)} className="text-neutral-500 hover:text-white text-lg px-2" aria-label="Close preview">×</button></div><div className="flex items-center justify-between mt-4 text-xs"><span className="text-neutral-400">{selected.setup} room</span><span className={selected.live?'text-red-400':'text-neutral-500'}>{selected.live?'Currently live':'Offline'}</span></div></div>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
      <div className="rounded-xl border border-valo-border bg-valo-card p-4"><div className="font-display font-bold text-white">Original characters</div><p className="text-valo-muted mt-1">Vector-built mini characters and gaming desks. No emoji assets.</p></div>
      <div className="rounded-xl border border-valo-border bg-valo-card p-4"><div className="font-display font-bold text-white">Clickable world</div><p className="text-valo-muted mt-1">Click a character to preview how a creator interaction could work.</p></div>
      <div className="rounded-xl border border-valo-border bg-valo-card p-4"><div className="font-display font-bold text-white">Next step</div><p className="text-valo-muted mt-1">If you like this direction, we can replace the demo characters with a richer sprite set and connect them to real streamers.</p></div>
    </div>
  </div></AdminLayout>
}
