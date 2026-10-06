import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'

const iconFor={like:'heart',comment:'message',reply:'message',follow:'users',system:'bell'}

export default function NotificationsPage(){
 const{user}=useAuth();const nav=useNavigate();const[data,setData]=useState([]);const[loading,setLoading]=useState(true);const[error,setError]=useState('')
 async function load(){if(!user){setLoading(false);return}setLoading(true);const{data:rows,error:e}=await supabase.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100);if(e)setError(e.message);setData(rows||[]);setLoading(false)}
 useEffect(()=>{load()},[user?.id])
 async function markAll(){await supabase.from('notifications').update({is_read:true}).eq('user_id',user.id).eq('is_read',false);load()}
 async function open(n){if(!n.is_read)await supabase.from('notifications').update({is_read:true}).eq('id',n.id).eq('user_id',user.id);if(n.link)nav(n.link)}
 if(!user)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><Icon name="bell" size={28} className="mx-auto text-[#ff4655]"/><h1 className="mt-4 font-display text-2xl font-black uppercase text-white">Sign in to see notifications</h1></div></MainLayout>
 return <MainLayout><div className="mx-auto max-w-3xl"><div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#00e5ff]">ACTIVITY CENTER</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Notifications</h1></div><button onClick={markAll} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase text-neutral-400 hover:text-white">Mark all read</button></div>{error&&<div className="mt-4 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</div>}<div className="mt-6 space-y-2">{loading&&<p className="text-sm text-neutral-600">Loading activity…</p>}{!loading&&!data.length&&<div className="rounded-2xl border border-dashed border-white/10 p-12 text-center"><Icon name="bell" size={25} className="mx-auto text-neutral-700"/><p className="mt-3 text-sm text-neutral-600">You're all caught up.</p></div>}{data.map(n=><button key={n.id} onClick={()=>open(n)} className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition hover:border-white/15 ${n.is_read?'border-white/[.06] bg-[#0d0d12]':'border-[#ff4655]/20 bg-[#ff4655]/[.045]'}`}><span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.is_read?'bg-white/[.04] text-neutral-600':'bg-[#ff4655]/10 text-[#ff6674]'}`}><Icon name={iconFor[n.type]||'bell'} size={16}/></span><span className="min-w-0 flex-1"><span className="block font-bold text-white">{n.title||'Community activity'}</span><span className="mt-1 block text-sm leading-6 text-neutral-400">{n.body}</span><span className="mt-2 block text-[10px] text-neutral-600">{new Date(n.created_at).toLocaleString()}</span></span>{!n.is_read&&<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff4655]"/>}</button>)}</div></div></MainLayout>
}