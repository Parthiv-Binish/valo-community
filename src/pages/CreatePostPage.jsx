import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function CreatePostPage(){
 const{user}=useAuth();const nav=useNavigate();const fileRef=useRef(null)
 const[profile,setProfile]=useState(null);const[content,setContent]=useState('');const[mediaUrl,setMediaUrl]=useState('');const[mediaType,setMediaType]=useState('image');const[busy,setBusy]=useState(false)
 useEffect(()=>{if(!user)return;supabase.rpc('get_public_profiles',{p_ids:[user.id]}).then(({data})=>setProfile(data?.[0]||null))},[user?.id])
 if(!user)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="font-display text-2xl font-black uppercase text-white">Sign in to post</h1><p className="mt-2 text-sm text-neutral-500">Join the community to share clips and start conversations.</p></div></MainLayout>
 async function submit(e){e.preventDefault();if(!content.trim()&&!mediaUrl.trim())return;setBusy(true);const{data,error}=await supabase.from('posts').insert({author_id:user.id,content:content.trim(),media_url:mediaUrl.trim()||null,media_type:mediaUrl.trim()?mediaType:null}).select('id').single();setBusy(false);if(error){alert(error.message);return}nav('/posts/'+data.id)}
 const name=profile?.display_name||'Player'
 return <MainLayout><div className="mx-auto max-w-2xl">
  <div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#ff4655]">COMMUNITY / COMPOSE</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Create post</h1></div><button onClick={()=>nav(-1)} className="rounded-xl border border-white/10 px-3 py-2 text-[10px] font-black uppercase text-neutral-400">Cancel</button></div>
  <form onSubmit={submit} className="overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d0d12] shadow-2xl">
   <div className="p-5 sm:p-6">
    <div className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] p-[1px]">{profile?.avatar_url?<img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover"/>:<div className="flex h-full w-full items-center justify-center rounded-full bg-[#101015] text-xs font-black text-white">{name.slice(0,2).toUpperCase()}</div>}</div><div><div className="text-sm font-bold text-white">{name}</div><Link to="/profile" className="text-[11px] text-[#ff4655] hover:underline">View profile</Link></div></div>
    <textarea autoFocus value={content} onChange={e=>setContent(e.target.value)} maxLength={5000} rows={9} placeholder="Share a clip, lineup, rank-up, hot take, tournament moment..." className="mt-5 w-full resize-none bg-transparent text-base leading-7 text-white outline-none placeholder:text-neutral-600"/>
    {mediaUrl&&<div className="relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">{mediaType==='video'?<video src={mediaUrl} controls className="max-h-96 w-full object-contain"/>:<img src={mediaUrl} alt="" className="max-h-96 w-full object-contain"/>}</div>}
    <div className="mt-5 rounded-2xl border border-white/[.07] bg-white/[.025] p-3"><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={()=>fileRef.current?.focus()} className="rounded-xl px-3 py-2 text-xs font-bold text-neutral-300 hover:bg-white/5">＋ Add media</button><input ref={fileRef} type="url" value={mediaUrl} onChange={e=>setMediaUrl(e.target.value)} placeholder="Paste image/video URL" className="min-w-[220px] flex-1 rounded-xl bg-black/20 px-3 py-2 text-xs text-white outline-none placeholder:text-neutral-600"/><select value={mediaType} onChange={e=>setMediaType(e.target.value)} className="rounded-xl bg-[#17171d] px-3 py-2 text-xs text-neutral-300 outline-none"><option value="image">Image</option><option value="video">Video</option></select></div><p className="mt-2 px-1 text-[10px] text-neutral-600">Paste a public media URL. Native uploads should be connected to Storage before enabling file uploads.</p></div>
   </div>
   <div className="flex items-center justify-between border-t border-white/[.07] bg-white/[.015] px-5 py-4"><span className={`text-[11px] ${content.length>4800?'text-[#ff4655]':'text-neutral-600'}`}>{content.length}/5000</span><button disabled={busy||(!content.trim()&&!mediaUrl.trim())} className="rounded-xl bg-[#ff4655] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-40">{busy?'Publishing...':'Publish'}</button></div>
  </form>
 </div></MainLayout>
}