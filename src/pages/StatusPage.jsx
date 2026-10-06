import {useEffect,useState} from 'react'
import MainLayout from '../layouts/MainLayout'
import Icon from '../components/common/Icon'
import {apiGet} from '../lib/api'

export default function StatusPage(){
 const[api,setApi]=useState(null)
 useEffect(()=>{apiGet('/api/status',{auth:false}).then(setApi).catch(()=>setApi({status:'offline'}))},[])
 const ok=api?.status==='ok'
 return <MainLayout><div className="mx-auto max-w-3xl space-y-5 py-6 sm:py-10">
  <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">SYSTEM / STATUS</p><h1 className="mt-1 text-3xl font-display font-black uppercase text-white">System status</h1><p className="mt-2 text-sm text-neutral-500">Live health information for the VALO Community services.</p></div>
  <div className="rounded-2xl border border-white/10 bg-white/[.02] p-5 sm:p-6"><div className="flex items-center gap-3"><span className={`h-2.5 w-2.5 rounded-full ${ok?'bg-emerald-400':'bg-red-400'}`}/><span className={`text-sm font-bold ${ok?'text-emerald-400':'text-red-400'}`}>{ok?'All systems operational':'API unavailable'}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl border border-white/[.06] bg-black/20 p-4"><div className="flex items-center gap-2 text-xs font-bold text-neutral-400"><Icon name="shield" size={14}/>API</div><p className="mt-2 text-xs text-neutral-600">{api?.message||'Unable to reach the service.'}</p></div><div className="rounded-xl border border-white/[.06] bg-black/20 p-4"><div className="flex items-center gap-2 text-xs font-bold text-neutral-400"><Icon name="database" size={14}/>Database</div><p className="mt-2 text-xs text-neutral-600">{api?.database||'Unknown'}</p></div></div></div>
 </div></MainLayout>
}
