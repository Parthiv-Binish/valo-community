import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import MediaUploader from '../components/common/MediaUploader'
import Icon from '../components/common/Icon'

export default function CreatePostPage(){
 const{user}=useAuth();const nav=useNavigate()
 const[profile,setProfile]=useState(null);const[content,setContent]=useState('');const[media,setMedia]=useState(null);const[busy,setBusy]=useState(false);const[error,setError]=useState('')
 useEffect(()=>{if(user)supabase.rpc('get_public_profiles',{p_ids:[user.id]}).then(({data})=>setProfile(data?.[0]||null))},[user?.id])

 if(!user)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><Icon name="user" size={30} className="mx-auto text-[#ff4655]"/><h1 className="mt-4 font-display text-2xl font-black uppercase text-white">Sign in to post</h1><p className="mt-2 text-sm text-neutral-500">Join the community to share clips and start conversations.</p></div></MainLayout>

 async function submit(e){
  e.preventDefault();setError('')
  if(!content.trim()&&!media)return
  setBusy(true)
  const{data,error:insertError}=await supabase.from('posts').insert({author_id:user.id,content:content.trim()||'Shared media',media_url:media?.url||null,media_type:media?.type||null}).select('id').single()
  if(insertError){setError(insertError.message);setBusy(false);return}
  setBusy(false);nav('/posts/'+data.id)
 }
 const name=profile?.display_name||'Player'
 return <MainLayout><div className="mx-auto max-w-2xl">
  <div className="mb-5 flex items-center justify-between"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#ff4655]">COMMUNITY / COMPOSE</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Create post</h1></div><button onClick={()=>nav(-1)} aria-label="Cancel" title="Cancel" className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-neutral-400 hover:text-white"><Icon name="close" size={17}/></button></div>
  <form onSubmit={submit} className="overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d0d12] shadow-2xl">
   <div className="p-5 sm:p-6">
    <div className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] p-[1px]">{profile?.avatar_url?<img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover"/>:<div className="flex h-full w-full items-center justify-center rounded-full bg-[#101015] text-xs font-black text-white">{name.slice(0,2).toUpperCase()}</div>}</div><div><div className="text-sm font-bold text-white">{name}</div><Link to="/profile" className="text-[11px] text-[#ff4655] hover:underline">View profile</Link></div></div>
    <textarea autoFocus value={content} onChange={e=>setContent(e.target.value)} maxLength={5000} rows={8} placeholder="Share a clip, lineup, rank-up, hot take, tournament moment..." className="mt-5 w-full resize-none bg-transparent text-base leading-7 text-white outline-none placeholder:text-neutral-600"/>
    <MediaUploader userId={user.id} value={media} onChange={setMedia}/>
    <p className="mt-2 text-[10px] text-neutral-600">Posts are public. Only upload media you have permission to share.</p>
    {error&&<p className="mt-3 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</p>}
   </div>
   <div className="flex items-center justify-between border-t border-white/[.07] bg-white/[.015] px-5 py-4"><span className={`text-[11px] ${content.length>4800?'text-[#ff4655]':'text-neutral-600'}`}>{content.length}/5000</span><button disabled={busy||(!content.trim()&&!media)} className="rounded-xl bg-[#ff4655] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white disabled:opacity-40">{busy?'Publishing...':'Publish'}</button></div>
  </form>
 </div></MainLayout>
}