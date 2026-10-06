import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

export default function PostDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const nav = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const [{ data: p }, { data: cs }] = await Promise.all([
      supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at').eq('id', id).single(),
      supabase.from('post_comments').select('id,author_id,content,created_at').eq('post_id', id).eq('status','published').order('created_at', { ascending: true })
    ])
    setPost(p)
    setComments(cs || [])
    if (user && p) {
      const [{ data: l }, { data: b }] = await Promise.all([
        supabase.from('post_likes').select('id').eq('post_id', id).eq('user_id', user.id).maybeSingle(),
        supabase.from('post_bookmarks').select('id').eq('post_id', id).eq('user_id', user.id).maybeSingle()
      ])
      setLiked(!!l)
      setSaved(!!b)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [id, user?.id])

  async function toggleLike() {
    if (!user) return
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', id).eq('user_id', user.id)
      setLiked(false)
    } else {
      await supabase.from('post_likes').insert({ post_id: id, user_id: user.id })
      setLiked(true)
    }
    load()
  }

  async function toggleSave() {
    if (!user) return
    if (saved) {
      await supabase.from('post_bookmarks').delete().eq('post_id', id).eq('user_id', user.id)
      setSaved(false)
    } else {
      await supabase.from('post_bookmarks').insert({ post_id: id, user_id: user.id })
      setSaved(true)
    }
  }

  async function submitComment(e) {
    e.preventDefault()
    if (!user || !comment.trim()) return
    const { error } = await supabase.from('post_comments').insert({ post_id: id, author_id: user.id, content: comment.trim() })
    if (error) { alert(error.message); return }
    setComment('')
    load()
  }

  if (loading) return <MainLayout><div className="mx-auto max-w-2xl py-20 text-center text-sm text-neutral-500">Loading post...</div></MainLayout>
  if (!post) return <MainLayout><div className="mx-auto max-w-2xl py-20 text-center"><h1 className="font-display text-2xl font-black uppercase text-white">Post not found</h1><Link to="/posts" className="mt-4 inline-block text-sm text-[#ff4655]">Back to community</Link></div></MainLayout>

  const video = post.media_type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(post.media_url || '')

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl">
        <button onClick={()=>nav(-1)} className="mb-4 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white">← Back</button>

        <article className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0d0d12]">
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#ff4655] to-[#00e5ff] p-[1px]"><div className="flex h-full w-full items-center justify-center rounded-full bg-[#101015] text-xs font-black">{post.author_id.replace(/-/g,'').slice(0,2).toUpperCase()}</div></div>
              <div><div className="text-sm font-bold text-white">VALO Player</div><div className="text-[11px] text-neutral-600">{new Date(post.created_at).toLocaleString()}</div></div>
            </div>
            <p className="mt-5 whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200">{post.content}</p>
          </div>

          {post.media_url && <div className="border-y border-white/[0.06] bg-black">{video ? <video src={post.media_url} controls playsInline className="max-h-[650px] w-full object-contain"/> : <img src={post.media_url} alt="" className="max-h-[650px] w-full object-contain"/>}</div>}

          <div className="p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <button onClick={toggleLike} disabled={!user} className={`rounded-xl px-4 py-2.5 text-xs font-bold ${liked ? 'bg-[#ff4655]/10 text-[#ff6674]' : 'bg-white/[0.04] text-neutral-300'}`}>{liked ? '♥ Liked' : '♡ Like'} · {post.like_count || 0}</button>
              <button onClick={toggleSave} disabled={!user} className={`rounded-xl px-4 py-2.5 text-xs font-bold ${saved ? 'bg-white/10 text-white' : 'bg-white/[0.04] text-neutral-300'}`}>{saved ? '▣ Saved' : '□ Save'}</button>
            </div>
          </div>
        </article>

        <section className="mt-5 rounded-[24px] border border-white/[0.08] bg-[#0d0d12] p-5 sm:p-6">
          <div className="flex items-end justify-between"><div><p className="font-mono text-[10px] tracking-[.2em] text-[#00e5ff]">DISCUSSION</p><h2 className="mt-1 font-display text-xl font-black uppercase text-white">Comments</h2></div><span className="text-xs text-neutral-600">{comments.length}</span></div>
          {user && <form onSubmit={submitComment} className="mt-5 flex gap-2"><input value={comment} onChange={e=>setComment(e.target.value)} maxLength={1000} placeholder="Join the conversation..." className="min-w-0 flex-1 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-[#ff4655]/40"/><button className="rounded-xl bg-[#ff4655] px-4 text-xs font-black uppercase">Send</button></form>}
          <div className="mt-5 space-y-3">
            {!comments.length && <p className="py-6 text-center text-sm text-neutral-600">No comments yet. Start the conversation.</p>}
            {comments.map(c => <div key={c.id} className="flex gap-3 rounded-2xl bg-white/[0.025] p-3"><div className="h-8 w-8 shrink-0 rounded-full bg-white/[0.08] flex items-center justify-center text-[10px] font-bold text-neutral-300">{c.author_id.replace(/-/g,'').slice(0,2).toUpperCase()}</div><div className="min-w-0"><div className="text-[11px] font-bold text-neutral-400">VALO Player · {new Date(c.created_at).toLocaleDateString()}</div><p className="mt-1 whitespace-pre-wrap break-words text-sm text-neutral-300">{c.content}</p></div></div>)}
          </div>
        </section>
      </div>
    </MainLayout>
  )
}
