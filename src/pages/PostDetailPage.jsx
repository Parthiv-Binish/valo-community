import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function PostDetailPage() {
  const { id } = useParams(); const { user } = useAuth(); const nav = useNavigate(); const [params] = useSearchParams()
  const [post,setPost]=useState(null); const [comments,setComments]=useState([]); const [profiles,setProfiles]=useState({})
  const [comment,setComment]=useState(''); const [liked,setLiked]=useState(false); const [saved,setSaved]=useState(false); const [editing,setEditing]=useState(params.get('edit')==='1'); const [editContent,setEditContent]=useState(''); const [busy,setBusy]=useState(false); const [loading,setLoading]=useState(true)

  async function load(){
    setLoading(true)
    const [{data:p,error:pe},{data:cs,error:ce}]=await Promise.all([
      supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at,updated_at').eq('id',id).single(),
      supabase.from('post_comments').select('id,author_id,content,created_at,updated_at').eq('post_id',id).eq('status','published').order('created_at',{ascending:true})
    ])
    if(pe)console.error(pe);if(ce)console.error(ce)
    setPost(p);setEditContent(p?.content||'');setComments(cs||[])
    const ids=[...new Set([p?.author_id,...(cs||[]).map(c=>c.author_id)].filter(Boolean))]
    if(ids.length){const{data:ps}=await supabase.rpc('get_public_profiles',{p_ids:ids});setProfiles(Object.fromEntries((ps||[]).map(x=>[x.id,x])))}
    if(user&&p){const[{data:l},{data:b}]=await Promise.all([supabase.from('post_likes').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle(),supabase.from('post_bookmarks').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle()]);setLiked(!!l);setSaved(!!b)}
    setLoading(false)
  }
  useEffect(()=>{load()},[id,user?.id])

  async function toggleLike(){if(!user)return;const r=liked?await supabase.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_likes').insert({post_id:id,user_id:user.id});if(!r.error)setLiked(!liked);load()}
  async function toggleSave(){if(!user)return;const r=saved?await supabase.from('post_bookmarks').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_bookmarks').insert({post_id:id,user_id:user.id});if(!r.error)setSaved(!saved)}
  async function saveEdit(){if(!user||post.author_id!==user.id)return;setBusy(true);const{error}=await supabase.from('posts').update({content:editContent.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('author_id',user.id);setBusy(false);if(error)return alert(error.message);setEditing(false);load()}
  async function deletePost(){if(!user||post.author_id!==user.id)return;if(!window.confirm('Delete this post permanently?'))return;setBusy(true);const{error}=await supabase.from('posts').delete().eq('id',id).eq('author_id',user.id);setBusy(false);if(error)return alert(error.message);nav('/posts')}
  async function submitComment(e){e.preventDefault();if(!user||!comment.trim())return;const{error}=await supabase.from('post_comments').insert({post_id:id,author_id:user.id,content:comment.trim()});if(error)return alert(error.message);setComment('');load()}
  async function deleteComment(commentId){if(!user)return;if(!window.confirm('Delete this comment?'))return;const{error}=await supabase.from('post_comments').delete().eq('id',commentId).eq('author_id',user.id);if(error)alert(error.message);else load()}
  async function editComment(c){if(!user||c.author_id!==user.id)return;const next=window.prompt('Edit comment',c.content);if(next===null||!next.trim())return;const{error}=await supabase.from('post_comments').update({content:next.trim(),updated_at:new Date().toISOString()}).eq('id',c.id).eq('author_id',user.id);if(error)alert(error.message);else load()}

  if(loading)return <MainLayout><div className="mx-auto max-w-2xl py-20 text-center text-sm text-neutral-500">Loading post...</div></MainLayout>
  if(!post)return <MainLayout><div className="mx-auto max-w-2xl py-20 text-center"><h1 className="font-display text-2xl font-black uppercase text-white">Post not found</h1><Link to="/posts" className="mt-4 inline-block text-sm text-[#ff4655]">Back to community</Link></div></MainLayout>
  const author=profiles[post.author_id]; const authorName=author?.display_name||'Player'; const video=post.media_type==='video'||/\.(mp4|webm|mov)(\?|$)/i.test(post.media_url||'')
  return <MainLayout><div className="mx-auto max-w-2xl">
    <button onClick={()=>nav(-1)} className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white">← Back</button>
    <article className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0d0d12]">
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-3"><Link to={`/profile/${post.author_id}`} className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] p-[1px]">{author?.avatar_url?<img src={author.avatar_url} alt="" className="h-full w-full rounded-full object-cover"/>:<div className="flex h-full w-full items-center justify-center rounded-full bg-[#101015] text-xs font-black text-white">{authorName.slice(0,2).toUpperCase()}</div>}</Link><div className="min-w-0 flex-1"><Link to={`/profile/${post.author_id}`} className="text-sm font-bold text-white hover:text-[#ff4655]">{authorName}</Link><div className="text-[11px] text-neutral-600">{new Date(post.created_at).toLocaleString()}</div></div>{user?.id===post.author_id&&<div className="flex gap-2"><button onClick={()=>setEditing(v=>!v)} className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold text-neutral-300">{editing?'Cancel':'Edit'}</button><button onClick={deletePost} disabled={busy} className="rounded-lg border border-[#ff4655]/20 px-3 py-2 text-[10px] font-bold text-[#ff6674]">Delete</button></div>}</div>
        {editing?<div className="mt-5"><textarea value={editContent} onChange={e=>setEditContent(e.target.value)} maxLength={5000} rows={8} className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white outline-none"/><button onClick={saveEdit} disabled={busy||!editContent.trim()} className="mt-3 rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase">{busy?'Saving...':'Save changes'}</button></div>:<p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200">{post.content}</p>}
      </div>
      {post.media_url&&<div className="border-y border-white/[0.06] bg-black">{video?<video src={post.media_url} controls playsInline className="max-h-[650px] w-full object-contain"/>:<img src={post.media_url} alt="" className="max-h-[650px] w-full object-contain"/>}</div>}
      <div className="p-4 sm:p-5"><div className="flex items-center gap-2"><button onClick={toggleLike} disabled={!user} className={`rounded-xl px-4 py-2.5 text-xs font-bold ${liked?'bg-[#ff4655]/10 text-[#ff6674]':'bg-white/[0.04] text-neutral-300'}`}>{liked?'♥ Liked':'♡ Like'} · {post.like_count||0}</button><button onClick={toggleSave} disabled={!user} className={`rounded-xl px-4 py-2.5 text-xs font-bold ${saved?'bg-white/10 text-white':'bg-white/[0.04] text-neutral-300'}`}>{saved?'▣ Saved':'□ Save'}</button></div></div>
    </article>
    <section className="mt-5 rounded-[24px] border border-white/[0.08] bg-[#0d0d12] p-5 sm:p-6">
      <div className="flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.2em] text-[#00e5ff]">DISCUSSION</p><h2 className="mt-1 font-display text-xl font-black uppercase text-white">Comments</h2></div><span className="text-xs text-neutral-600">{comments.length}</span></div>
      {user&&<form onSubmit={submitComment} className="mt-5 flex gap-2"><input value={comment} onChange={e=>setComment(e.target.value)} maxLength={1000} placeholder="Join the conversation..." className="min-w-0 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none"/><button className="rounded-xl bg-[#ff4655] px-4 text-xs font-black uppercase">Send</button></form>}
      <div className="mt-5 space-y-3">{!comments.length&&<p className="py-6 text-center text-sm text-neutral-600">No comments yet. Start the conversation.</p>}{comments.map(c=>{const p=profiles[c.author_id];const n=p?.display_name||'Player';return <div key={c.id} className="flex gap-3 rounded-2xl bg-white/[0.025] p-3"><Link to={`/profile/${c.author_id}`} className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/[0.08]">{p?.avatar_url?<img src={p.avatar_url} alt="" className="h-full w-full object-cover"/>:<div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-neutral-300">{n.slice(0,2).toUpperCase()}</div>}</Link><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><Link to={`/profile/${c.author_id}`} className="text-[11px] font-bold text-neutral-300 hover:text-white">{n}</Link><span className="text-[10px] text-neutral-600">· {new Date(c.created_at).toLocaleDateString()}</span>{user?.id===c.author_id&&<><button onClick={()=>editComment(c)} className="ml-auto text-[10px] text-neutral-500 hover:text-white">Edit</button><button onClick={()=>deleteComment(c.id)} className="text-[10px] text-[#ff6674]">Delete</button></>}</div><p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-300">{c.content}</p></div></div>})}</div>
    </section>
  </div></MainLayout>
}