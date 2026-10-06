import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
import {useAuth} from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
export default function FollowingPage(){const{user}=useAuth();const[data,setData]=useState([]);useEffect(()=>{if(user)supabase.from('user_follows').select('following_id').eq('follower_id',user.id).then(({data})=>setData(data||[]))},[user]);return <MainLayout><div className="max-w-2xl mx-auto px-4 py-10"><h1 className="text-3xl font-display font-black text-white uppercase mb-6">Following</h1>{data.map(x=><div key={x.following_id} className="p-4 mb-2 rounded-xl border border-white/10 text-neutral-300">{x.following_id}</div>)}{!data.length&&<p className="text-neutral-500">You're not following anyone yet.</p>}</div></MainLayout>}
