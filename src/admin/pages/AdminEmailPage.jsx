import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import Icon from '../../components/common/Icon'
import { apiGet, apiPost } from '../../lib/api'

export default function AdminEmailPage(){
 const [users,setUsers]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('')
 const [sendAll,setSendAll]=useState(true),[onlyLoggedIn,setOnlyLoggedIn]=useState(true),[selected,setSelected]=useState([])
 const [search,setSearch]=useState(''),[subject,setSubject]=useState(''),[message,setMessage]=useState(''),[sending,setSending]=useState(false),[result,setResult]=useState(null)
 async function load(){setLoading(true);setError('');try{const r=await apiGet('/api/admin/users?per_page=100');setUsers(r.users||[])}catch(e){setError(e.message)}finally{setLoading(false)}}
 useEffect(()=>{load()},[])
 const filtered=useMemo(()=>{const q=search.toLowerCase().trim();return users.filter(u=>{const p=u.profile||{};return !q||[u.email,p.display_name].some(v=>String(v||'').toLowerCase().includes(q))})},[users,search])
 function toggle(id){setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])}
 async function send(e){e.preventDefault();setError('');setResult(null);if(!subject.trim()||!message.trim())return setError('Subject and message are required.');if(!sendAll&&!selected.length)return setError('Select at least one recipient.');if(!window.confirm(sendAll?'Queue this email for '+(onlyLoggedIn?'all users who have signed in':'all registered users')+'?':'Queue this email for '+selected.length+' selected user(s)?'))return;setSending(true);try{const r=await apiPost('/api/admin/email',{subject:subject.trim(),message:message.trim(),send_to_all:sendAll,only_logged_in:onlyLoggedIn,user_ids:selected});setResult(r);setSubject('');setMessage('');setSelected([])}catch(e){setError(e.message)}finally{setSending(false)}}
 return <AdminLayout><div className="space-y-6">
  <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">ADMIN / COMMUNICATION</p><h1 className="mt-1 text-2xl font-display font-black uppercase text-white">Email users</h1><p className="mt-1 text-xs text-neutral-500">Send a community email through the existing delivery queue.</p></div>
  {error&&<div className="rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</div>}
  {result&&<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-400">Email queued for {result.recipient_count} recipient{result.recipient_count===1?'':'s'}.</div>}
  <form onSubmit={send} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
   <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[.015] p-5">
    <input required maxLength={200} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Email subject" className="w-full rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-neutral-600 focus:border-[#ff4655]/50"/>
    <textarea required maxLength={20000} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message…" rows={14} className="w-full resize-y rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-neutral-600 focus:border-[#ff4655]/50"/>
    <div className="flex items-center justify-between text-[10px] text-neutral-600"><span>Plain text · line breaks are preserved</span><span>{message.length}/20000</span></div>
    <button disabled={sending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff4655] py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-[#ff5967] disabled:opacity-40"><Icon name="mail" size={15}/>{sending?'Queueing…':'Queue email'}</button>
   </div>
   <div className="space-y-4">
    <div className="rounded-2xl border border-white/10 bg-white/[.015] p-4">
     <p className="text-[9px] font-mono uppercase tracking-[.2em] text-neutral-500">Recipients</p>
     <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] p-3"><input type="radio" checked={sendAll} onChange={()=>setSendAll(true)} className="accent-[#ff4655]"/><span><b className="block text-xs text-white">Everyone</b><small className="text-[10px] text-neutral-600">Send to registered users</small></span></label>
     {sendAll&&<label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] p-3"><input type="checkbox" checked={onlyLoggedIn} onChange={e=>setOnlyLoggedIn(e.target.checked)} className="accent-[#ff4655]"/><span><b className="block text-xs text-white">Only users who have logged in</b><small className="text-[10px] text-neutral-600">Recommended for community announcements</small></span></label>}
     <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[.02] p-3"><input type="radio" checked={!sendAll} onChange={()=>setSendAll(false)} className="accent-[#ff4655]"/><span><b className="block text-xs text-white">Selected users</b><small className="text-[10px] text-neutral-600">{selected.length} selected</small></span></label>
    </div>
    {!sendAll&&<div className="rounded-2xl border border-white/10 bg-white/[.015] p-4"><div className="relative"><Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search users" className="w-full rounded-xl border border-white/10 bg-white/[.03] py-2.5 pl-9 pr-3 text-xs text-white outline-none"/></div><div className="mt-3 max-h-72 space-y-1 overflow-y-auto">{loading?<p className="p-4 text-center text-xs text-neutral-600">Loading users…</p>:filtered.map(u=>{const p=u.profile||{};const checked=selected.includes(u.id);return <button type="button" key={u.id} onClick={()=>toggle(u.id)} className={'flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-white/[.04] '+(checked?'bg-[#ff4655]/10':'')}><span className={'flex h-4 w-4 items-center justify-center rounded border text-[9px] '+(checked?'border-[#ff4655] bg-[#ff4655] text-white':'border-white/15 text-transparent')}>✓</span><span className="min-w-0"><b className="block truncate text-xs text-white">{p.display_name||u.email}</b><small className="block truncate text-[10px] text-neutral-600">{u.email}</small></span></button>})}</div></div>}
   </div>
  </form>
 </div></AdminLayout>
}
