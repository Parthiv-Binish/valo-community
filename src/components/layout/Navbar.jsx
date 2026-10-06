import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import Icon from '../common/Icon'

const primaryLinks = [
  { name: 'Live', path: '/', end: true },
  { name: 'Following', path: '/following' },
  { name: 'Streamer Subscriptions', path: '/subscriptions' },
  { name: 'Community', path: '/posts' },
]

const secondaryLinks = [
  { name: 'Rankings', path: '/leaderboard' },
  { name: 'Saved', path: '/bookmarks', authOnly: true },
  { name: 'Forecast', path: '/predictions', authOnly: true },
  { name: 'Submit Streamer', path: '/submit' },
  { name: 'About', path: '/about' },
  { name: 'Help', path: '/help' },
  { name: 'Settings', path: '/settings', authOnly: true },
]

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [isOpen,setIsOpen]=useState(false)
  const [moreOpen,setMoreOpen]=useState(false)
  const [unread,setUnread]=useState(0)
  const [isAdmin,setIsAdmin]=useState(false)
  const location=useLocation()

  useEffect(()=>{setIsOpen(false);setMoreOpen(false)},[location.pathname,location.search])
  useEffect(()=>{let active=true;async function check(){if(!user){setIsAdmin(false);return}const{data}=await supabase.from('user_profiles').select('role').eq('id',user.id).maybeSingle();if(active)setIsAdmin(data?.role==='admin')}check();return()=>{active=false}},[user?.id])
  useEffect(()=>{
    let active=true
    async function loadUnread(){
      if(!user){setUnread(0);return}
      const {count}=await supabase.from('notifications').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('is_read',false)
      if(active)setUnread(count||0)
    }
    loadUnread()
    const channel=user?supabase.channel('navbar-notifications-'+user.id).on('postgres_changes',{event:'*',schema:'public',table:'notifications',filter:'user_id=eq.'+user.id},loadUnread).subscribe():null
    return()=>{active=false;if(channel)supabase.removeChannel(channel)}
  },[user?.id,location.pathname])

  const avatar=user?.user_metadata?.avatar_url
  const fallback=(user?.user_metadata?.full_name||user?.email||'U').slice(0,2).toUpperCase()
  const secondaryActive=secondaryLinks.some(x=>location.pathname===x.path || location.pathname.startsWith(x.path+'/'))

  return <>
    <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-white/[.07] bg-[#060606]/92 backdrop-blur-2xl sm:h-16">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#ff4655]/55 to-transparent"/>
      <div className="mx-auto flex h-full w-full max-w-[1800px] items-center px-3 sm:px-5 lg:px-7">
        <div className="flex w-full items-center justify-between md:hidden">
          <button onClick={()=>setIsOpen(v=>!v)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.07] bg-white/[.025] text-neutral-300" aria-label="Open navigation"><Icon name={isOpen?'close':'menu'} size={17}/></button>
          <Link to="/" className="absolute left-1/2 -translate-x-1/2"><img src="https://iili.io/C93RwPf.png" alt="VALO Community" className="h-8 w-auto rounded-md"/></Link>
          <div className="flex items-center gap-1">
            {user&&<Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.07] bg-white/[.025] text-neutral-300" aria-label="Notifications"><Icon name="bell" size={17}/>{unread>0&&<span className="absolute right-0 top-0 min-w-4 rounded-full bg-[#ff4655] px-1 text-center text-[8px] font-black text-white">{unread>9?'9+':unread}</span>}</Link>}
            <Link to={user?'/profile':'/'} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-white/[.07] bg-white/[.025]">
              {user&&avatar?<img src={avatar} alt="" className="h-full w-full object-cover"/>:<span className="text-[10px] font-black text-[#ff4655]">{user?fallback:'?'}</span>}
            </Link>
          </div>
        </div>

        <div className="hidden w-full items-center gap-3 md:flex">
          <Link to="/" className="group flex shrink-0 items-center gap-2.5"><img src="https://iili.io/C93RwPf.png" alt="VALO Community" className="h-8 w-auto rounded-md sm:h-9"/><div className="hidden xl:block"><div className="font-display text-[11px] font-black uppercase tracking-[.18em] text-white">LET'S BUILD VALO</div><div className="mt-1 font-display text-[9px] font-black uppercase tracking-[.2em] text-[#ff4655]">Community</div></div></Link>
          <div className="h-6 w-px bg-white/[.08]"/>
          <nav className="flex min-w-0 flex-1 items-center gap-1">
            {primaryLinks.map(link=><NavLink key={link.path} to={link.path} end={link.end} className={({isActive})=>`relative rounded-lg px-3.5 py-2.5 font-display text-[9px] font-black uppercase tracking-[.12em] ${isActive?'bg-[#ff4655]/10 text-[#ff4655]':'text-neutral-500 hover:bg-white/[.04] hover:text-white'}`}>{link.name}</NavLink>)}
            <div className="relative"><button onClick={()=>setMoreOpen(v=>!v)} className={`flex items-center gap-1 rounded-lg px-3.5 py-2.5 font-display text-[9px] font-black uppercase tracking-[.12em] ${secondaryActive||moreOpen?'bg-white/[.05] text-white':'text-neutral-500 hover:bg-white/[.04] hover:text-white'}`}>More <Icon name="chevron" size={13} className={moreOpen?'rotate-180':''}/></button>{moreOpen&&<div className="absolute left-0 top-[calc(100%+8px)] w-60 rounded-xl border border-white/[.08] bg-[#090909]/98 p-1.5 shadow-2xl backdrop-blur-2xl">{secondaryLinks.filter(x=>(!x.adminOnly||isAdmin)&&(!x.authOnly||user)).map(x=><NavLink key={x.path} to={x.path} className={({isActive})=>`block rounded-lg px-3 py-2.5 font-display text-[9px] font-black uppercase tracking-[.1em] ${isActive?'bg-[#ff4655]/10 text-[#ff4655]':'text-neutral-400 hover:bg-white/[.05] hover:text-white'}`}>{x.name}</NavLink>)}</div>}</div>
          </nav>
          {isAdmin&&<Link to="/admin" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.07] text-neutral-500 hover:bg-white/[.04] hover:text-white" title="Admin dashboard" aria-label="Admin dashboard"><Icon name="dashboard" size={17}/></Link>}
          <Link to="/notifications" className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[.07] text-neutral-500 hover:bg-white/[.04] hover:text-white" title="Notifications"><Icon name="bell" size={17}/>{unread>0&&<span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#ff4655] px-1 text-center text-[8px] font-black text-white">{unread>9?'9+':unread}</span>}</Link>
          <Link to={user?'/profile':'/'} className="flex h-9 items-center gap-2 rounded-lg border border-white/[.08] bg-white/[.035] px-2 hover:border-[#ff4655]/30">
            {user?(avatar?<img src={avatar} alt="" className="h-6 w-6 rounded-md object-cover"/>:<span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ff4655] text-[10px] font-black text-white">{fallback}</span>):<span className="text-xs text-neutral-500">?</span>}
            <span className="hidden max-w-24 truncate font-mono text-[8px] font-bold uppercase text-neutral-300 lg:block">{user?(user.user_metadata?.full_name||user.email?.split('@')[0]||'Profile'):'Sign in'}</span>
          </Link>
          {user?<button onClick={logout} className="rounded-lg border border-white/[.06] px-2 py-2 font-mono text-[8px] font-bold text-neutral-500 hover:border-[#ff4655]/30 hover:text-[#ff4655]">LOG OUT</button>:<button onClick={loginWithGoogle} className="rounded-lg border border-[#ff4655]/35 bg-[#ff4655]/[.05] px-3 py-2 text-[9px] font-black uppercase text-white">Connect ID</button>}
        </div>
      </div>
    </header>

    <div className={`fixed inset-x-0 top-14 z-40 border-b border-white/[.08] bg-[#080808]/98 px-3 pb-4 pt-3 shadow-2xl backdrop-blur-2xl sm:top-16 md:hidden ${isOpen?'translate-y-0 opacity-100':'pointer-events-none -translate-y-3 opacity-0'}`}>
      <div className="mb-3 px-1"><p className="font-mono text-[8px] font-bold uppercase tracking-[.22em] text-[#ff4655]">VALO COMMUNITY</p><p className="mt-1 text-xs font-black uppercase text-white">Live first. Community when you want it.</p></div>
      <div className="grid grid-cols-2 gap-2">
        {[...primaryLinks,...secondaryLinks.filter(x=>(!x.adminOnly||isAdmin)&&(!x.authOnly||user)),...(isAdmin?[{name:'Admin Dashboard',path:'/admin'}]:[])].map(x=><Link key={x.path} to={x.path} className={`rounded-xl border px-3 py-3 font-display text-[9px] font-black uppercase tracking-[.12em] ${location.pathname===x.path?'border-[#ff4655]/35 bg-[#ff4655]/10 text-[#ff4655]':'border-white/[.06] bg-white/[.025] text-neutral-300'}`}>{x.name}</Link>)}
      </div>
    </div>
  </>
}