import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
import AdminLayout from '../layouts/AdminLayout'
export default function AdminUsersPage(){
 const[data,setData]=useState([]),[loading,setLoading]=useState(true)
 async function load(){setLoading(true);const{data:{session}}=await supabase.auth.getSession();const r=await fetch((import.meta.env.VITE_API_URL||'https://valo-community-backend.onrender.com')+'/api/admin/users',{headers:{Authorization:'Bearer '+session.access_token}});const b=await r.json();setData(b.users||[]);setLoading(false)}
 useEffect(()=>{load()},[])
 return <AdminLayout><div className="space-y-5"><h1 className="text-2xl font-display font-black text-white uppercase">User Management</h1><div className="overflow-x-auto border border-white/10 rounded-2xl"><table className="w-full text-sm"><thead><tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Created</th><th className="p-3 text-left">Last sign in</th><th className="p-3 text-left">Status</th></tr></thead><tbody>{data.map(u=><tr key={u.id} className="border-t border-white/5"><td className="p-3 text-white">{u.email||u.id}</td><td className="p-3 text-neutral-400">{u.created_at?new Date(u.created_at).toLocaleString():'—'}</td><td className="p-3 text-neutral-400">{u.last_sign_in_at?new Date(u.last_sign_in_at).toLocaleString():'Never'}</td><td className="p-3 text-emerald-400">{u.banned_until?'Banned':'Active'}</td></tr>)}</tbody></table>{loading&&<p className="p-5 text-neutral-500">Loading users...</p>}</div></div></AdminLayout>
}