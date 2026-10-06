import {useEffect,useState} from 'react'
import {supabase} from '../lib/supabase'
import AdminLayout from '../admin/layouts/AdminLayout'
import PostMedia from '../components/common/PostMedia'
import Icon from '../components/common/Icon'

export default function AdminPostsPage(){
 const[data,setData]=useState([]);const[loading,setLoading]=useState(true);const[error,setError]=useState('')
 async function load(){setLoading(true);const{data:rows,error:e}=await supabase.from('posts').select('id,author_id,content,media_url,media_type,status,like_count,comment_count,created_at').order('created_at',{ascending:false}).limit(100);if(e)setError(e.message);setData(rows||[]);setLoading(false)}
 useEffect(()=>{load()},[])
 async function hide(id){const{error:e}=await supabase.from('posts').update({status:'hidden'}).eq('id',id);if(e)setError(e.message);else load()}
 return <AdminLayout><div className="space-y-5">
  <div><p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#ff4655]">ADMIN / COMMUNITY</p><h1 className="mt-1 text-2xl font-display font-black uppercase text-white">Post moderation</h1><p className="mt-1 text-xs text-neutral-500">Review text, images and videos without leaving the console.</p></div>
  {error&&<div className="rounded-xl border border-[#ff4655]/20 bg-[#ff4655]/5 p-3 text-xs text-[#ff6674]">{error}</div>}
  <div className="space-y-3">
   {loading&&[1,2,3].map(x=><div key={x} className="h-32 animate-pulse rounded-2xl border border-white/[.06] bg-white/[.02]"/>)}
   {!loading&&!data.length&&<div className="rounded-2xl border border-dashed border-white/10 p-12 text-center"><Icon name="message" size={24} className="mx-auto text-neutral-700"/><p className="mt-3 text-sm text-neutral-500">No posts.</p></div>}
   {data.map(p=><article key={p.id} className="overflow-hidden rounded-2xl border border-white/[.08] bg-[#0d0d12]">
    <div className="p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-[9px] font-mono uppercase tracking-wider text-neutral-600">{p.status}</span><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-200">{p.content}</p></div><span className="shrink-0 text-[10px] text-neutral-600">{new Date(p.created_at).toLocaleString()}</span></div></div>
    {p.media_url&&<PostMedia url={p.media_url} mediaType={p.media_type}/>}
    <div className="flex flex-wrap items-center gap-3 border-t border-white/[.06] px-4 py-3 text-[10px] text-neutral-600"><span>{p.like_count||0} likes</span><span>{p.comment_count||0} comments</span><span className="ml-auto hidden font-mono sm:block">{p.id}</span>{p.status==='published'&&<button onClick={()=>hide(p.id)} className="rounded-lg border border-red-500/20 px-3 py-1.5 font-bold uppercase text-red-400 hover:bg-red-500/10">Hide post</button>}</div>
   </article>)}
  </div>
 </div></AdminLayout>
}
