import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'

function Avatar({profile,size='sm'}){
 const name=profile?.display_name||'Player';const cls=size==='lg'?'h-11 w-11':'h-8 w-8'
 return profile?.avatar_url?<img src={profile.avatar_url} alt="" className={`${cls} shrink-0 rounded-full object-cover ring-1 ring-white/10`}/>:<div className={`${cls} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] text-[10px] font-black text-white`}>{name.slice(0,2).toUpperCase()}</div>
}

export default function PostDetailPage(){
 const{id}=useParams();const{user}=useAuth();const nav=useNavigate()
 const[post,setPost]=useState(null);const[comments,setComments]=useState([]);const[profiles,setProfiles]=useState({});const[liked,setLiked]=useState(false);const[saved,setSaved]=useState(false);const[comment,setComment]=useState('');const[replyTo,setReplyTo]=useState(null);const[editing,setEditing]=useState(false);const[editContent,setEditContent]=useState('');const[busy,setBusy]=useState(false);const[loading,setLoading]=useState(true);const[error,setError]=useState('')

 async function load(){
  setLoading(true);setError('')
  const [{data:p,error:pe},{data:cs,error:ce}]=await Promise.all([
   supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at,updated_at,status').eq('id',id).eq('status','published').single(),
   supabase.from('post_comments').select('id,post_id,parent_comment_id,author_id,content,created_at,updated_at').eq('post_id',id).eq('status','published').order('created_at',{ascending:true})
  ])
  if(pe){setError(pe.message);setLoading(false);return}
  setPost(p);setEditContent(p?.content||'');setComments(cs||[])
  const ids=[...new Set([p?.author_id,...(cs||[]).map(c=>c.author_id)].filter(Boolean))]
  if(ids.length){const{data:ps}=await supabase.rpc('get_public_profiles',{p_ids:ids});setProfiles(Object.fromEntries((ps||[]).map(x=>[x.id,x])))}
  if(user&&p){const[{data:l},{data:b}]=await Promise.all([supabase.from('post_likes').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle(),supabase.from('post_bookmarks').select('id').eq('post_id',id).eq('user_id',user.id).maybeSingle()]);setLiked(!!l);setSaved(!!b)}
  setLoading(false)
 }
 useEffect(()=>{load()},[id,user?.id])

 const roots=useMemo(()=>comments.filter(c=>!c.parent_comment_id),[comments])
 const replies=useMemo(()=>comments.reduce((m,c)=>{if(c.parent_comment_id)(m[c.parent_comment_id]??=[]).push(c);return m},{}),[comments])

 async function toggleLike(){if(!user||busy)return;setBusy(true);const r=liked?await supabase.from('post_likes').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_likes').insert({post_id:id,user_id:user.id});if(!r.error)setLiked(!liked);setBusy(false);load()}
 async function toggleSave(){if(!user)return;const r=saved?await supabase.from('post_bookmarks').delete().eq('post_id',id).eq('user_id',user.id):await supabase.from('post_bookmarks').insert({post_id:id,user_id:user.id});if(!r.error)setSaved(!saved)}
 async function saveEdit(){if(!user||post.author_id!==user.id||!editContent.trim())return;setBusy(true);const{error:e}=await supabase.from('posts').update({content:editContent.trim(),updated_at:new Date().toISOString()}).eq('id',id).eq('author_id',user.id);setBusy(false);if(e){setError(e.message);return}setEditing(false);load()}
 async function deletePost(){if(!user||post.author_id!==user.id)return;if(!window.confirm('Delete this post?'))return;const{error:e}=await supabase.from('posts').delete().eq('id',id).eq('author_id',user.id);if(e)setError(e.message);else nav('/posts')}
 async function submitComment(e){e.preventDefault();if(!user||!comment.trim())return;setBusy(true);const payload={post_id:id,author_id:user.id,content:comment.trim(),parent_comment_id:replyTo?.id||null};const{error:ce}=await supabase.from('post_comments').insert(payload);setBusy(false);if(ce){setError(ce.message);return}setComment('');setReplyTo(null);load()}
 async function deleteComment(c){if(!user||c.author_id!==user.id)return;if(!window.confirm('Delete this comment?'))return;const{error:e}=await supabase.from('post_comments').delete().eq('id',c.id).eq('author_id',user.id);if(e)setError(e.message);else load()}
 async function editComment(c){if(!user||c.author_id!==user.id)return;const next=window.prompt('Edit comment',c.content);if(next===null||!next.trim())return;const{error:e}=await supabase.from('post_comments').update({content:next.trim(),updated_at:new Date().toISOString()}).eq('id',c.id).eq('author_id',user.id);if(e)setError(e.message);else load()}
 async function share(){const url=window.location.origin+'/posts/'+id;if(navigator.share){try{await navigator.share({title:post.content?.slice(0,80)||'VALO Community post',url})}catch{}}else{await navigator.clipboard?.writeText(url);}}
 async function blockAuthor(){if(!user||user.id===post.author_id)return;if(!window.confirm('Block this user? Their content will no longer be shown to you.'))return;const{error:e}=await supabase.from('user_blocks').insert({blocker_id:user.id,blocked_id:post.author_id});if(e&&e.code!=='23505')setError(e.message);else nav('/posts')}

 function Comment({c,depth=0}){
  const p=profiles[c.author_id];const name=p?.display_name||'Player';const childReplies=replies[c.id]||[]
  return <div className={depth?'ml-8 border-l border-white/[.06] pl-3':''}>
   <div className="flex gap-3">
    <Link to={`/profile/${c.author_id}`}><Avatar profile={p}/></Link>
    <div className="min-w-0 flex-1 rounded-2xl bg-white/[.025] px-3 py-2.5">
     <div className="flex flex-wrap items-center gap-2"><Link to={`/profile/${c.author_id}`} className="text-xs font-bold text-white hover:text-[#ff4655]">{name}</Link><span className="text-[10px] text-neutral-600">{new Date(c.created_at).toLocaleDateString()}</span></div>
     <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">{c.content}</p>
     <div className="mt-2 flex items-center gap-3 text-[10px] font-bold text-neutral-600"><button onClick={()=>setReplyTo(c)} className="hover:text-white">Reply</button>{user&&user.id!==c.author_id&&<Link to={`/report?type=comment&id=${c.id}`} className="hover:text-[#ff6674]">Report</Link>}{user?.id===c.author_id&&<><button onClick={()=>editComment(c)} className="hover:text-white">Edit</button><button onClick={()=>deleteComment(c)} className="text-[#ff6674] hover:text-[#ff4655]">Delete</button></>}</div>
    </div>
   </div>
   {childReplies.length>0&&<div className="mt-2 space-y-2">{childReplies.map(r=><Comment key={r.id} c={r} depth={depth+1}/>)}</div>}
  </div>
 }

 if(loading)return <MainLayout><div className="mx-auto max-w-2xl py-20 text-center text-sm text-neutral-600">Loading post…</div></MainLayout>
 if(error&&!post)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><Icon name="flag" size={28} className="mx-auto text-[#ff4655]"/><p className="mt-3 text-sm text-neutral-500">{error}</p><Link to="/posts" className="mt-4 inline-block text-sm text-[#ff4655]">Back to community</Link></div></MainLayout>

 const author=profiles[post.author_id];const authorName=author?.display_name||'Player';const isVideo=post.media_type==='video'||/\.(mp4|webm|mov)(\?|$)/i.test(post.media_url||'')
 return <MainLayout><div className="mx-auto max-w-2xl">
  <div className="mb-4 flex items-center justify-between"><button onClick={()=>nav(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white"><Icon name="arrow" size={15} className="rotate-180"/> Back</button><div className="flex items-center gap-1">{user&&user.id!==post.author_id&&<><Link to={`/report?type=post&id=${id}`} title="Report post" aria-label="Report post" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-white/[.04] hover:text-[#ff4655]"><Icon name="flag" size={16}/></Link><button onClick={blockAuthor} title="Block author" aria-label="Block author" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-white/[.04] hover:text-[#ff4655]"><Icon name="ban" size={16}/></button></>}</div></div>
  <article className="overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d0d12]">
   <div className="p-5 sm:p-6">
    <div className="flex items-center gap-3"><Link to={`/profile/${post.author_id}`}><Avatar profile={author} size="lg"/></Link><div className="min-w-0 flex-1"><Link to={`/profile/${post.author_id}`} className="text-sm font-bold text-white hover:text-[#ff4655]">{authorName}</Link><div className="text-[11px] text-neutral-600">{new Date(post.created_at).toLocaleString()}</div></div>{user?.id===post.author_id&&<div className="flex gap-1"><button onClick={()=>setEditing(v=>!v)} title="Edit post" aria-label="Edit post" className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-white/[.04] hover:text-white"><Icon name="edit" size={16}/></button><button onClick={deletePost} title="Delete post" aria-label="Delete post" className="flex h-9 w-9 items-center justify-center rounded-lg text-[#ff6674] hover:bg-[#ff4655]/5"><Icon name="trash" size={16}/></button></div>}</div>
    {editing?<div className="mt-5"><textarea value={editContent} onChange={e=>setEditContent(e.target.value)} maxLength={5000} rows={7} className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-7 text-white outline-none"/><button onClick={saveEdit} disabled={busy||!editContent.trim()} className="mt-3 rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase">{busy?'Saving…':'Save changes'}</button></div>:<p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200">{post.content}</p>}
   </div>
   {post.media_url&&<div className="border-y border-white/[.06] bg-black">{isVideo?<video src={post.media_url} controls playsInline className="max-h-[680px] w-full object-contain"/>:<img src={post.media_url} alt="" className="max-h-[680px] w-full object-contain"/>}</div>}
   <div className="flex items-center gap-1 border-t border-white/[.06] p-3 sm:p-4"><button onClick={toggleLike} disabled={!user||busy} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${liked?'bg-[#ff4655]/10 text-[#ff6674]':'text-neutral-400 hover:bg-white/[.04] hover:text-white'}`}><Icon name="heart" size={16}/>{liked?'Liked':'Like'} <span>{post.like_count||0}</span></button><button onClick={toggleSave} disabled={!user} className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${saved?'bg-white/10 text-white':'text-neutral-400 hover:bg-white/[.04] hover:text-white'}`}><Icon name="bookmark" size={16}/>{saved?'Saved':'Save'}</button><button onClick={share} className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-neutral-400 hover:bg-white/[.04] hover:text-white"><Icon name="share" size={16}/>Share</button></div>
  </article>

  <section className="mt-5 rounded-[24px] border border-white/[.08] bg-[#0d0d12] p-5 sm:p-6">
   <div className="flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.2em] text-[#00e5ff]">DISCUSSION</p><h2 className="mt-1 font-display text-xl font-black uppercase text-white">Comments & replies</h2></div><span className="text-xs text-neutral-600">{comments.length}</span></div>
   {replyTo&&<div className="mt-4 flex items-center justify-between rounded-xl border border-[#00e5ff]/15 bg-[#00e5ff]/5 px-3 py-2 text-xs text-neutral-400">Replying to <b className="ml-1 text-white">{profiles[replyTo.author_id]?.display_name||'Player'}</b><button onClick={()=>setReplyTo(null)} title="Cancel reply" aria-label="Cancel reply"><Icon name="close" size={15}/></button></div>}
   {user?<form onSubmit={submitComment} className="mt-4 flex items-end gap-2"><textarea value={comment} onChange={e=>setComment(e.target.value)} maxLength={2000} rows={2} placeholder={replyTo?'Write a reply…':'Join the conversation…'} className="min-w-0 flex-1 resize-none rounded-xl border border-white/[.07] bg-white/[.03] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600"/><button disabled={busy||!comment.trim()} title={replyTo?'Reply':'Comment'} aria-label={replyTo?'Reply':'Comment'} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff4655] text-white disabled:opacity-40"><Icon name="message" size={17}/></button></form>:<div className="mt-4 rounded-xl bg-white/[.025] p-4 text-center text-xs text-neutral-500">Sign in to comment and reply.</div>}
   <div className="mt-5 space-y-3">{!roots.length&&<p className="py-7 text-center text-sm text-neutral-600">No comments yet. Start the conversation.</p>}{roots.map(c=><Comment key={c.id} c={c}/>)}</div>
  </section>
 </div></MainLayout>
}