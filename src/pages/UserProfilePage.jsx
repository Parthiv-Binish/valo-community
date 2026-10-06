import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function UserProfilePage() {
 const { id } = useParams(); const { user } = useAuth()
 const [profile,setProfile]=useState(null); const [posts,setPosts]=useState([]); const [following,setFollowing]=useState(false); const [stats,setStats]=useState({posts:0,followers:0,following:0}); const [busy,setBusy]=useState(false); const [loading,setLoading]=useState(true)
 async function load(){
  setLoading(true)
  const [{data:pr},{data:ps},{count:followers},{count:followingCount}]=await Promise.all([
   supabase.rpc('get_public_profiles',{p_ids:[id]}),
   supabase.from('posts').select('id,content,created_at,like_count,comment_count').eq('author_id',id).eq('status','published').order('created_at',{ascending:false}).limit(12),
   supabase.from('user_follows').select('id',{count:'exact',head:true}).eq('following_id',id),
   supabase.from('user_follows').select('id',{count:'exact',head:true}).eq('follower_id',id)
  ])
  setProfile(pr?.[0]||null);setPosts(ps||[]);setStats({posts:ps?.length||0,followers:followers||0,following:followingCount||0})
  if(user&&user.id!==id){const{data}=await supabase.from('user_follows').select('id').eq('follower_id',user.id).eq('following_id',id).maybeSingle();setFollowing(!!data)}
  setLoading(false)
 }
 useEffect(()=>{load()},[id,user?.id])
 async function toggleFollow(){
  if(!user||user.id===id||busy)return
  setBusy(true)
  if(following) await supabase.from('user_follows').delete().eq('follower_id',user.id).eq('following_id',id)
  else await supabase.from('user_follows').insert({follower_id:user.id,following_id:id})
  setFollowing(!following);setBusy(false);load()
 }
 if(loading)return <MainLayout><div className="mx-auto max-w-4xl py-20 text-center text-sm text-neutral-600">Loading profile...</div></MainLayout>
 if(!profile)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="font-display text-2xl font-black uppercase text-white">Player not found</h1><Link to="/posts" className="mt-3 inline-block text-sm text-[#ff4655]">Back to community</Link></div></MainLayout>
 return <MainLayout><div className="mx-auto max-w-5xl">
  <div className="overflow-hidden rounded-[28px] border border-white/[.08] bg-[#0d0d12]">
   <div className="h-32 sm:h-44 bg-[radial-gradient(circle_at_15%_20%,rgba(255,70,85,.3),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(0,229,255,.18),transparent_35%)]"/>
   <div className="px-5 pb-6 sm:px-8"><div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
    {profile.avatar_url?<img src={profile.avatar_url} alt="" className="h-24 w-24 rounded-full object-cover ring-4 ring-[#0d0d12]"/>:<div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] text-2xl font-black text-white ring-4 ring-[#0d0d12]">{(profile.display_name||'V').slice(0,2).toUpperCase()}</div>}
    <div className="flex-1"><p className="font-mono text-[9px] tracking-[.2em] text-[#ff4655]">VALO COMMUNITY PLAYER</p><h1 className="mt-1 text-2xl font-display font-black text-white">{profile.display_name||'VALO Player'}</h1></div>
    {user&&user.id!==id&&<button onClick={toggleFollow} disabled={busy} className={`rounded-xl px-5 py-2.5 text-xs font-black uppercase ${following?'border border-white/10 bg-white/[.04] text-neutral-300':'bg-[#ff4655] text-white'}`}>{following?'Following':'Follow'}</button>}
   </div>
   {profile.bio&&<p className="mt-5 max-w-2xl text-sm leading-6 text-neutral-400">{profile.bio}</p>}
   <div className="mt-5 flex gap-7 border-t border-white/[.06] pt-5"><div><b className="text-white">{stats.posts}</b><span className="ml-2 text-[9px] font-mono uppercase text-neutral-600">Posts</span></div><div><b className="text-white">{stats.followers}</b><span className="ml-2 text-[9px] font-mono uppercase text-neutral-600">Followers</span></div><div><b className="text-white">{stats.following}</b><span className="ml-2 text-[9px] font-mono uppercase text-neutral-600">Following</span></div></div>
  </div></div>
  <div className="mt-5"><h2 className="mb-3 font-display text-xl font-black uppercase text-white">Posts</h2><div className="grid gap-3">{posts.map(x=><Link key={x.id} to={'/posts/'+x.id} className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-4 hover:border-white/15"><p className="line-clamp-4 text-sm leading-6 text-neutral-300">{x.content||'Media post'}</p><div className="mt-3 text-[10px] text-neutral-600">{x.like_count||0} likes · {x.comment_count||0} comments · {new Date(x.created_at).toLocaleDateString()}</div></Link>)}{!posts.length&&<div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-neutral-600">No public posts yet.</div>}</div></div>
 </div></MainLayout>
}
