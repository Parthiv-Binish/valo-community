import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
import AdminLayout from '../layouts/AdminLayout'
export default function AdminReportsPage(){
 const[data,setData]=useState([])
 const load=async()=>{const{data:{session}}=await supabase.auth.getSession();const r=await fetch((import.meta.env.VITE_API_URL||'https://valo-community-backend.onrender.com')+'/api/admin/reports',{headers:{Authorization:'Bearer '+session.access_token}});const x=await r.json();setData(x.reports||[])}
 useEffect(()=>{load()},[])
 async function setStatus(id,status){const{data:{session}}=await supabase.auth.getSession();await fetch((import.meta.env.VITE_API_URL||'https://valo-community-backend.onrender.com')+'/api/admin/reports/'+id,{method:'PATCH',headers:{Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify({status})});load()}
 return <AdminLayout><div className="space-y-5"><h1 className="text-2xl font-display font-black text-white uppercase">Moderation Reports</h1>{data.map(r=><div key={r.id} className="border border-white/10 rounded-2xl p-5 bg-white/[.02]"><p className="text-[#ff4655] text-xs uppercase">{r.target_type}</p><p className="text-white font-bold">{r.reason}</p><p className="text-neutral-400 text-sm mt-2">{r.details||'No additional details.'}</p><div className="mt-4 flex gap-2">{['reviewing','resolved','dismissed'].map(s=><button key={s} onClick={()=>setStatus(r.id,s)} className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-neutral-300">{s}</button>)}</div></div>)}{!data.length&&<p className="text-neutral-500">No reports.</p>}</div></AdminLayout>
}