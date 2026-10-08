import { useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'

const rooms = [
  {id:'live',name:'LIVE LOUNGE',x:16,y:24,color:'#ff4655',live:true,creator:'LIVE CREATOR',viewers:'12.4K'},
  {id:'rising',name:'RISING ROOM',x:50,y:21,color:'#45d9ff',live:true,creator:'RISING CREATOR',viewers:'4.8K'},
  {id:'hub',name:'COMMUNITY HUB',x:79,y:27,color:'#a78bfa',live:false,creator:'COMMUNITY',viewers:'—'},
  {id:'grind',name:'NIGHT GRIND',x:28,y:70,color:'#fbbf24',live:false,creator:'NIGHT GRIND',viewers:'—'},
  {id:'studio',name:'STREAM STUDIO',x:64,y:68,color:'#34d399',live:true,creator:'STREAM LAB',viewers:'7.1K'},
]

function Character({color,live}){return <div className="relative h-32 w-28">
  <div className="absolute bottom-0 left-1/2 h-4 w-24 -translate-x-1/2 rounded-full bg-black/60 blur-[5px]"/>
  <div className="absolute bottom-3 left-1/2 h-16 w-12 -translate-x-1/2 rounded-[18px] border border-white/10 bg-gradient-to-b from-slate-500 to-slate-900 shadow-[0_12px_28px_rgba(0,0,0,.7)]"/>
  <div className="absolute bottom-14 left-1/2 h-12 w-11 -translate-x-1/2 rounded-[15px] border border-black/40 bg-[#d7a27c] shadow-lg">
    <div className="absolute -top-2 left-[-2px] h-6 w-12 rounded-t-[16px] bg-[#161b27]"/>
    <div className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-[#111827]"/><div className="absolute right-2 top-5 h-1.5 w-1.5 rounded-full bg-[#111827]"/>
    <div className="absolute left-1/2 top-8 h-1 w-3 -translate-x-1/2 rounded-full bg-[#9b5e52]"/>
  </div>
  <div className="absolute bottom-1 left-1/2 h-3 w-16 -translate-x-1/2 rounded-full border border-white/10" style={{background:color+'aa'}}/>
  {live&&<div className="absolute right-1 top-0 flex items-center gap-1 rounded-full border border-red-400/30 bg-red-500/15 px-2 py-1 text-[8px] font-black tracking-widest text-red-300"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400"/>LIVE</div>}
</div>}

function Desk({color}){return <div className="absolute left-1/2 top-14 h-28 w-52 -translate-x-1/2">
  <div className="absolute left-8 top-0 h-16 w-36 rounded-lg border border-white/10 bg-[#090d15] shadow-[0_16px_30px_rgba(0,0,0,.55)]">
    <div className="absolute inset-2 rounded-md border border-white/5 bg-[#05070b]"><div className="absolute inset-x-3 top-3 h-1 rounded-full" style={{background:color}}/><div className="absolute left-3 top-7 h-1 w-20 rounded bg-white/10"/><div className="absolute left-3 top-11 h-1 w-12 rounded bg-white/5"/><div className="absolute bottom-3 right-3 h-2 w-2 animate-pulse rounded-full" style={{background:color,boxShadow:`0 0 12px ${color}`}}/></div>
    <div className="absolute left-1/2 top-full h-8 w-3 -translate-x-1/2 bg-slate-700"/>
  </div>
  <div className="absolute left-2 top-24 h-4 w-48 rounded-lg border border-white/10 bg-gradient-to-b from-slate-700 to-slate-900"/><div className="absolute right-0 top-14 h-9 w-12 rounded-md border border-white/10 bg-[#121722]"/><div className="absolute left-20 top-22 h-3 w-9 rounded bg-black"/>
</div>}

function Room({room,selected,onSelect}){return <button type="button" onClick={()=>onSelect(room)} className={`absolute -translate-x-1/2 -translate-y-1/2 text-left transition duration-300 hover:scale-[1.035] ${selected?'z-30':'z-10'}`} style={{left:`${room.x}%`,top:`${room.y}%`}}>
  <div className="relative h-52 w-64">
    <div className="absolute inset-3 rounded-[28px] border border-white/[.08] bg-[#0b1019]/90 shadow-[0_24px_70px_rgba(0,0,0,.55)]"/>
    <div className="absolute left-7 top-7 h-36 w-50 rounded-[22px] border border-white/[.06] bg-[linear-gradient(135deg,#141b28,#080b11)]"/>
    <div className="absolute left-7 top-7 h-36 w-50 rounded-[22px] opacity-30" style={{background:`radial-gradient(circle at 50% 20%, ${room.color} 0, transparent 55%)`}}/>
    <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-full border px-3 py-1 text-[8px] font-black tracking-[.22em] text-white" style={{borderColor:room.color+'66',background:'#080b11e8'}}>{room.name}</div>
    <Desk color={room.color}/><div className="absolute left-1/2 top-20 -translate-x-1/2"><Character color={room.color} live={room.live}/></div>
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[8px] font-bold tracking-wider text-neutral-400">{room.creator}</div>
    {room.live&&<div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[8px] font-bold text-red-300">{room.viewers} WATCHING</div>}
  </div>
</button>}

export default function AdminWorldPreviewPage(){
  const [selected,setSelected]=useState(null)
  const [mode,setMode]=useState('world')
  const liveCount=rooms.filter(x=>x.live).length
  return <AdminLayout><div className="min-h-[calc(100vh-120px)] overflow-hidden rounded-[28px] border border-white/[.08] bg-[#05070b] shadow-2xl">
    <div className="relative h-[760px] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#1a2030_0,#0b0f18_35%,#05070b_72%)]">
      <div className="absolute inset-0 opacity-25" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
      <div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,transparent,#05070b)]"/>
      <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center"><div className="text-[9px] font-black tracking-[.45em] text-neutral-500">VALO COMMUNITY // WORLD 01</div><h1 className="mt-2 font-display text-2xl font-black tracking-wider text-white">CREATOR DISTRICT</h1></div>
      <div className="absolute left-5 top-5 flex gap-2"><div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 backdrop-blur"><div className="text-[8px] tracking-widest text-neutral-500">LIVE</div><div className="text-lg font-black text-white">{liveCount}</div></div><div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 backdrop-blur"><div className="text-[8px] tracking-widest text-neutral-500">WORLD</div><div className="text-lg font-black text-emerald-400">ONLINE</div></div></div>
      <div className="absolute right-5 top-5 flex gap-1 rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur">{['world','rooms'].map(x=><button key={x} onClick={()=>setMode(x)} className={`rounded-lg px-3 py-2 text-[9px] font-black uppercase tracking-wider ${mode===x?'bg-white/10 text-white':'text-neutral-500'}`}>{x}</button>)}</div>
      {rooms.map(room=><Room key={room.id} room={room} selected={selected?.id===room.id} onSelect={setSelected}/>)}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-2xl border border-white/10 bg-black/65 px-5 py-3 text-center backdrop-blur-xl"><div className="text-[8px] font-black tracking-[.3em] text-neutral-500">COMMUNITY PLAZA</div><div className="mt-1 text-[10px] font-bold tracking-widest text-white">LEADERBOARD · EVENTS · PREDICTIONS</div></div>
      {selected&&<div className="absolute right-5 top-24 z-50 w-72 rounded-2xl border border-white/10 bg-[#080b11]/95 p-5 shadow-2xl backdrop-blur-xl"><div className="flex items-start justify-between"><div><div className="text-[8px] tracking-[.2em] text-neutral-500">CREATOR ROOM</div><div className="mt-2 font-display text-lg font-black text-white">{selected.creator}</div></div><button onClick={()=>setSelected(null)} className="text-xl text-neutral-500 hover:text-white">×</button></div><div className="mt-5 grid grid-cols-2 gap-2">{[['STATUS',selected.live?'LIVE':'OFFLINE'],['VIEWERS',selected.viewers],['ROOM',selected.name],['WORLD','01']].map(([a,b])=><div key={a} className="rounded-xl border border-white/5 bg-white/[.03] p-3"><div className="text-[7px] tracking-widest text-neutral-600">{a}</div><div className="mt-1 text-[10px] font-bold text-white">{b}</div></div>)}</div>{selected.live&&<button className="mt-3 w-full rounded-xl bg-[#ff4655] py-3 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_25px_rgba(255,70,85,.25)]">OPEN LIVE STREAM</button>}</div>}
    </div>
  </div></AdminLayout>
}