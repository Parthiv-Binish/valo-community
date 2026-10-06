import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

function Avatar({ id, size = 'md' }) {
  const initials = (id || 'V').replace(/-/g, '').slice(0, 2).toUpperCase()
  const cls = size === 'lg' ? 'h-12 w-12 text-sm' : 'h-9 w-9 text-[11px]'
  return <div className={`${cls} shrink-0 rounded-full bg-gradient-to-br from-[#ff4655] via-[#8b5cf6] to-[#00e5ff] p-[1px]`}><div className="h-full w-full rounded-full bg-[#101015] flex items-center justify-center text-white font-black">{initials}</div></div>
}

function PostCard({ post, user, onChanged }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle(),
      supabase.from('post_bookmarks').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle()
    ]).then(([like, bookmark]) => {
      setLiked(!!like.data)
      setBookmarked(!!bookmark.data)
    })
  }, [post.id, user])

  async function toggleLike() {
    if (!user || busy) return
    setBusy(true)
    if (liked) {
      await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      setLiked(false)
    } else {
      await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id })
      setLiked(true)
    }
    setBusy(false)
    onChanged?.()
  }

  async function toggleBookmark() {
    if (!user) return
    if (bookmarked) {
      await supabase.from('post_bookmarks').delete().eq('post_id', post.id).eq('user_id', user.id)
      setBookmarked(false)
    } else {
      await supabase.from('post_bookmarks').insert({ post_id: post.id, user_id: user.id })
      setBookmarked(true)
    }
  }

  const mediaIsVideo = post.media_type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(post.media_url || '')

  return (
    <article className="rounded-[22px] border border-white/[0.08] bg-[#0d0d12] shadow-[0_18px_60px_rgba(0,0,0,.22)] overflow-hidden">
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <div className="flex items-center gap-3">
          <Avatar id={post.author_id} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">VALO Player</span>
              <span className="rounded-full border border-[#ff4655]/30 bg-[#ff4655]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#ff6b77]">Member</span>
            </div>
            <p className="text-[11px] text-neutral-500">{new Date(post.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
          </div>
          <button className="h-8 w-8 rounded-full text-neutral-500 hover:bg-white/5 hover:text-white">•••</button>
        </div>

        <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200">{post.content}</p>
      </div>

      {post.media_url && (
        <div className="mt-4 border-y border-white/[0.06] bg-black">
          {mediaIsVideo
            ? <video src={post.media_url} controls playsInline className="max-h-[620px] w-full object-contain" />
            : <img src={post.media_url} alt="" className="max-h-[620px] w-full object-cover" loading="lazy" />}
        </div>
      )}

      <div className="px-4 py-3 sm:px-5">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 text-xs text-neutral-500">
          <span>{post.like_count || 0} likes</span>
          <span>{post.comment_count || 0} comments</span>
        </div>
        <div className="grid grid-cols-3 gap-1 pt-2">
          <button onClick={toggleLike} disabled={!user || busy} className={`rounded-xl py-2.5 text-xs font-bold transition ${liked ? 'bg-[#ff4655]/10 text-[#ff6674]' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
            {liked ? '♥ Liked' : '♡ Like'}
          </button>
          <Link to={`/posts/${post.id}`} className="rounded-xl py-2.5 text-center text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white">◯ Comment</Link>
          <button onClick={toggleBookmark} disabled={!user} className={`rounded-xl py-2.5 text-xs font-bold transition ${bookmarked ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
            {bookmarked ? '▣ Saved' : '□ Save'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [tab, setTab] = useState('for_you')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    let query = supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at').eq('status', 'published').order('created_at', { ascending: false }).limit(50)
    const { data, error } = await query
    if (error) console.error(error)
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const visiblePosts = useMemo(() => posts, [posts])

  return (
    <MainLayout>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,680px)_300px]">
        <section className="min-w-0">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold tracking-[.28em] text-[#ff4655]">VALO COMMUNITY</p>
              <h1 className="mt-1 text-3xl font-display font-black uppercase tracking-tight text-white sm:text-4xl">Community</h1>
            </div>
            {user && <Link to="/posts/create" className="rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#ff4655]/10 hover:bg-[#e63e4d]">Create</Link>}
          </div>

          <div className="mb-4 flex rounded-2xl border border-white/[0.07] bg-[#0b0b10] p-1">
            {['for_you', 'latest'].map(x => (
              <button key={x} onClick={() => setTab(x)} className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider ${tab === x ? 'bg-white/[0.08] text-white' : 'text-neutral-500'}`}>
                {x === 'for_you' ? 'For You' : 'Latest'}
              </button>
            ))}
          </div>

          {user && (
            <Link to="/posts/create" className="mb-4 flex items-center gap-3 rounded-[20px] border border-white/[0.07] bg-[#0d0d12] p-4 hover:border-white/15">
              <Avatar id={user.id} />
              <div className="flex-1 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-neutral-500">What’s happening in VALORANT?</div>
              <span className="hidden rounded-lg bg-white/5 px-3 py-2 text-[10px] font-bold text-neutral-400 sm:block">POST</span>
            </Link>
          )}

          <div className="space-y-4">
            {loading && [1,2,3].map(x => <div key={x} className="h-52 animate-pulse rounded-[22px] border border-white/[0.06] bg-white/[0.025]" />)}
            {!loading && visiblePosts.map(post => <PostCard key={post.id} post={post} user={user} onChanged={load} />)}
            {!loading && !visiblePosts.length && (
              <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff4655]/10 text-2xl">🎮</div>
                <h2 className="font-display text-xl font-black uppercase text-white">The feed is quiet</h2>
                <p className="mt-2 text-sm text-neutral-500">Be the first player to start the conversation.</p>
                {user && <Link to="/posts/create" className="mt-5 inline-block rounded-xl bg-[#ff4655] px-5 py-3 text-xs font-black uppercase tracking-wider">Create the first post</Link>}
              </div>
            )}
          </div>
        </section>

        <aside className="hidden space-y-4 lg:block">
          <div className="rounded-[22px] border border-white/[0.07] bg-[#0d0d12] p-5">
            <p className="font-mono text-[10px] tracking-[.2em] text-[#00e5ff]">COMMUNITY HUB</p>
            <h2 className="mt-2 font-display text-xl font-black uppercase text-white">Built for VALORANT</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">Share clips, setups, opinions, tournament moments and everything happening around the game.</p>
          </div>
          <div className="rounded-[22px] border border-white/[0.07] bg-[#0d0d12] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-white">Explore</p>
            <div className="mt-3 space-y-1">
              <Link to="/" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">🔴 Live streamers</Link>
              <Link to="/leaderboard" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">🏆 Leaderboard</Link>
              <Link to="/bookmarks" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">🔖 Saved posts</Link>
              <Link to="/following" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400 hover:bg-white/5 hover:text-white">👥 Following</Link>
            </div>
          </div>
        </aside>
      </div>
    </MainLayout>
  )
}
