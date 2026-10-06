import {useEffect,useState} from 'react'
import AdminLayout from '../layouts/AdminLayout'
import Icon from '../components/common/Icon'
import {apiGet} from '../lib/api'

export default function AdminApiStatusPage(){
 const[d,setD]=useState(null)
 useEffect(()=>{apiGet('/api/status',{auth:false}).then(setD).catch(e=>setD({status:'offline',message:e.message}))},[])
 const ok=d?.status==='ok'
 return <AdminLayout><div className="space-y-5">
  <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">ADMIN / INFRASTRUCTURE</p><h1 className="mt-1 text-2xl font-display font-black uppercase text-white">API status</h1><p className="mt-1 text-xs text-neutral-500">Operational view of the community API and database connection.</p></div>
  <div className="rounded-2xl border border-white/10 bg-white/[.02] p-5"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${ok?'bg-emerald-400':'bg-red-400'}`}/><div><p className="text-sm font-bold text-white">{ok?'Operational':'Unavailable'}</p><p className="text-xs text-neutral-600">{d?.message||'Waiting for health response.'}</p></div></div><pre className="mt-5 overflow-auto rounded-xl border border-white/[.06] bg-black/30 p-4 text-xs leading-6 text-neutral-400">{JSON.stringify(d,null,2)}</pre></div>
 </div></AdminLayout>
}
