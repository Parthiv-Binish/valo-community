import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Icon from '../common/Icon'

export default function BottomBar(){
 const{user}=useAuth();const[unread,setUnread]=useState(0)
 useEffect(()=>{if(!user){setUnread(0);return}let active=true;supabase.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('is_read',false).then(({count})=>{if(active)setUnread(count||0)});return()=>{active=false}},[user?.id])
 const tabs=[
  {to:'/',label:'Live',icon:'eye'},
  {to:user?'/following':'/posts',label:'Following',icon:'users'},
  {to:user?'/subscriptions':'/posts',label:'Streamer Subs',icon:'bookmark'},
  {to:user?'/notifications':'/posts',label:'Alerts',icon:'bell'},
  {to:user?'/profile':'/posts',label:'Profile',icon:'user'}
]
 return <div className="safe-bottom fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 lg:hidden"><div className="mx-auto max-w-[560px] rounded-2xl border border-white/[.08] bg-[#070707]/96 shadow-[0_-18px_50px_rgba(0,0,0,.55)] backdrop-blur-2xl"><div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/60 to-transparent"/><nav className="grid h-[68px] grid-cols-5">{tabs.map(x=><NavLink key={x.label} to={x.to} className={({isActive})=>`relative flex flex-col items-center justify-center gap-1 ${isActive&&true?'text-[#ff4655]':'text-neutral-500'}`}><Icon name={x.icon} size={18}/><span className="font-mono text-[8px] font-bold uppercase tracking-[.1em]">{x.label}</span>{x.label==='Alerts'&&unread>0&&<span className="absolute right-5 top-2 min-w-4 rounded-full bg-[#ff4655] px-1 text-center text-[8px] font-black text-white">{unread>9?'9+':unread}</span>}</NavLink>)}</nav></div></div>
}