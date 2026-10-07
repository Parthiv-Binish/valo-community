import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'
import PostMedia from '../components/common/PostMedia'

function Avatar({profile}){const n=profile?.display_name||profile?.email||'Player';return profile?.avatar_url?<img src={profile.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover"/>:<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] text-[10px] font-black text-white">{n.slice(0,2).toUpperCase()}</div>}

function Media({post,onDoubleLike}){ return <div onDoubleClick={onDoubleLike} className="select-none"><PostMedia url={post.media_url} mediaType={post.media_type}/></div> }

function LikeButton({liked,count,onClick,disabled}){return <button onClick={onClick} disabled={disabled} aria-label={liked?'Unlike post':'Like post'} className={`group relative flex items-center gap-1.5 px-1 py-1.5 text-sm transition ${liked?'text-[#ff3040]':'text-neutral-500 hover:text-white'}`}><Icon name="heart" size={24} fill={liked?'currentColor':'none'} strokeWidth={liked?1.4:1.8} className="transition-transform duration-150 group-active:scale-75"/><span className="text-xs font-semibold">{count||0}</span>{liked&&<span className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-[#ff3040]/10"/>}</button>}

function PostCard({post,profile,user,onRefresh,onPostCountDelta}){
 const[liked,setLiked]=useState(false);const[saved,setSaved]=useState(false);const[menu,setMenu]=useState(false)
 const[showComments,setShowComments]=useState(false);const[comments,setComments]=useState([]);const[comment,setComment]=useState('');const[replyTo,setReplyTo]=useState(null);const[commentBusy,setCommentBusy]=useState(false);const[commentProfiles,setCommentProfiles]=useState({})
 useEffect(()=>{if(!user)return;Promise.all([supabase.from('post_likes').select('id').eq('post_id',post.id).eq('user_id',user.id).maybeSingle(),supabase.from('post_bookmarks').select('id').eq('post_id',post.id).eq('user_id',user.id).maybeSingle()]).then(([l,b])=>{setLiked(!!l.data);setSaved(!!b.data)})},[post.id,user?.id])
 async function like(){if(!user)return;const r=liked?await supabase.from('post_likes').delete().eq('post_id',post.id).eq('user_id',user.id):await supabase.from('post_likes').insert({post_id:post.id,user_id:user.id});if(!r.error){const next=!liked;setLiked(next);onPostCountDelta?.(post.id,'like_count',next?1:-1)}}
 async function save(){if(!user)return;const r=saved?await supabase.from('post_bookmarks').delete().eq('post_id',post.id).eq('user_id',user.id):await supabase.from('post_bookmarks').insert({post_id:post.id,user_id:user.id});if(!r.error)setSaved(!saved)}
 async function loadComments(){const{data}=await supabase.from('post_comments').select('id,author_id,content,parent_comment_id,created_at').eq('post_id',post.id).eq('status','published').order('created_at',{ascending:true});const rows=data||[];setComments(rows);const ids=[...new Set(rows.map(x=>x.author_id))];if(ids.length){const{data:ps}=await supabase.rpc('get_public_profiles',{p_ids:ids});setCommentProfiles(Object.fromEntries((ps||[]).map(x=>[x.id,x])))}}
 async function toggleComments(){if(!showComments)await loadComments();setShowComments(v=>!v)}
 async function submitComment(e){e.preventDefault();if(!user||!comment.trim())return;setCommentBusy(true);const{error}=await supabase.from('post_comments').insert({post_id:post.id,author_id:user.id,parent_comment_id:replyTo?.id||null,content:comment.trim()});setCommentBusy(false);if(!error){setComment('');setReplyTo(null);await loadComments();onPostCountDelta?.(post.id,'comment_count',1)}}
 const roots=comments.filter(x=>!x.parent_comment_id)
 const children=comments.reduce((m,x)=>{if(x.parent_comment_id)(m[x.parent_comment_id]??=[]).push(x);return m},{})
 function Comment({c,depth=0}){const p=commentProfiles[c.author_id];return <div className={depth?'ml-7 border-l border-white/[.06] pl-2':''}><div className="flex gap-2"><Avatar profile={p}/><div className="min-w-0 flex-1 rounded-xl bg-white/[.025] px-3 py-2"><Link to={`/profile/${c.author_id}`} className="text-[10px] font-bold text-white hover:text-[#ff4655]">{p?.display_name||p?.email||'Player'}</Link><p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-neutral-300">{c.content}</p><button onClick={()=>setReplyTo(c)} className="mt-1 text-[9px] font-bold text-neutral-600 hover:text-white">Reply</button></div></div>{children[c.id]?.map(x=><Comment key={x.id} c={x} depth={depth+1}/>)}</div>}
 const name=profile?.display_name||profile?.email||'Player'
 return <article className="overflow-hidden border-b border-white/[.08] bg-[#0d0d12] sm:rounded-[18px] sm:border sm:border-white/[.08]">
  <div className="px-3 py-3 sm:px-4 sm:py-4"><div className="flex items-center gap-3"><Link to={`/profile/${post.author_id}`}><Avatar profile={profile}/></Link><div className="min-w-0 flex-1"><Link to={`/profile/${post.author_id}`} className="text-sm font-bold text-white hover:text-[#ff4655]">{name}</Link><div className="text-[10px] text-neutral-600">{new Date(post.created_at).toLocaleString()}</div></div><div className="relative"><button onClick={()=>setMenu(v=>!v)} title="Post options" aria-label="Post options" className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="more" size={18}/></button>{menu&&<div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-white/10 bg-[#101015] p-1.5 shadow-2xl"><Link to={`/report?type=post&id=${post.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-neutral-300 hover:bg-white/[.05] hover:text-[#ff6674]"><Icon name="flag" size={14}/>Report post</Link>{user&&user.id!==post.author_id&&<button onClick={async()=>{if(window.confirm('Block this user?')){const{error}=await supabase.from('user_blocks').insert({blocker_id:user.id,blocked_id:post.author_id});if(error&&error.code!=='23505')alert(error.message);else onRefresh?.()}}} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-neutral-300 hover:bg-white/[.05] hover:text-[#ff6674]"><Icon name="ban" size={14}/>Block author</button>}</div>}</div></div><Link to={`/posts/${post.id}`} className="mt-3 block whitespace-pre-wrap break-words text-[14px] leading-6 text-neutral-200 hover:text-white">{post.content}</Link></div>
  <Media post={post} onDoubleLike={()=>{if(!liked)like()}}/>
  <div className="flex items-center gap-1 px-3 py-2.5"><LikeButton liked={liked} count={post.like_count} onClick={like} disabled={!user}/><button onClick={toggleComments} className={showComments?'flex items-center gap-2 rounded-xl bg-white/[.05] px-3 py-2 text-xs font-bold text-white':'flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-neutral-500 hover:bg-white/[.04] hover:text-white'}><Icon name="message" size={16}/>{post.comment_count||0}</button><button onClick={save} disabled={!user} title="Save post" aria-label="Save post" className={saved?'ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white':'ml-auto flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-white/[.04] hover:text-white'}><Icon name="bookmark" size={16}/></button><button onClick={async()=>{const url=window.location.origin+'/posts/'+post.id;if(navigator.share){try{await navigator.share({url})}catch{}}else await navigator.clipboard?.writeText(url)}} title="Share post" aria-label="Share post" className="flex h-9 w-9 items-center justify-center rounded-xl text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="share" size={16}/></button></div>
  <div className="px-3 pb-3 sm:px-4">
   {post.comment_count>0&&<button onClick={toggleComments} className="mb-2 text-[11px] font-semibold text-neutral-500 hover:text-white">{showComments?'Hide comments':('View all '+post.comment_count+' comment'+(post.comment_count===1?'':'s'))}</button>}
   {showComments&&<div className="mb-3 space-y-2">{roots.slice(-2).map(c=><Comment key={c.id} c={c}/>)}</div>}
   {replyTo&&<div className="mb-2 flex items-center justify-between rounded-lg bg-white/[.03] px-3 py-2 text-[10px] text-neutral-500">Replying to <b className="text-white">{commentProfiles[replyTo.author_id]?.display_name||commentProfiles[replyTo.author_id]?.email||'Player'}</b><button onClick={()=>setReplyTo(null)} aria-label="Cancel reply"><Icon name="close" size={13}/></button></div>}
   {user?<form onSubmit={submitComment} className="flex items-center gap-2 border-t border-white/[.05] pt-3"><Avatar profile={profile}/><input value={comment} onChange={e=>setComment(e.target.value)} onFocus={()=>{if(!showComments)loadComments();setShowComments(true)}} placeholder={replyTo?'Reply…':'Add a comment…'} maxLength={2000} className="min-w-0 flex-1 bg-transparent px-1 py-2 text-xs text-white outline-none placeholder:text-neutral-600"/><button disabled={commentBusy||!comment.trim()} aria-label="Send comment" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#ff4655] disabled:opacity-30"><Icon name="send" size={15}/></button></form>:<Link to="/login" className="block border-t border-white/[.05] pt-3 text-[11px] text-neutral-600 hover:text-white">Sign in to comment</Link>}
   <Link to={'/posts/'+post.id} className="mt-2 block text-[10px] font-semibold text-neutral-600 hover:text-white">Open full discussion</Link>
  </div>
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
 useEffect(()=>{
  const channel=supabase.channel('community-posts')
   .on('postgres_changes',{event:'UPDATE',schema:'public',table:'posts'},payload=>{
    setPosts(current=>current.map(p=>p.id===payload.new.id?{...p,...payload.new}:p))
   })
   .subscribe()
  return()=>{supabase.removeChannel(channel)}
 },[])
 function updatePostCount(postId,field,delta){setPosts(current=>current.map(p=>p.id===postId?{...p,[field]:Math.max(0,(p[field]||0)+delta)}:p))}
 const tabs=user?[['for-you','For You'],['following','Following'],['latest','Latest']]:[['latest','Latest']]
 return <MainLayout><div className="mx-auto grid max-w-[1100px] gap-8 lg:grid-cols-[minmax(0,640px)_280px]">
  <section className="min-w-0"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="font-mono text-[10px] tracking-[.25em] text-[#ff4655]">COMMUNITY</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Feed</h1></div><Link to={user?'/posts/create':'/posts'} className="flex items-center gap-2 rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white"><Icon name="plus" size={15}/>Create</Link></div>
   <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl border border-white/[.07] bg-white/[.02] p-1">{tabs.map(([key,label])=><button key={key} onClick={()=>setTab(key)} className={`whitespace-nowrap rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-wider ${tab===key?'bg-white/[.08] text-white':'text-neutral-600 hover:text-neutral-300'}`}>{label}</button>)}</div>
   {error&&<div className="mb-4 rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-4 text-xs text-[#ff6674]">{error}</div>}
   <div className="space-y-3 sm:space-y-4">{loading&&[1,2,3].map(x=><div key={x} className="h-52 animate-pulse rounded-[22px] border border-white/[.06] bg-white/[.02]"/>)}{!loading&&!posts.length&&<div className="rounded-[22px] border border-dashed border-white/10 p-12 text-center"><Icon name={tab==='following'?'users':'message'} size={25} className="mx-auto text-neutral-700"/><h2 className="mt-4 font-display text-lg font-black uppercase text-white">{tab==='following'?'No followed creators yet':'No posts yet'}</h2><p className="mt-2 text-sm text-neutral-600">{tab==='following'?'Follow players from their profiles to build your feed.':'Be the first to start the conversation.'}</p></div>}{posts.map(p=><PostCard key={p.id} post={p} profile={profiles[p.author_id]} user={user} onRefresh={load} onPostCountDelta={updatePostCount}/>)}</div>
  </section>
  <aside className="hidden lg:block"><div className="sticky top-24 space-y-3"><div className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-5"><p className="font-mono text-[9px] tracking-[.2em] text-[#00e5ff]">SOCIAL</p><h2 className="mt-1 font-display text-lg font-black uppercase text-white">Your community</h2><div className="mt-4 space-y-1 text-sm"><Link to="/following" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="users" size={16}/>People you follow</Link><Link to="/bookmarks" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="bookmark" size={16}/>Saved posts</Link><Link to="/notifications" className="flex items-center gap-3 rounded-xl px-3 py-3 text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="bell" size={16}/>Activity</Link></div></div><div className="rounded-2xl border border-white/[.07] bg-[#0d0d12] p-5"><p className="text-xs font-bold text-white">Keep it VALO.</p><p className="mt-1 text-xs leading-5 text-neutral-600">Share clips, strategies, tournament moments and useful discussion. Respect other players.</p><Link to="/community-guidelines" className="mt-3 inline-flex text-[10px] font-black uppercase text-[#ff4655]">Community guidelines <Icon name="arrow" size={13} className="ml-1"/></Link></div></div></aside>
 </div></MainLayout>
}