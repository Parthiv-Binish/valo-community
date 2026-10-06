import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'

const items=[
 {to:'/profile',label:'Profile',desc:'Your public name, avatar, bio and community identity',icon:'◎'},
 {to:'/notifications',label:'Notifications',desc:'Review activity and manage what needs your attention',icon:'♧'},
 {to:'/following',label:'Following',desc:'Players and creators you follow',icon:'♧'},
 {to:'/bookmarks',label:'Saved posts',desc:'Posts you saved for later',icon:'□'},
]

export default function SettingsPage(){
 const{user,logout}=useAuth();const nav=useNavigate();const[busy,setBusy]=useState(false)
 async function signout(){setBusy(true);await logout();nav('/')}
 if(!user)return <MainLayout><div className="mx-auto max-w-xl py-20 text-center"><h1 className="font-display text-2xl font-black uppercase text-white">Sign in required</h1><p className="mt-2 text-sm text-neutral-500">Connect your account to manage your community settings.</p></div></MainLayout>
 return <MainLayout><div className="mx-auto max-w-3xl">
  <div className="mb-6"><p className="font-mono text-[10px] tracking-[.25em] text-[#00e5ff]">ACCOUNT CENTER</p><h1 className="mt-1 font-display text-3xl font-black uppercase text-white">Settings</h1><p className="mt-2 text-sm text-neutral-500">Manage your identity, activity and account.</p></div>
  <section className="overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d0d12]">
   <div className="border-b border-white/[.06] px-5 py-4"><p className="text-xs font-black uppercase tracking-wider text-white">Community</p></div>
   {items.map(x=><Link key={x.to} to={x.to} className="flex items-center gap-4 border-b border-white/[.05] px-5 py-4 transition hover:bg-white/[.025]"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[.04] text-lg text-[#ff4655]">{x.icon}</span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-white">{x.label}</span><span className="mt-1 block text-xs leading-5 text-neutral-600">{x.desc}</span></span><span className="text-neutral-600">›</span></Link>)}
  </section>
  <section className="mt-4 overflow-hidden rounded-[24px] border border-white/[.08] bg-[#0d0d12]">
   <div className="border-b border-white/[.06] px-5 py-4"><p className="text-xs font-black uppercase tracking-wider text-white">Session</p></div>
   <div className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-bold text-white">Signed in</p><p className="mt-1 max-w-[260px] truncate text-xs text-neutral-600">{user.email}</p></div><button disabled={busy} onClick={signout} className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-black uppercase text-neutral-300 hover:border-[#ff4655]/30 hover:text-[#ff4655]">{busy?'Signing out...':'Log out'}</button></div>
  </section>
  <section className="mt-4 rounded-[24px] border border-red-500/15 bg-red-500/[.025] p-5"><p className="text-xs font-black uppercase tracking-wider text-red-400">Danger zone</p><p className="mt-2 text-xs leading-5 text-neutral-500">Permanently remove your account and associated community data.</p><Link to="/account/delete" className="mt-4 inline-flex rounded-xl border border-red-500/20 px-4 py-2.5 text-xs font-black uppercase text-red-400 hover:bg-red-500/10">Delete account</Link></section>
 </div></MainLayout>
}