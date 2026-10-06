import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'

function Avatar({profile}){const n=profile?.display_name||'Player';return profile?.avatar_url?<img src={profile.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover"/>:<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] text-[10px] font-black text-white">{n.slice(0,2).toUpperCase()}</div>}

function Media({post}){
 if(!post.media_url)return null
 const video=post.media_type==='video'||/\.(mp4|webm|mov)(\?|$)/i.test(post.media_url)
 return <div className="border-y border-white/[.06] bg-black">{video?<video src={post.media_url} controls playsInline preload="metadata" className="max-h-[620px] w-full object-contain"/>:<img src={post.media_url} alt="" loading="lazy" className="max-h-[620px] w-full object-contain"/>}</div>
}

function PostCard({post,profile,user,onRefresh}){
 const[liked,setLiked]=useState(false);const[saved,setSaved]=useState(false);const[menu,setMenu]=useState(false)
 useEffect(()=>{if(!user)return;Promise.all([supabase.from('post_likes').select('id').eq('post_id',post.id).eq('user_id',user.id).maybeSingle(),supabase.from('post_bookmarks').select('id').eq('post_id',post.id).eq('user_id',user.id).maybeSingle()]).then(([l,b])=>{setLiked(!!l.data);setSaved(!!b.data)})},[post.id,user?.id])
 async function like(){if(!user)return;const r=liked?await supabase.from('post_likes').delete().eq('post_id',post.id).eq('user_id',user.id):await supabase.from('post_likes').insert({post_id:post.id,user_id:user.id});if(!r.error){setLiked(!liked);onRefresh?.()}}
 async function save(){if(!user)return;const r=saved?await supabase.from('post_bookmarks').delete().eq('post_id',post.id).eq('user_id',user.id):await supabase.from('post_bookmarks').insert({post_id:post.id,user_id:user.id});if(!r.error)setSaved(!saved)}
 const name=profile?.display_name||'Player'
 return <article className="overflow-hidden rounded-[22px] border border-white/[.08] bg-[#0d0d12]">
  <div className="p-4 sm:p-5"><div className="flex items-center gap-3"><Link to={`/profile/${post.author_id}`}><Avatar profile={profile}/></Link><div className="min-w-0 flex-1"><Link to={`/profile/${post.author_id}`} className="text-sm font-bold text-white hover:text-[#ff4655]">{name}</Link><div className="text-[10px] text-neutral-600">{new Date(post.created_at).toLocaleString()}</div></div><div className="relative"><button onClick={()=>setMenu(v=>!v)} title="Post options" aria-label="Post options" className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="more" size={18}/></button>{menu&&<div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-white/10 bg-[#101015] p-1.5 shadow-2xl"><Link to={`/report?type=post&id=${post.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-neutral-300 hover:bg-white/[.05] hover:text-[#ff6674]"><Icon name="flag" size={14}/>Report post</Link>{user&&user.id!==post.author_id&&<button onClick={async()=>{if(window.confirm('Block this user?')){const{error}=await supabase.from('user_blocks').insert({blocker_id:user.id,blocked_id:post.author_id});if(error&&error.code!=='23505')alert(error.message);else onRefresh?.()}}} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-neutral-300 hover:bg-white/[.05] hover:text-[#ff6674]"><Icon name="ban" size={14}/>Block author</button>}</div>}</div></div><Link to={`/posts/${post.id}`} className="mt-4 block whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200 hover:text-white">{post.content}</Link></div>
  <Media post={post}/>
  <div className="flex items-center gap-1 p-3"><button onClick={like} disabled={!user} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${liked?'text-[#ff6674] bg-[#ff4655]/10':'text-neutral-500 hover:bg-white/[.04] hover:text-white'}`}><Icon name="heart" size={16}/>{post.like_count||0}</button><Link to={`/posts/${post.id}`} className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="message" size={16}/>{post.comment_count||0}</Link><button onClick={save} disabled={!user} title="Save post" aria-label="Save post" className={`ml-auto flex h-9 w-9 items-center justify-center rounded-xl ${saved?'text-white bg-white/10':'text-neutral-500 hover:bg-white/[.04] hover:text-white'}`}><Icon name="bookmark" size={16}/></button><button onClick={async()=>{const url=window.location.origin+'/posts/'+post.id;if(navigator.share){try{await navigator.share({url})}catch{}}else await navigator.clipboard?.writeText(url)}} title="Share post" aria-label="Share post" className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="share" size={16}/></button></div>
 </article>
}

export default function PostsPage(){
 const{user}=useAuth();const[posts,setPosts]=useState([]);const[profiles,setProfiles]=useState({});const[tab,setTab]=useState(user?'for-you':'latest');const[loading,setLoading]=useState(true);const[error,setError]=useState('')
 async function load(){
  setLoading(true);setError('')
  let query=supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at').eq('status','published').order('created_at',{ascending:false}).limit(50)
  if(user){
   const[{data:follows},{data:blocks}]=await Promise.all([supabase.from('user_follows').select('following_id').eq('follower_id',user.id),supabase.from('user_blocks').select('blocked_id').eq('blocker_id',user.id)])
   const followingIds=(follows||[]).map(x=>x.following_id);const blockedIds=(blocks||[]).map(x=>x.blocked_id)
   if(tab==='following')query=query.in('author_id',followingIds.length?followingIds:['00000000-0000-0000-0000-000000000000'])
   if(blockedIds.length)query=query.not('author_id','in',`(${blockedIds.join(',')})`)
  }
  const{data,error:e}=await query
  if(e){setError(e.message);setLoading(false);return}
  setPosts(data||[])
  const ids=[...new Set((data||[]).map(p=>p.author_id))];if(ids.length){const{data:ps}=await supabase.rpc('get_public_profiles',{p_ids:ids});setProfiles(Object.fromEntries((ps||[]).map(x=>[x.id,x])))}
  setLoading(false)
 }
 useEffect(()=>{load()},[user?.id,tab])
 const tabs=user?[['for-you','For You'],['following','Following'],['latest','Latest']]:[['latest','Latest']]
 return <MainLayout><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,680px)_280px]">
  <section><div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#ff4655]">COMMUNITY</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Feed</h1></div><Link to={user?'/posts/create':'/posts'} className="flex items-center gap-2 rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white"><Icon name="plus" size={15}/>Create</Link></div>
   <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-white/[.07] bg-white/[.02] p-1">{tabs.map(([key,label])=><button key={key} onClick={()=>setTab(key)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wider ${tab===key?'bg-white/[.08] text-white':'text-neutral-600 hover:text-neutral-300'}`}>{label}</button>)}</div>
   {error&&<div className="mb-4 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-4 text-xs text-[#ff6674]">{error}</div>}
   <div className="space-y-4">{loading&&[1,2,3].map(x=><div key={x} className="h-52 animate-pulse rounded-[22px] border border-white/[.06] bg-white/[.02]"/>)}{!loading&&!posts.length&&<div className="rounded-[22px] border border-dashed border-white/10 p-12 text-center"><Icon name={tab==='following'?'users':'message'} size={25} className="mx-auto text-neutral-700"/><h2 className="mt-4 font-display text-lg font-black uppercase text-white">{tab==='following'?'No followed creators yet':'No posts yet'}</h2><p className="mt-2 text-sm text-neutral-600">{tab==='following'?'Follow players from their profiles to build your feed.':'Be the first to start the conversation.'}</p></div>}{posts.map(p=><PostCard key={p.id} post={p} profile={profiles[p.author_id]} user={user} onRefresh={load}/>)}</div>
  </section>
  <aside className="hidden lg:block"><div className="sticky top-24 space-y-3"><div className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-5"><p className="font-mono text-[9px] tracking-[.2em] text-[#00e5ff]">SOCIAL</p><h2 className="mt-1 font-display text-lg font-black uppercase text-white">Your community</h2><div className="mt-4 space-y-1 text-sm"><Link to="/following" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="users" size={16}/>People you follow</Link><Link to="/bookmarks" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="bookmark" size={16}/>Saved posts</Link><Link to="/notifications" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="bell" size={16}/>Activity</Link></div></div><div className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-5"><p className="text-xs font-bold text-white">Keep it VALO.</p><p className="mt-1 text-xs leading-5 text-neutral-600">Share clips, strategies, tournament moments and useful discussion. Respect other players.</p><Link to="/community-guidelines" className="mt-3 inline-flex text-[10px] font-black uppercase text-[#ff4655]">Community guidelines <Icon name="arrow" size={13} className="ml-1"/></Link></div></div></aside>
 </div></MainLayout>
}