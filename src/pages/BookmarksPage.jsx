import {useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {supabase} from '../lib/supabase'
import {useAuth} from '../context/AuthContext'
import MainLayout from '../layouts/MainLayout'
export default function BookmarksPage(){const{user}=useAuth();const[data,setData]=useState([]);useEffect(()=>{if(user)supabase.from('post_bookmarks').select('post_id,posts(id,content,created_at)').eq('user_id',user.id).order('created_at',{ascending:false}).then(({data})=>setData(data||[]))},[user]);return <MainLayout><div className="max-w-3xl mx-auto px-4 py-10"><h1 className="text-3xl font-display font-black text-white uppercase mb-6">Bookmarks</h1>{data.map(x=><Link key={x.post_id} to={'/posts/'+x.posts.id} className="block p-4 mb-2 rounded-xl border border-white/10 text-white">{x.posts.content.slice(0,180)}</Link>)}{!data.length&&<p className="text-neutral-500">No bookmarks yet.</p>}</div></MainLayout>}
