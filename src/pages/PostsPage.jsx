import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

function Avatar({ profile, id }) {
  const name = profile?.display_name || 'Player'
  return profile?.avatar_url
    ? <img src={profile.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10" referrerPolicy="no-referrer" />
    : <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff4655] via-[#8b5cf6] to-[#00e5ff] text-[11px] font-black text-white">{name.slice(0,2).toUpperCase()}</div>
}

function PostCard({ post, profile, user, onChanged }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([
      supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle(),
      supabase.from('post_bookmarks').select('id').eq('post_id', post.id).eq('user_id', user.id).maybeSingle()
    ]).then(([like, bookmark]) => {
      setLiked(!!like.data); setBookmarked(!!bookmark.data)
    })
  }, [post.id, user?.id])

  async function toggleLike() {
    if (!user || busy) return
    setBusy(true)
    const result = liked
      ? await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      : await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id })
    if (!result.error) setLiked(!liked)
    setBusy(false)
    onChanged?.()
  }

  async function toggleBookmark() {
    if (!user) return
    const result = bookmarked
      ? await supabase.from('post_bookmarks').delete().eq('post_id', post.id).eq('user_id', user.id)
      : await supabase.from('post_bookmarks').insert({ post_id: post.id, user_id: user.id })
    if (!result.error) setBookmarked(!bookmarked)
  }

  async function deletePost() {
    if (!user || post.author_id !== user.id) return
    if (!window.confirm('Delete this post permanently?')) return
    setBusy(true)
    const { error } = await supabase.from('posts').delete().eq('id', post.id).eq('author_id', user.id)
    setBusy(false)
    if (error) return alert(error.message)
    onChanged?.()
  }

  const name = profile?.display_name || 'Player'
  const mediaIsVideo = post.media_type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(post.media_url || '')

  return <article className="overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#0d0d12] shadow-[0_18px_60px_rgba(0,0,0,.22)]">
    <div className="px-4 pt-4 sm:px-5 sm:pt-5">
      <div className="flex items-center gap-3">
        <Avatar profile={profile} id={post.author_id} />
        <div className="min-w-0 flex-1">
          <Link to={`/profile/${post.author_id}`} className="font-bold text-white hover:text-[#ff4655]">{name}</Link>
          <p className="text-[11px] text-neutral-500">{new Date(post.created_at).toLocaleString([], { dateStyle:'medium', timeStyle:'short' })}</p>
        </div>
        {user?.id === post.author_id && <div className="relative">
          <button onClick={()=>setMenu(v=>!v)} className="h-8 w-8 rounded-full text-neutral-500 hover:bg-white/5 hover:text-white">•••</button>
          {menu && <div className="absolute right-0 z-20 mt-1 w-32 rounded-xl border border-white/10 bg-[#17171d] p-1 shadow-xl">
            <Link to={`/posts/${post.id}?edit=1`} className="block rounded-lg px-3 py-2 text-xs text-white hover:bg-white/5">Edit</Link>
            <button onClick={deletePost} disabled={busy} className="w-full rounded-lg px-3 py-2 text-left text-xs text-[#ff6674] hover:bg-white/5">Delete</button>
          </div>}
        </div>}
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words text-[15px] leading-7 text-neutral-200">{post.content}</p>
    </div>
    {post.media_url && <div className="mt-4 border-y border-white/[0.06] bg-black">{mediaIsVideo ? <video src={post.media_url} controls playsInline className="max-h-[620px] w-full object-contain"/> : <img src={post.media_url} alt="" className="max-h-[620px] w-full object-cover" loading="lazy"/>}</div>}
    <div className="px-4 py-3 sm:px-5">
      <div className="flex justify-between border-b border-white/[0.06] pb-3 text-xs text-neutral-500"><span>{post.like_count || 0} likes</span><span>{post.comment_count || 0} comments</span></div>
      <div className="grid grid-cols-3 gap-1 pt-2">
        <button onClick={toggleLike} disabled={!user || busy} className={`rounded-xl py-2.5 text-xs font-bold ${liked?'bg-[#ff4655]/10 text-[#ff6674]':'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>{liked?'♥ Liked':'♡ Like'}</button>
        <Link to={`/posts/${post.id}`} className="rounded-xl py-2.5 text-center text-xs font-bold text-neutral-400 hover:bg-white/5 hover:text-white">◯ Comment</Link>
        <button onClick={toggleBookmark} disabled={!user} className={`rounded-xl py-2.5 text-xs font-bold ${bookmarked?'bg-white/10 text-white':'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>{bookmarked?'▣ Saved':'□ Save'}</button>
      </div>
    </div>
  </article>
}

export default function PostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [profiles, setProfiles] = useState({})
  const [tab, setTab] = useState('latest')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase.from('posts').select('id,author_id,content,media_url,media_type,like_count,comment_count,created_at').eq('status','published').order('created_at',{ascending:false}).limit(50)
    if (error) console.error(error)
    const rows = data || []
    setPosts(rows)
    const ids = [...new Set(rows.map(x=>x.author_id))]
    if (ids.length) {
      const { data: publicProfiles, error: profileError } = await supabase.rpc('get_public_profiles',{p_ids:ids})
      if (profileError) console.error(profileError)
      setProfiles(Object.fromEntries((publicProfiles||[]).map(p=>[p.id,p])))
    } else setProfiles({})
    setLoading(false)
  }

  useEffect(()=>{ load() },[])
  const visiblePosts = tab === 'latest' ? posts : posts
  return <MainLayout>
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,680px)_300px]">
      <section className="min-w-0">
        <div className="mb-5 flex items-end justify-between"><div><p className="font-mono text-[10px] font-bold tracking-[.28em] text-[#ff4655]">VALO COMMUNITY</p><h1 className="mt-1 text-3xl font-display font-black uppercase text-white sm:text-4xl">Community</h1></div>{user&&<Link to="/posts/create" className="rounded-xl bg-[#ff4655] px-4 py-2.5 text-xs font-black uppercase text-white">Create</Link>}</div>
        <div className="mb-4 flex rounded-2xl border border-white/[0.07] bg-[#0b0b10] p-1">{['for_you','latest'].map(x=><button key={x} onClick={()=>setTab(x)} className={`flex-1 rounded-xl py-2.5 text-xs font-black uppercase ${tab===x?'bg-white/[0.08] text-white':'text-neutral-500'}`}>{x==='for_you'?'For You':'Latest'}</button>)}</div>
        {user&&<Link to="/posts/create" className="mb-4 flex items-center gap-3 rounded-[20px] border border-white/[0.07] bg-[#0d0d12] p-4"><Avatar id={user.id} profile={profiles[user.id]}/><div className="flex-1 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-neutral-500">What’s happening in VALORANT?</div></Link>}
        <div className="space-y-4">
          {loading&&[1,2,3].map(x=><div key={x} className="h-52 animate-pulse rounded-[22px] bg-white/[0.025]"/>)}
          {!loading&&visiblePosts.map(post=><PostCard key={post.id} post={post} profile={profiles[post.author_id]} user={user} onChanged={load}/>)}
          {!loading&&!visiblePosts.length&&<div className="rounded-[24px] border border-dashed border-white/10 px-6 py-16 text-center"><h2 className="font-display text-xl font-black uppercase text-white">The feed is quiet</h2><p className="mt-2 text-sm text-neutral-500">Be the first player to start the conversation.</p>{user&&<Link to="/posts/create" className="mt-5 inline-block rounded-xl bg-[#ff4655] px-5 py-3 text-xs font-black uppercase">Create the first post</Link>}</div>}
        </div>
      </section>
      <aside className="hidden space-y-4 lg:block"><div className="rounded-[22px] border border-white/[0.07] bg-[#0d0d12] p-5"><p className="font-mono text-[10px] tracking-[.2em] text-[#00e5ff]">COMMUNITY HUB</p><h2 className="mt-2 font-display text-xl font-black uppercase text-white">Built for VALORANT</h2><p className="mt-2 text-sm leading-6 text-neutral-500">Share clips, setups, opinions, tournament moments and everything happening around the game.</p></div><div className="rounded-[22px] border border-white/[0.07] bg-[#0d0d12] p-5"><p className="text-xs font-bold uppercase text-white">Explore</p><div className="mt-3 space-y-1"><Link to="/" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400">🔴 Live streamers</Link><Link to="/leaderboard" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400">🏆 Leaderboard</Link><Link to="/bookmarks" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400">🔖 Saved posts</Link><Link to="/following" className="block rounded-xl px-3 py-2.5 text-sm text-neutral-400">👥 Following</Link></div></div></aside>
    </div>
  </MainLayout>
}