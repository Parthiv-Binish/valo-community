import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { adminSignOut } from '../../services/authService'
import Icon from '../../components/common/Icon'

const navItems=[
 {to:'/admin',label:'Streamers',icon:'eye',end:true},
 {to:'/admin/analytics',label:'Analytics',icon:'dashboard'},
 {to:'/admin/submissions',label:'Submissions',icon:'message'},
 {to:'/admin/posts',label:'Posts',icon:'edit'},
 {to:'/admin/reports',label:'Reports',icon:'flag'},
 {to:'/admin/users',label:'Users',icon:'users'},
 {to:'/admin/email',label:'Email',icon:'mail'},
 {to:'/admin/announcements',label:'Announcements',icon:'message'},
 {to:'/admin/banners',label:'Banners',icon:'image'},
 {to:'/admin/settings',label:'Settings',icon:'settings'},
 {to:'/admin/api-status',label:'API Status',icon:'shield'},
]

export default function AdminLayout({children}){
 const navigate=useNavigate();const location=useLocation();const[open,setOpen]=useState(false)
 async function signOut(){await adminSignOut();navigate('/admin/login')}
 const active=(x)=>x.end?location.pathname==='/admin':location.pathname===x.to||location.pathname.startsWith(x.to+'/')
 return <div className="min-h-screen bg-[#070708] text-white">
  <header className="sticky top-0 z-50 h-14 border-b border-white/[.08] bg-[#09090b]/95 backdrop-blur-xl">
   <div className="flex h-full items-center px-3 sm:px-5">
    <button onClick={()=>setOpen(v=>!v)} className="mr-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-400 lg:hidden" aria-label="Open admin navigation"><Icon name={open?'close':'menu'} size={17}/></button>
    <Link to="/admin" className="flex items-center gap-2.5"><img src="https://iili.io/Bp6m8Xa.png" alt="" className="h-7 w-7 rounded object-contain"/><div className="hidden sm:block leading-tight"><p className="text-[9px] font-display uppercase tracking-wider text-neutral-500">Admin console</p><p className="text-xs font-display font-bold text-[#ff4655]">VALO Community</p></div></Link>
    <div className="ml-auto flex items-center gap-2"><Link to="/" title="Public site" aria-label="Public site" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-500 hover:text-white"><Icon name="arrow" size={16}/></Link><button onClick={signOut} title="Sign out" aria-label="Sign out" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-neutral-500 hover:text-[#ff4655]"><Icon name="logout" size={16}/></button></div>
   </div>
  </header>
  <div className="flex min-h-[calc(100vh-56px)]">
   <aside className={`fixed inset-y-14 left-0 z-40 w-64 border-r border-white/[.07] bg-[#09090b] p-3 transition-transform lg:sticky lg:top-14 lg:block lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
    <nav className="space-y-1">{navItems.map(x=><Link key={x.to} to={x.to} onClick={()=>setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition ${active(x)?'bg-[#ff4655]/10 text-[#ff6674]':'text-neutral-500 hover:bg-white/[.04] hover:text-white'}`}><Icon name={x.icon} size={16}/>{x.label}</Link>)}</nav>
    <div className="mt-6 rounded-xl border border-white/[.06] bg-white/[.02] p-3 text-[10px] leading-5 text-neutral-600">Admin actions are audited. Use moderation tools only for legitimate community operations.</div>
   </aside>
   {open&&<button aria-label="Close navigation" onClick={()=>setOpen(false)} className="fixed inset-0 top-14 z-30 bg-black/60 lg:hidden"/>}
   <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><div className="mx-auto w-full max-w-7xl">{children}</div></main>
  </div>
 </div>
}