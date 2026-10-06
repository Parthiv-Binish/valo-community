import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
export default function NotificationsPage(){
 const{user}=useAuth();const[data,setData]=useState([]);const[loading,setLoading]=useState(true)
 async function load(){if(!user)return;setLoading(true);const{data:rows,error}=await supabase.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100);if(error)console.error(error);setData(rows||[]);setLoading(false)}
 useEffect(()=>{load()},[user?.id])
 async function markAll(){await supabase.from('notifications').update({is_read:true}).eq('user_id',user.id).eq('is_read',false);load()}
 async function open(n){if(!n.is_read)await supabase.from('notifications').update({is_read:true}).eq('id',n.id);if(n.link)window.location.href=n.link;else load()}
 return <MainLayout><div className="mx-auto max-w-3xl"><div className="flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#00e5ff]">ACTIVITY CENTER</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Notifications</h1></div><button onClick={markAll} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase text-neutral-400 hover:text-white">Mark all read</button></div><div className="mt-6 space-y-2">{loading&&<p className="text-sm text-neutral-600">Loading...</p>}{!loading&&!data.length&&<div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-neutral-600">You're all caught up.</div>}{data.map(n=><button key={n.id} onClick={()=>open(n)} className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition ${n.is_read?'border-white/[.06] bg-[#0d0d12]':'border-[#ff4655]/20 bg-[#ff4655]/[.045]'}`}><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${n.is_read?'bg-white/10':'bg-[#ff4655] shadow-[0_0_10px_rgba(255,70,85,.7)]'}`}/><span className="min-w-0 flex-1"><span className="block font-bold text-white">{n.title||'Community activity'}</span><span className="mt-1 block text-sm leading-6 text-neutral-400">{n.body}</span><span className="mt-2 block text-[10px] text-neutral-600">{new Date(n.created_at).toLocaleString()}</span></span></button>)}</div></div></MainLayout>
}
