import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
import {useAuth} from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
export default function NotificationsPage(){const{user}=useAuth();const[data,setData]=useState([]);useEffect(()=>{if(!user)return;supabase.from('notifications').select('*').eq('user_id',user.id).order('created_at',{ascending:false}).limit(100).then(({data})=>setData(data||[]))},[user]);return <MainLayout><div className="max-w-3xl mx-auto px-4 py-10"><h1 className="text-3xl font-display font-black text-white uppercase mb-6">Notifications</h1>{data.length?<div className="space-y-2">{data.map(n=><div key={n.id} className="border border-white/10 rounded-xl p-4 bg-white/[.02]"><div className="text-white font-bold">{n.title}</div><div className="text-sm text-neutral-400">{n.body}</div></div>)}</div>:<p className="text-neutral-500">You're all caught up.</p>}</div></MainLayout>}
